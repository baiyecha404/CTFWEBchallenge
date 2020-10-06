FROM python:3.8

WORKDIR /app
COPY src /app
RUN pip install -r requirements.txt

CMD ["env", "FLASK_APP=app.py", "flask", "run", "--host=0.0.0.0", "--port=80"]
