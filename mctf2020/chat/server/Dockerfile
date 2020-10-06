FROM adoptopenjdk/openjdk14:alpine
WORKDIR /tmp/compile

COPY gradle ./gradle
COPY *.gradle ./
COPY gradlew ./
COPY src ./src

RUN ./gradlew --no-daemon build

FROM openjdk:14-alpine
ARG CHAT_FLAG

COPY --from=0 /tmp/compile/build/libs/chat-*.jar /app.jar
COPY healthcheck.sh healthcheck.sh
RUN apk add --no-cache curl
RUN echo $CHAT_FLAG > /flag.txt && chmod 444 /flag.txt && chmod +x /healthcheck.sh

EXPOSE 1234

CMD ["java", "-Dcom.sun.jndi.ldap.object.trustURLCodebase=true", "-jar", "/app.jar"]