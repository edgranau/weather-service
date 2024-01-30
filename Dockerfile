FROM --platform=linux/amd64 node:20-alpine
ENV NODE_ENV production
USER node
WORKDIR /app
COPY package.json .
RUN npm install --omit dev
COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]
