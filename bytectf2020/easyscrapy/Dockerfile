FROM python:2.7-onbuild

RUN mkdir -p /code

WORKDIR /code

COPY python .

RUN chmod +x /code/run.sh

ENTRYPOINT ["/code/run.sh"]
