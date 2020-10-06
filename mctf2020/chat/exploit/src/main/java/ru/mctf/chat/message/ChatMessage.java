package ru.mctf.chat.message;

import lombok.Data;

import java.util.List;

@Data
public class ChatMessage {

    private String name;
    private List<ChatMessageComponent> components;

}
