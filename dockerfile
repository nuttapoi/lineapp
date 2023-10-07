FROM node:10-alpine

# Create app directory
RUN mkdir -p /srv/app/node_modules && chown -R node:node /srv/app
# RUN groupadd -r nodejs && useradd -m -r -g -s /bin/bash nodejs nodejs
# RUN mkdir -p /srv/src/app/node_modules && chown -R nodejs:nodejs /srv/src/app
# USER nodejs

# VOLUME ["/srv/src/app"]
  
WORKDIR /srv/app
RUN npm install -g nodemon
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

USER node
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
# COPY --chown=node:node . .
# COPY . ./srv/app
# COPY . .
COPY --chown=node:node . .

EXPOSE 3000
# CMD [ "npm", "start" ]
# CMD ["nodemon", "index.js"]
# CMD [ "node", "index.js"]
CMD [ "nodemon", "index.js" ]