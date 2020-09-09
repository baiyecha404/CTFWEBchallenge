FROM node:14-alpine

ENV NODE_ENV=production

ADD challenge/flag.txt /flag.txt
RUN chmod 444 /flag.txt
RUN mv /flag.txt /flag-$(md5sum /flag.txt | awk '{print $1}').txt

WORKDIR /app

ADD challenge/package.json ./
RUN npm install --only=production

ADD challenge/app.js ./
ADD challenge/maze.js ./
ADD challenge/solve.js ./
ADD challenge/util.js ./
RUN chmod 555 *
RUN chown -R root:node /app

USER node
