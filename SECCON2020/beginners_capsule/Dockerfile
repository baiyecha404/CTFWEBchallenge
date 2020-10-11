FROM node:14-alpine

RUN apk add build-base libseccomp-dev git python3 && \
    npm install roryrjb/node-seccomp typescript ts-node @types/node

ADD tsconfig.json /

