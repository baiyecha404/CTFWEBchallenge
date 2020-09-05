FROM node
WORKDIR /data/
COPY ./src/flag.txt /
COPY ./src/app.js .
COPY ./src/config.js .
COPY ./src/static /data/static
COPY ./src/views /data/views
COPY ./src/package.json .
RUN npm install
EXPOSE 8000
CMD node app.js
