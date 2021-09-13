FROM hhvm/hhvm

RUN sed -i "s/http:\/\/archive.ubuntu.com/http:\/\/mirrors.ustc.edu.cn/g" /etc/apt/sources.list &&\
    apt update && apt install vim sudo -y 

COPY index.php /var/www/html/index.php

COPY start.sh /start.sh

RUN chmod +x /start.sh

WORKDIR /var/www/html
ENTRYPOINT [ "/start.sh" ]