# FROM node:18

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# RUN npm install -g serve
# CMD ["serve", "-s", "dist"]

# EXPOSE 3000


FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build # or appropriate build command

RUN npm install -g serve
CMD ["serve", "-s", "dist"]

EXPOSE 3000