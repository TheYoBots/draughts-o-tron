const DrsughtsUtils = require("../utils/DraughtsUtils");


/**
 * Pick a random legal move but prefer mates, checks and captures.
 */
class PatzerPlayer {

  getNextMove(moves) {
    const draughts = new DraughtsUtils();
    draughts.applyMoves(moves);
    const legalMoves = draughts.legalMoves();
    const forcing = draughts.filterForcing(legalMoves);
    const captures = legalMoves.filter(move => /x/.test(move.san));

    if (forcing.length) {
      return draughts.pickRandomMove(forcing);
    }

    if (captures.length) {
      return draughts.pickRandomMove(captures);
    }

    if (legalMoves.length) {
      return draughts.pickRandomMove(legalMoves);
    }
  }

  getReply(chat) {
    return "Hello";
  }

}

module.exports = PatzerPlayer;
