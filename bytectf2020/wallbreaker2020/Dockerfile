FROM ubuntu:18.04

ENV DEBIAN_FRONTEND=noninteractive

RUN sed -i "s/http:\/\/archive.ubuntu.com/http:\/\/mirrors.ustc.edu.cn/g" /etc/apt/sources.list &&\
    sed -i "s/http:\/\/security.ubuntu.com/http:\/\/mirrors.ustc.edu.cn/g" /etc/apt/sources.list

RUN apt update && apt install php vim gcc -y

RUN rm /var/www/html/index.html

COPY php.ini /etc/php/7.2/apache2/php.ini
COPY index.php /var/www/html/
COPY flag /flag
COPY readflag.c /readflag.c

RUN chmod 600 /flag &&\
    gcc -o /readflag readflag.c &&\
    chmod +xs /readflag && rm /readflag.c

CMD service apache2 restart & tail -F /var/log/apache2/access.log;
