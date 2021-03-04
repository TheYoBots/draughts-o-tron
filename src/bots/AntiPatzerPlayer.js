const DraughtsUtils = require("../utils/DraughtsUtils");


/**
 * Do not play moves that leave opponent with mate in one or checks or captures.
 * else random.
 * 
 */
class AntiPatzerPlayer {

  getNextMove(moves) {
    const draughts = new DraughtsUtils();
    draughts.applyMoves(moves);
    var legalMoves = draughts.legalMoves();

    if (legalMoves.length) {

      legalMoves.forEach(m => {
        draughts.move(m);
        const opponentsMoves = draughts.legalMoves();
        const opponentsMates = opponentsMoves.filter(move => /#/.test(move.san));
        const opponentsChecks = opponentsMoves.filter(move => /\+/.test(move.san));
        const opponentsCaptures = opponentsMoves.filter(move => /x/.test(move.san));
        m.metric = -opponentsMoves.length;
        m.metric += -opponentsCaptures.length * 10;
        m.metric += -opponentsChecks.length * 100;
        m.metric += -opponentsMates.length * 1000;
        draughts.undo();
      });

      // choose move that maximises metric
      return draughts.uci(legalMoves.reduce(this.randomMax));
    }
  }
  
  randomMax(a, b) {
    return (a.metric + Math.random() > b.metric + Math.random()) ? a : b;
  }

  getReply(chat) {
    return "Hello";
  }

}

module.exports = AntiPatzerPlayer;
