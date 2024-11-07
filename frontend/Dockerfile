FROM node:18

# Этап 1: сборка приложения
FROM node:18 AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование и установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование остальных файлов и сборка
COPY . .
RUN npm run build

# Этап 2: создание минимального образа для сервера
FROM node:18-slim

# Установка сервера serve для обслуживания статики
RUN npm install -g serve

# Копирование только необходимых файлов из builder-этапа
COPY --from=builder /app/dist /app/dist

# Запуск serve на порту 3000
CMD ["serve", "-s", "/app/dist"]

# Открываем порт
EXPOSE 3000
