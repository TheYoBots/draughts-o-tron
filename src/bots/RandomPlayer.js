const Draughts = require('draughts');

/**
 * Pick a random legal move.
 */
class RandomPlayer {

  getNextMove(moves) {
    var draughts = new Draughts();
    draughts.applyMoves(moves);
    var legalMoves = draughts.legalMoves();
    if (legalMoves.length) {
      return draughts.pickRandomMove(legalMoves);
    }
  }

  getReply(chat) {
    return "Hello";
  }

}

module.exports = RandomPlayer;