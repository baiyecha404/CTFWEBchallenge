package ru.mctf.chat.server;

import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.io.Output;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;
import ru.mctf.chat.message.ChatMessage;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Slf4j
public class SubscriptionManager {

    private final List<WebSocketSession> subscribers = new CopyOnWriteArrayList<>();

    private final Kryo kryo = new Kryo();

    public void addSubscriber(WebSocketSession session) {
        subscribers.add(session);
        log.info("User subscribed: {} ({})",
                Objects.requireNonNull(session.getRemoteAddress()).getHostName(),
                session.getId());
    }

    public void removeSubscriber(WebSocketSession session) {
        subscribers.remove(session);
        log.info("User unsubscribed: {} ({})",
                Objects.requireNonNull(session.getRemoteAddress()).getHostName(),
                session.getId());
    }

    public synchronized void broadcast(ChatMessage message) {
        final BinaryMessage encoded = objectToBinaryMessage(message);

        subscribers.forEach(s -> sendMessage(s, encoded));
    }

    private void sendMessage(WebSocketSession s, BinaryMessage encoded) {
        if (s.isOpen()) {
            try {
                s.sendMessage(encoded);
            } catch (IOException ignored) {
            }
        }
    }

    public BinaryMessage objectToBinaryMessage(Object object) {
        synchronized (kryo) {
            Output output = new Output(256, -1);
            kryo.writeClassAndObject(output, object);
            output.close();
            return new BinaryMessage(output.getBuffer());
        }
    }

}
