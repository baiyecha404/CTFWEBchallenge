FROM python:3.7-alpine

RUN apk --no-cache add gcc musl-dev python3-dev libffi-dev make
RUN pip install bottle gevent

RUN mkdir /miniblog

ADD challenge/miniblog /miniblog/
ADD challenge/flag /unpredicable_name_flag

RUN chown root:root -R /miniblog
RUN chmod 0775 /miniblog
RUN chmod -R 0775 /miniblog/main.py /miniblog/user_template /miniblog/views
RUN chmod 0773 /miniblog/tmp /miniblog/userdir
RUN chmod 0774 /unpredicable_name_flag

RUN adduser -S miniblog
USER miniblog
WORKDIR /miniblog

CMD python main.py

