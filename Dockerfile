FROM node:carbon

# Create App Directory
WORKDIR /usr/src/ride-matching-service

# Install app dependencies
COPY . .

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

EXPOSE 8080

RUN apt-get update && apt-get -y install cron

CMD [ "npm", "start" ]