package com.example.demo;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/hello") // клиент отправляет на /app/hello
    @SendTo("/topic/greetings") // сервер рассылает всем на /topic/greetings
    public Greeting greeting(HelloMessage message) {
        return new Greeting("Привет, " + message.name() + "!");
    }

    private record HelloMessage(String name) {}
    private record Greeting(String content) {}
}