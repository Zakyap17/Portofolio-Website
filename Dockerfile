# Stage 1 — Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2 — Production
FROM node:20-alpine
WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend/ ./backend/
COPY --from=frontend-build /frontend/dist ./frontend/dist

RUN mkdir -p ./backend/uploads

WORKDIR /app/backend
EXPOSE 3001
CMD ["node", "src/index.js"]
