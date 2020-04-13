FROM alpine
MAINTAINER Mrigank Krishan (mrigankkrishan@gmail.com)
# install required packages
RUN apk add -U python3 apache2 apache2-proxy php7-apache2
COPY ./src /code
COPY httpd.conf /usr/local/apache2/conf/httpd.conf
WORKDIR /code
RUN pip3 install -r requirements.txt
CMD ["/bin/sh", "-c", "httpd && gunicorn app:app"]
EXPOSE 80
