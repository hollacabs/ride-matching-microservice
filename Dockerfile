FROM node:carbon

# Create App Directory
WORKDIR /usr/src/ride-matching-server

# Install app dependencies
COPY . .

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

EXPOSE 3000

CMD [ "npm", "start" ]