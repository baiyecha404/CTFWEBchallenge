package top.bycsec;

import com.fasterxml.jackson.databind.ObjectMapper;
import cscg.user.User;
import cscg.user.UserConfig;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;

import java.security.MessageDigest;
import java.util.Arrays;


public class Demo {
    public static void main(String[] args) throws Exception {
        User user1 = new User();
        user1.setId(1);
        user1.setUsername("byc");
        user1.setPassword("404");
        user1.setIsAdmin(true);

        UserConfig config = new UserConfig();
        config.setUser(user1);
        config.setDebugMode(true);
        config.setLanguage(1);

        /*ObjectMapper objectMapper = new ObjectMapper();
        String jsonConfig = "{\"debugMode\":\"\",\"language\":1,\"user\": {\"user\"}}";
        UserConfig userConfig = objectMapper.readValue(jsonConfig, UserConfig.class);
        System.out.println(userConfig.getUser());*/

        MessageDigest digestStorage;
        digestStorage = MessageDigest.getInstance("SHA-1");
        digestStorage.update("1324343213".getBytes("ascii"));
        String pw1 = new String(Hex.encodeHex(digestStorage.digest()));
        System.out.println(pw1);

        System.out.println(new String(Hex.encodeHex(digestStorage.digest())));

    }
}
