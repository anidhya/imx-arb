FROM node:14

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

# COPY package*.json ./

# USER node

# RUN npm install

RUN npm install @imtbl/core-sdk --save

RUN npm install pm2 --save

# COPY --chown=node:node . .

# ENV NODE_ENV=production

# RUN npx sequelize-cli db:migrate

EXPOSE 8080

# CMD [ "node", "index.js" ]