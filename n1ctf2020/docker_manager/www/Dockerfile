FROM php:5.4.45-apache


COPY html /var/www/html/
COPY php.ini /usr/local/etc/php/php.ini
RUN chown -R root:root /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod 777 /var/www/html/img/
COPY flag /flag
COPY readflag /readflag
RUN chmod 555 /readflag
RUN chmod u+s /readflag
RUN chmod 500 /flag
CMD /usr/sbin/apache2 -k restart & tail -F /var/log/apache2/access.log;