FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]
