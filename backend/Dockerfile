FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --production

COPY . .

RUN npm run build || true

EXPOSE 3000
CMD ["npm", "run", "start"]
