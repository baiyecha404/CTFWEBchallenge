FROM ubuntu:18.04

RUN sed -i "s/http:\/\/archive.ubuntu.com/http:\/\/mirrors.ustc.edu.cn/g" /etc/apt/sources.list
RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get -y install tzdata
RUN apt-get -y install vim
RUN apt-get -y install apache2
RUN apt-get -y install php

RUN rm /var/www/html/index.html
COPY index.php /var/www/html/
RUN chmod -R 755 /var/www/html/

COPY flag /tmp/flag
RUN cat /tmp/flag > /var/www/html/`cat /tmp/flag`
RUN rm -rf /tmp/flag

CMD service apache2 restart & tail -F /var/log/apache2/access.log;


