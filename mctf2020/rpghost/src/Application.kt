package ru.mctf

import com.google.common.io.Resources
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.jackson.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.util.*
import java.io.File
import java.io.FileNotFoundException
import java.io.IOException
import java.security.MessageDigest
import java.util.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

private val storageService = StorageService()

private val sha256 = MessageDigest.getInstance("SHA-256")
private val flagHash: ByteArray = getFlagHash()

@KtorExperimentalAPI
@Suppress("unused", "UnstableApiUsage")
fun Application.module() {
    install(Compression)

    install(ContentNegotiation) {
        jackson {
        }
    }

    install(StatusPages) {
        exception<FileNotFoundException> {
            call.respond(HttpStatusCode.NotFound)
        }
        exception<Exception> { cause ->
            log.error("Application exception", cause)
            call.respond(HttpStatusCode.InternalServerError, cause.message ?: "Unknown error")
        }
    }

    routing {
        route("/api") {
            post("uploadFiles") {
                val multipart = call.receiveMultipart()
                if (call.request.isMultipart()) {
                    val parts = multipart.readAllParts()
                    val files = parts.filterIsInstance<PartData.FileItem>()
                    call.respond(storageService.uploadFiles(files))
                } else {
                    throw FileStorageException("Request is not multipart")
                }
            }

            post("uploadZip") {
                val multipart = call.receiveMultipart()
                if (call.request.isMultipart()) {
                    val parts = multipart.readAllParts()

                    var zip: PartData.FileItem? = null
                    if (parts.size == 1) {
                        val part = parts[0]
                        if (part is PartData.FileItem) {
                            zip = part
                        }
                    }

                    if (zip != null) {
                        call.respond(storageService.uploadZip(zip))
                    } else {
                        throw FileStorageException("Incorrect file upload")
                    }
                } else {
                    throw FileStorageException("Request is not multipart")
                }
            }

            post("confirm") {
                val savedFile = call.receive<StoredFile>()
                call.respond(storageService.confirmFile(savedFile))
            }

        }

        get("/healthcheck") {
            try {
                if (flagHash.contentEquals(getFlagHash())) {
                    call.respondText("ok")
                } else {
                    call.respondText("hash")
                }
            } catch (e: IOException) {
                log.warn("Flag read", e)
                call.respondText("io")
            }
        }

        get("/get/{id}") {
            val id = call.parameters["id"]
            val uuid = UUID.fromString(id)
            val buf = storageService.getStoredFileData(uuid)
            call.respondBytesWriter {
                writeFully(buf)
            }
        }

        get("/") {
            call.respondText(Resources.getResource("static/index.html").readText(), contentType = ContentType.Text.Html)
        }

        static() {
            resources("static")
        }
    }

}

private fun getFlagHash(): ByteArray {
    val flag = File("/flag.txt").readText()
    return sha256.digest(flag.toByteArray())
}

