const DraughtsUtils = require("../utils/DraughtsUtils");


/**
 * Pick a random legal move.
 */
class RandomPlayer {

  getNextMove(moves) {
    const draughts = new DraughtsUtils();
    draughts.applyMoves(moves);
    const legalMoves = draughts.legalMoves();
    if (legalMoves.length) {
      return draughts.pickRandomMove(legalMoves);
    }
  }

  getReply(chat) {
    return "Hello";
  }

}

module.exports = RandomPlayer;
