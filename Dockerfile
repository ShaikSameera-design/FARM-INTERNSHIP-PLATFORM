# Single-origin production image: builds the React app and serves it from FastAPI.
FROM node:20-alpine AS web
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim
WORKDIR /srv
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend ./backend
COPY --from=web /app/frontend/dist ./frontend/dist
ENV ENVIRONMENT=production FRONTEND_DIST=/srv/frontend/dist PORT=8000
WORKDIR /srv/backend
# Run ONE worker: call signalling rooms are kept in process memory.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --workers 1 --proxy-headers --forwarded-allow-ips='*'"]
