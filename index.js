const express         = require('express');
const PORT            = process.env.PORT || 5000;

const LidraughtsApi      = require('./api/lidraughts-api');
const ScanEngineBot = require('./bots/scan-engine');
const DraughtOTron   = require('./bots/draught-o-tron');

const token           = process.env.API_TOKEN;

/**
 * Start a DraughtOTron (lidraughts account defined by API_TOKEN) that listens for challenges
 * and spawns games for unrated challenges. A player object must be supplied that can
 * produce the next move to play given the previous moves.
 * 
 * Token can be created on BOT accounts at https://lidraughts.org/account/oauth/token/create
 * Put the token in the shell environment with
 * 
 * export API_TOKEN=xxxxxxxxxxxxxx
 * yarn install
 * yarn start
 * 
 */

    async function startBot(token, player) {
        if (token) {
            const robot = new DraughtOTron(new LidraughtsApi(token), player);
            const username = (await robot.start()).data.username;
            return `<a href="https://lidraughts.org/@/${username}">${username}</a> on lidraughts.</h1><br/>`;
        }
    }

    async function begin() {
        var links = "<h1>Challenge:</h1><br/>";

        links += await startBot(token, new ScanEngineBot());

        // heroku wakeup server (not necessary otherwise)

        express()
            .get("/", (req, res) => res.send(links))
            .listen(PORT, () => console.log(`draught-o-tron started and listening on ${PORT}`));
    }
  
  begin();
