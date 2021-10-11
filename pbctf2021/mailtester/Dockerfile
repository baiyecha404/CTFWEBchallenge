FROM ubuntu:focal-20210609

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y postfix ruby ruby-dev build-essential libsqlite3-dev xxd zlib1g-dev netcat curl

RUN echo "dash dash/sh boolean false" | debconf-set-selections
RUN dpkg-reconfigure dash

RUN gem install bundler
RUN mkdir /app
ADD mail_tester/Gemfile mail_tester/Gemfile.lock /app/

WORKDIR /app
RUN bundle

ADD mail_tester /app

ADD flag.txt /flag.txt

RUN useradd -ms /bin/bash app
RUN chmod -R 777 /app/tmp

RUN sed -i 's/inet_protocols = all/inet_protocols = ipv4/' /etc/postfix/main.cf
RUN sed -i "s/smtp      inet  n/#smtp      inet  n/" /etc/postfix/master.cf

# port 25 is blocked by gcp, connect to 2525 instead
RUN sed -i "s/smtp\t\t25/smtp\t\t2525/" /etc/services

EXPOSE 3000

ADD start.sh /start.sh
CMD /start.sh