package dev.arxenix;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class Demo {
    public static void main(String[] args) {
        String note = "abc㋛";
        char c = (char) 0xd801;
        String s = Character.toString(c);
        System.out.println(URLEncoder.encode(s));
        //System.out.println(URLDecoder.decode(URLEncoder.encode(note, StandardCharsets.UTF_8)));
    }

}
