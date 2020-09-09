FROM python:3.7-alpine


RUN apk --no-cache add gcc musl-dev python3-dev libffi-dev make

ADD challenge/requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

ADD challenge/ /
CMD python main.py

