FROM python:3.11.1

COPY ./backend /app/backend

COPY requirements.txt /app
RUN pip3 install -r requirements.txt

WORKDIR /app/backend

CMD ["uvicorn", "backend.asgi:app", "--host", "0.0.0.0", "--port", "80"]