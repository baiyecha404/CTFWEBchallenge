package ru.mctf.chat.server;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;
import ru.mctf.chat.message.ErrorMessage;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

@Component
@Slf4j
public class WebSocketHandler extends BinaryWebSocketHandler {

    private final ChatService chatService;
    private final SubscriptionManager subscriptionManager;

    @Autowired
    public WebSocketHandler(ChatService chatService, SubscriptionManager subscriptionManager) {
        this.chatService = chatService;
        this.subscriptionManager = subscriptionManager;
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws IOException {
        log.info("Received message from {}", session.getId());

        try {
            chatService.processNewMessage(message);
        } catch (ChatException e) {
            respondWithError(session, e.getMessage());
        } catch (Exception e) {
            log.info("WS Handler", e);
            respondWithError(session, getStackTrace(e));
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable e) throws Exception {
        if (e instanceof IOException) {
            return;
        }

        log.info("WS Handler", e);
        respondWithError(session, getStackTrace(e));
    }

    private String getStackTrace(Throwable e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }

    private void respondWithError(WebSocketSession session, String text) {
        if (!session.isOpen()) {
            return;
        }

        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.setMessage(text);

        try {
            session.sendMessage(subscriptionManager.objectToBinaryMessage(errorMessage));
        } catch (IOException ignored) {
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        chatService.addNewRecipient(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        chatService.removeRecipient(session);
    }

}
