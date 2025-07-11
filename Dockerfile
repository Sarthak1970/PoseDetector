FROM python:3.10-slim

WORKDIR /Server

RUN apt-get update && apt-get install -y \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY Server/requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY Server/ ./

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
