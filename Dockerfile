FROM --platform=linux/amd64 node:21-alpine
WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "all-prod"]