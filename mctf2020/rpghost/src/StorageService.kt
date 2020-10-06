package ru.mctf

import com.google.common.cache.CacheBuilder
import com.google.common.cache.CacheLoader
import com.google.common.cache.LoadingCache
import com.google.common.util.concurrent.UncheckedExecutionException
import io.ktor.http.*
import io.ktor.http.content.*
import net.lingala.zip4j.ZipFile
import net.lingala.zip4j.model.FileHeader
import org.apache.commons.io.FileUtils
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File
import java.io.FileNotFoundException
import java.nio.ByteBuffer
import java.nio.file.Files
import java.nio.file.LinkOption
import java.util.*
import java.util.concurrent.ExecutionException
import java.util.concurrent.TimeUnit


class StorageService {

    private val tmpFilesDir = createTempDir(prefix = "sharing_files_", suffix = "")
    private val storedFilesDir = File("stored_files")

    private val log: Logger = LoggerFactory.getLogger(this.javaClass)

    private val metadataCache = CacheBuilder.newBuilder()
        .maximumSize(500)
        .expireAfterAccess(5, TimeUnit.MINUTES)
        .build<UUID, StoredFileMetadata>(CacheLoader.from { id: UUID? ->
            id?.let {
                getFileMetadata(File(storedFilesDir, id.toString()))
            }
        })

    private val fileCache = CacheBuilder.newBuilder()
        .maximumSize(500)
        .expireAfterAccess(1, TimeUnit.MINUTES)
        .build<UUID, ByteBuffer>(CacheLoader.from { id: UUID? ->
            id?.let {
                ByteBuffer.wrap(getStoredFile(it).readBytes())
            }
        })

    init {
        storedFilesDir.mkdirs()
        tmpFilesDir.deleteOnExit()

        log.info("tmpFilesDir = ${tmpFilesDir.absolutePath}")
        log.info("storedFilesDir = ${storedFilesDir.absolutePath}")
    }

    fun getStoredFileData(id: UUID): ByteBuffer {
        return loadFromCache(fileCache, id)
    }

    private fun getStoredFile(id: UUID): File {
        val meta = loadFromCache(metadataCache, id)
        if (meta.isLink) {
            throw FileStorageException("Symlinks are not allowed")
        }
        if (meta.isDirectory) {
            throw FileStorageException("Directories are not allowed")
        }

        return File(storedFilesDir, id.toString())
    }

    fun uploadFiles(files: List<PartData.FileItem>): List<TempFile> {
        return files.map { item ->
            val id = UUID.randomUUID()
            val file = File(tmpFilesDir, id.toString())
            item.streamProvider().use { input ->
                file.outputStream().buffered().use { output -> input.copyTo(output) }
            }
            validateFileSize(file)
            log.info("Storing ${item.originalFileName} as $id")
            TempFile(id, item.originalFileName ?: "file.data", file.length())
        }
    }

    fun uploadZip(zip: PartData.FileItem): List<TempFile> {
        if (zip.contentType != ContentType.Application.Zip) {
            throw FileStorageException("File in not zip")
        }

        val zipFile = createTempFile(suffix = ".zip")
        zip.streamProvider().use { input ->
            zipFile.outputStream().buffered().use { output -> input.copyTo(output) }
        }
        validateFileSize(zipFile)

        try {
            return unpackZip(zipFile)
        } finally {
            zipFile.delete()
        }
    }

    fun confirmFile(savedFile: StoredFile): StoredFile {
        val file = File(tmpFilesDir, savedFile.tmpId.toString())

        if (!file.exists()) {
            throw FileNotFoundException()
        }

        val target = File(storedFilesDir, savedFile.id.toString())
        if (target.exists()) {
            target.deleteRecursively()
        }

        when {
            target.isDirectory -> {
                FileUtils.moveDirectory(file, target)
            }
            Files.isSymbolicLink(file.toPath()) -> {
                Files.move(file.toPath(), target.toPath(), LinkOption.NOFOLLOW_LINKS)
            }
            else -> {
                FileUtils.moveFile(file, target)
            }
        }
        log.info("Saving ${savedFile.tmpId} as ${savedFile.id}")

        return savedFile
    }

    private fun unpackZip(file: File): List<TempFile> {
        val zip = ZipFile(file)

        if (!zip.isValidZipFile) {
            throw FileStorageException("Corrupt zip file")
        }

        if (zip.isEncrypted) {
            throw FileStorageException("Corrupt zip file")
        }

        return zip.fileHeaders.asSequence().filterIsInstance<FileHeader>()
            .filter { !it.isDirectory }
            .filter { it.uncompressedSize < MAX_FILE_SIZE }
            .take(20)
            .map {
                val id = UUID.randomUUID()
                zip.extractFile(it, tmpFilesDir.path, id.toString())
                log.info("Storing ${it.fileName} from zip as $id")
                TempFile(id, it.fileName, it.uncompressedSize)
            }
            .toList()
    }

    private fun validateFileSize(file: File) {
        if (file.length() > MAX_FILE_SIZE) {
            file.delete()
            throw FileStorageException("File too large")
        }
    }

    private fun getFileMetadata(file: File): StoredFileMetadata {
        if (!file.exists()) {
            throw FileNotFoundException()
        }

        return StoredFileMetadata(file.isFile, file.isDirectory, Files.isSymbolicLink(file.toPath()))
    }

    private fun <K, V> loadFromCache(cache: LoadingCache<K, V>, key: K): V {
        try {
            return cache.get(key)
        } catch (e: ExecutionException) {
            throw e.cause!!
        } catch (e: UncheckedExecutionException) {
            throw e.cause!!
        }
    }

    companion object {
        const val MAX_FILE_SIZE = 1024 * 1024 * 10  // 10 megabytes
    }

}