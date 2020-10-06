package ru.mctf.chat.client;

import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.io.ByteBufferInput;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;
import com.formdev.flatlaf.FlatIntelliJLaf;
import lombok.SneakyThrows;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;
import ru.mctf.chat.message.ChatMessage;
import ru.mctf.chat.message.ChatMessageComponent;
import ru.mctf.chat.message.ChatMessageComponentType;
import ru.mctf.chat.message.ErrorMessage;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class ChatClient extends BinaryWebSocketHandler {

    private WebSocketSession wsSession;

    private final Kryo kryo = new Kryo();
    private JTextField usernameField;
    private JTextField messageTextField;
    private JTextField imageLinkField;
    private JPanel messagesPanel;
    private JButton sendButton;
    private JScrollPane scrollPane;

    public static void main(String[] args) throws Exception {
        new ChatClient().run();
    }

    private void run() throws ExecutionException, InterruptedException {
        createWindow();

        StandardWebSocketClient wsClient = new StandardWebSocketClient();
        wsSession = wsClient.doHandshake(this, new WebSocketHttpHeaders(), URI.create("ws://chat.mctf.online")).get();
    }

    private void createWindow() {
        System.setProperty("awt.useSystemAAFontSettings","on");
        System.setProperty("swing.aatext", "true");

        FlatIntelliJLaf.install();

        JFrame frame = new JFrame("M*CTF Chat");
        frame.setResizable(false);
        Box windowPanel = new Box(BoxLayout.Y_AXIS);
        windowPanel.setBorder(new EmptyBorder(0, 0, 5, 0));

        frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        frame.setSize(600, 800);

        windowPanel.add(createMessagesPanel());
        windowPanel.add(createComponentsPanel());
        windowPanel.add(createSendButton());

        frame.setContentPane(windowPanel);
        frame.setVisible(true);
    }

    private JPanel createComponentsPanel() {
        JLabel usernameLabel = new JLabel("Name:");
        usernameField = new JTextField(20);
        usernameField.getDocument().addDocumentListener(getComponentFieldListener());
        JLabel messageTextLabel = new JLabel("Text:");
        messageTextField = new JTextField(140);
        messageTextField.getDocument().addDocumentListener(getComponentFieldListener());
        JLabel imageLinkLabel = new JLabel("Image link:");
        imageLinkField = new JTextField(140);
        imageLinkField.getDocument().addDocumentListener(getComponentFieldListener());

        JPanel componentsPanel = new JPanel(new GridLayout(3, 2));
        componentsPanel.setBorder(new EmptyBorder(10, 10, 10, 10));

        componentsPanel.add(usernameLabel);
        componentsPanel.add(usernameField);
        componentsPanel.add(messageTextLabel);
        componentsPanel.add(messageTextField);
        componentsPanel.add(imageLinkLabel);
        componentsPanel.add(imageLinkField);

        return componentsPanel;
    }

    private JScrollPane createMessagesPanel() {
        this.messagesPanel = new JPanel();
        messagesPanel.setLayout(new BoxLayout(messagesPanel, BoxLayout.Y_AXIS));

        this.scrollPane = new JScrollPane(messagesPanel);
        scrollPane.getVerticalScrollBar().setUnitIncrement(10);
        scrollPane.setPreferredSize(new Dimension(600, 600));

        return scrollPane;
    }

    private JButton createSendButton() {
        this.sendButton = new JButton("Send");

        sendButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        sendButton.setEnabled(false);
        sendButton.addActionListener(actionEvent -> onClickSend());

        return sendButton;
    }

    @SneakyThrows
    private void onClickSend() {
        ChatMessage message = new ChatMessage();
        message.setName(usernameField.getText());
        List<ChatMessageComponent> components = new ArrayList<>();

        if (!messageTextField.getText().isBlank()) {
            ChatMessageComponent textComponent = new ChatMessageComponent();
            textComponent.setType(ChatMessageComponentType.TEXT);
            textComponent.setValue(messageTextField.getText());
            components.add(textComponent);
        }

        if (!imageLinkField.getText().isBlank()) {
            ChatMessageComponent imageComponent = new ChatMessageComponent();
            imageComponent.setType(ChatMessageComponentType.IMAGE);
            imageComponent.setValue(imageLinkField.getText());
            components.add(imageComponent);
        }

        message.setComponents(components);

        sendMessage(message);
    }

    private void sendMessage(ChatMessage message) throws IOException {
        Output output = new Output(256, -1);
        kryo.writeObject(output, message);
        output.close();

        wsSession.sendMessage(new BinaryMessage(output.getBuffer()));
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        Input input = new ByteBufferInput(message.getPayload());
        Object decoded = kryo.readClassAndObject(input);

        if (decoded instanceof ChatMessage) {
            addNewMessage((ChatMessage) decoded);
        } else if (decoded instanceof ErrorMessage) {
            ErrorMessage errorMessage = (ErrorMessage) decoded;
            System.err.println("Received error: " + errorMessage.getMessage());
            JOptionPane.showMessageDialog(null, errorMessage.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void addNewMessage(ChatMessage message) {
        Box messagePanel = Box.createVerticalBox();
        messagePanel.setBorder(new EmptyBorder(5, 5, 5, 5));

        messagePanel.add(createTitle(message.getName()));

        for (ChatMessageComponent component : message.getComponents()) {
            switch (component.getType()) {
                case TEXT:
                    messagePanel.add(createText(component.getValue()));
                    break;
                case IMAGE:
                    messagePanel.add(createImage(component.getValue()));
                    break;
            }
        }

        messagesPanel.add(messagePanel);
        messagesPanel.revalidate();
        scrollPane.validate();

        JScrollBar scrollBar = scrollPane.getVerticalScrollBar();
        scrollBar.setValue(scrollBar.getMaximum());
    }

    private JLabel createTitle(String username) {
        JLabel label = new JLabel(String.format("<html><b>%s</b> sent at %s:</html>",
                username,
                LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"))));
        label.setBorder(new EmptyBorder(5, 0, 5, 0));
        return label;
    }

    private JLabel createText(String text) {
        JLabel label = new JLabel(text);
        label.setBorder(new EmptyBorder(5, 0, 5, 0));
        return label;
    }

    private JLabel createImage(String url) {
        JLabel label = new JLabel();
        label.setBorder(new EmptyBorder(5, 0, 5, 0));

        try {
            Image img = ImageIO.read(new URL(url));

            boolean change = false;
            int width = img.getWidth(null);
            int height = img.getHeight(null);

            while (width > 500 || height > 500) {
                width /= 2;
                height /= 2;
                change = true;
            }

            if (change) {
                img = img.getScaledInstance(width, height, Image.SCALE_DEFAULT);
            }

            ImageIcon icon = new ImageIcon(img);

            label.setIcon(icon);
        } catch (IOException e) {
            label.setText("Error downloading file " + url);
        }

        return label;
    }

    private DocumentListener getComponentFieldListener() {
        return new DocumentListener() {

            private void validate() {
                boolean nameFilled = !usernameField.getText().isBlank();
                boolean textFilled = !messageTextField.getText().isBlank();
                boolean imageFilled = !imageLinkField.getText().isBlank();

                sendButton.setEnabled(wsSession.isOpen() && nameFilled && (textFilled || imageFilled));
            }

            @Override
            public void insertUpdate(DocumentEvent documentEvent) {
                validate();
            }

            @Override
            public void removeUpdate(DocumentEvent documentEvent) {
                validate();
            }

            @Override
            public void changedUpdate(DocumentEvent documentEvent) {
                validate();
            }
        };
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.exit(0);
    }
}
