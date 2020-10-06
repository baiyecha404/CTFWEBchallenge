FROM adoptopenjdk/openjdk14:alpine
WORKDIR /tmp/compile

COPY gradle ./gradle
COPY *.gradle ./
COPY gradlew ./
COPY gradle.properties ./
COPY src ./src
COPY resources ./resources

RUN ./gradlew --no-daemon build

FROM adoptopenjdk/openjdk14:alpine-jre
ARG SHARING_FLAG

COPY --from=0 /tmp/compile/build/libs/file-sharing-*.jar /app.jar
COPY healthcheck.sh healthcheck.sh
RUN apk add --no-cache curl
RUN echo $SHARING_FLAG > /flag.txt && chmod 444 /flag.txt && chmod +x /healthcheck.sh

EXPOSE 3456

CMD ["java", "-jar", "/app.jar"]