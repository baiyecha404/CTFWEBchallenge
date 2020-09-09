FROM php:7.3-apache

ADD challenge/flag.php /var/www/flag.php
ADD challenge/html /var/www/html

RUN chown root:www-data /var/www/
RUN chown root:www-data /var/www/flag.php
RUN chown root:www-data /var/www/html/index.php

RUN chmod 0775 /var/www
RUN chmod 0755 /var/www/flag.php
RUN chmod 0755 /var/www/html/index.php

