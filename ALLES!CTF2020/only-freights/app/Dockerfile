FROM node:14-alpine as builder

RUN apk add gcc libc-dev
COPY guard.c /guard.c
RUN gcc -o /guard /guard.c

FROM node:14-alpine

COPY --from=builder /guard /guard
COPY flag.txt /flag.txt
# ensure RCE is needed to get the flag
RUN chown 1337:1337 /guard /flag.txt \
    && chmod 4755 /guard \
    && chmod 600 /flag.txt

WORKDIR /app
ENV NODE_ENV=production

# install dependencies
COPY package.json package-lock.json /app/
RUN npm install

# add the actual app
ADD server.js data.json /app/
ADD ./static /app/static

ENV BIND_ADDR=0.0.0.0 PORT=1337
EXPOSE 1337

USER 1000:1000

CMD ["npm", "start"]
