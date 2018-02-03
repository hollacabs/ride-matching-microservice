# to find absolute path of node installation, run bash command 'which node'
# find absolute path to your node installation - '/Users/student/.nvm/versions/node/v6.9.5/bin/node'
# find absolute path to file you want to execute using cron '/Users/student/Desktop/hrsf86-web-historian/workers/htmlfetcher.js'
# crontab -e
# use VIM editor to enter the following line. 'i' to enter insert mode. Type the below line. 'Escape' key to exit insert mode. :w to save file. :q to quit. 
# */1 * * * * /Users/student/.nvm/versions/node/v6.9.5/bin/node /Users/student/Desktop/hrsf86-web-historian/workers/htmlfetcher.js
# run below to check if your crontab is running
# crontab -l

*/1 * * * * /usr/local/bin/node /Users/albert/Documents/GitHub/ride-matching-microservice/background-worker/refreshRedis.js