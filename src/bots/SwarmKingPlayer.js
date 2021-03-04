const DraughtsUtils = require("../utils/DraughtsUtils");


/**
 * Move pieces closer to own king - mate and check if possible.
 */
class SwarmKingPlayer {

  getNextMove(moves) {
    const draughts = new DraughtsUtils();
    draughts.applyMoves(moves);
    var legalMoves = draughts.legalMoves();
    const forcing = draughts.filterForcing(legalMoves);

    if (forcing.length) {
      return draughts.pickRandomMove(forcing);
    }

    legalMoves = this.removeReverseMoves(moves, legalMoves);

    if (legalMoves.length) {
      const colour = draughts.turn();

      // get distance to king in all successor states
      legalMoves.forEach(m => {
        draughts.move(m);
        const squareOfKing = draughts.squareOfOpponentsKing();
        m.metric = this.distanceMetric(draughts, squareOfKing, colour);
        draughts.undo();
      });

      // choose move that maximises metric
      return draughts.uci(legalMoves.reduce(this.randomMax));
    }
  }

  randomMax(a, b) {
    return (a.metric + Math.random() > b.metric + Math.random()) ? a : b;
  }

  removeReverseMoves(previousUciMoves, legalMoves) {
    const filtered = legalMoves.filter(move => !previousUciMoves.includes(move.to + move.from));
    return filtered.length === 0 ? legalMoves : filtered;
  }

  /**
   * Sum of (16 - manhattan distance to king) for each piece of given colour.
   */
  distanceMetric(draughts, targetSquare, colour) {
    const target = draughts.coordinates(targetSquare);
    const distances = draughts.squaresOf(colour).map(square => 16 - draughts.manhattanDistance(target, draughts.coordinates(square)));
    return distances.reduce((a, b) => a + b, 0);
  }

  getReply(chat) {
    return "Hello";
  }

}

module.exports = SwarmKingPlayer;
