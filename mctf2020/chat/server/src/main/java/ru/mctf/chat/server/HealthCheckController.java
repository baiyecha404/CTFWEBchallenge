package ru.mctf.chat.server;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

@RestController
@Slf4j
public class HealthCheckController {

    private final MessageDigest digest = MessageDigest.getInstance("SHA-256");

    private byte[] flagHash;

    public HealthCheckController() throws NoSuchAlgorithmException {
    }

    @PostConstruct
    public void init() throws IOException {
        flagHash = getFlagHash();
    }

    @GetMapping("healthcheck")
    public String healthcheck() {
        try {
            return Arrays.equals(flagHash, getFlagHash()) ? "ok" : "hash";
        } catch (IOException e) {
            log.warn("Flag read", e);
            return "io";
        }
    }

    private byte[] getFlagHash() throws IOException {
        String flag = Files.readString(new File("/flag.txt").toPath());
        return digest.digest(flag.getBytes());
    }

}
