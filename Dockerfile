FROM node:carbon

# Create App Directory
WORKDIR /usr/src/ride-matching-service

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]