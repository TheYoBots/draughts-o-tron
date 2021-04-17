const Game = require("../models/game");

/**
 * draught-o-tron listens for challenges and spawns Games on accepting.
 *  
 */
class DraughtOTron {

  /**
   * Initialise with access token to lidraughts and a player engine.
   */
    constructor(api, player) {
        this.api = api;
        this.player = player;
    }

    async start() {
        this.account = await this.api.accountInfo();
        console.log("Playing as " + this.account.data.username);
        this.api.streamEvents((event) => this.eventHandler(event));
        return this.account;
    }

    eventHandler(event) {
        switch (event.type) {
            case "challenge":
                this.handleChallenge(event.challenge);
                break;
            case "gameStart":
                this.handleGameStart(event.game.id);
                break;
            default:
                console.log("Unhandled event : " + JSON.stringify(event));
        }
    }

    handleGameStart(id) {
        const game = new Game(this.api, this.account.data.username, this.player);
        game.start(id);
    }

    async handleChallenge(challenge) {
        if (challenge.rated) {
            console.log("Declining rated challenge from " + challenge.challenger.id);
            const response = await this.api.declineChallenge(challenge.id);
            console.log("Declined", response.data || response);
        }
        else {
            console.log("Accepting unrated challenge from " + challenge.challenger.id);
            const response = await this.api.acceptChallenge(challenge.id);
            console.log("Accepted", response.data || response);
        }
    }

}

module.exports = DraughtOTron;