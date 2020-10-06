package ru.mctf.chat.message;

import lombok.Data;

@Data
public class ChatMessageComponent {

    private ChatMessageComponentType type;
    private String value;

}
