FROM ghcr.io/ggerganov/llama.cpp:light-cuda--b1-917dc8c

COPY . /app

RUN pip install -r requirements.txt

CMD ["python", "run", "src/app.py"] 