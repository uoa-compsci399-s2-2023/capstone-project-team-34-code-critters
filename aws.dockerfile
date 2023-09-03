FROM python:3.11.1-slim-buster

# Set environment variables
ENV FLASK_ENV="production"
ENV FLASK_DEPLOYMENT="server"
ENV UPLOAD_FOLDER="./library/static/uploads/"
ENV STORAGE_FOLDER = './library/static/storage/'
ENV MODEL_FOLDER = './library/models/'
ENV ALLOWED_EXTENSIONS = ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif']


# Copy over relevant files
WORKDIR /app
COPY ./backend /app
COPY ./backend/library /app/library

# Overwrite environment variables to .env file
RUN echo "FLASK_ENV='${FLASK_ENV}'" > /app/.env && \
    echo "FLASK_DEPLOYMENT='${FLASK_DEPLOYMENT}'" >> /app/.env && \
    echo "UPLOAD_FOLDER='${UPLOAD_FOLDER}'" >> /app/.env && \
    echo "STORAGE_FOLDER='${STORAGE_FOLDER}'" >> /app/.env && \
    echo "MODEL_FOLDER='${MODEL_FOLDER}'" >> /app/.env && \
    echo "ALLOWED_IMAGE_EXTENSIONS=['PNG', 'JPG', 'JPEG', 'GIF']" >> /app/.env

# Install dependencies
RUN pip3 install --no-cache-dir --no-deps -r ubuntu_requirements.txt

EXPOSE 6789
# Run the server
# CMD ["cat", "/app/.env"]
CMD ["uvicorn", "prod_asgi:app", "--host", "0.0.0.0", "--port", "6789"]