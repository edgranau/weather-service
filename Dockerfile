FROM --platform=linux/amd64 node:20-alpine
ENV NODE_ENV production
USER node
WORKDIR /app
COPY package.json .
RUN npm install --omit dev
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]
