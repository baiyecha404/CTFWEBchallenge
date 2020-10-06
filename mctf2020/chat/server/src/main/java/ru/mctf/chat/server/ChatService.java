package ru.mctf.chat.server;

import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.io.Input;
import org.objenesis.strategy.StdInstantiatorStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;
import ru.mctf.chat.message.ChatMessage;
import ru.mctf.chat.message.ChatMessageComponent;

import java.util.List;

@Service
public class ChatService {

    private final SubscriptionManager subscriptionManager;

    @Autowired
    public ChatService(SubscriptionManager subscriptionManager) {
        this.subscriptionManager = subscriptionManager;
    }

    public void processNewMessage(BinaryMessage raw) {
        Kryo kryo = new Kryo();
        kryo.setInstantiatorStrategy(new Kryo.DefaultInstantiatorStrategy(new StdInstantiatorStrategy()));
        Input input = new Input(raw.getPayload().array());
        ChatMessage message = kryo.readObject(input, ChatMessage.class);

        validateName(message.getName());
        validateComponents(message.getComponents());

        subscriptionManager.broadcast(message);
    }

    private void validateName(String name) {
        if (name == null || name.isEmpty() || name.length() > 20) {
            throw new ChatException("Illegal name");
        }
    }

    private void validateComponents(List<ChatMessageComponent> components) {
        if(components == null || components.isEmpty()) {
            throw new ChatException("Empty message");
        }
        if (components.size() > 10) {
            throw new ChatException("Too many components in the message");
        }
        components.forEach(this::validateComponent);
    }

    private void validateComponent(ChatMessageComponent component) {
        switch (component.getType()) {
            case TEXT -> validateText(component);
            case IMAGE -> validateImage(component);
        }
    }

    private void validateText(ChatMessageComponent component) {
        String value = component.getValue();

        if (value.length() > 140) {
            throw new ChatException("Message is too long");
        }
    }

    private void validateImage(ChatMessageComponent component) {
        String url = component.getValue();

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            throw new ChatException("Incorrect URL");
        }

        int end = Math.max(-1, url.indexOf('#'));
        int questionMark = url.indexOf('?');
        if (questionMark != -1 && (end == -1 || questionMark < end)) {
            end = questionMark;
        }

        if (end != -1) {
            url = url.substring(0, end);
        }

        if (!url.endsWith(".png") && !url.endsWith(".jpg") && !url.endsWith(".jpeg")) {
            throw new ChatException("Only JPEGs and PNGs are supported");
        }
    }

    public void addNewRecipient(WebSocketSession session) {
        subscriptionManager.addSubscriber(session);
    }

    public void removeRecipient(WebSocketSession session) {
        subscriptionManager.removeSubscriber(session);
    }

}
