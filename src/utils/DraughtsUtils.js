var Draughts = require("draughts.js").Draughts;


/**
 * Wraps draughts.js with useful extras.
 */
class DraughtsUtils {

  constructor(fen = "W:W31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50:B1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20:H0:F1") {
    this.draughts = new draughts(fen);
  }

  reset() {
    this.draughts.reset();
  }

  applyMoves(moves) {
    moves.forEach(move => this.draughts.move(move, { sloppy: true }));
  }

  /**
   * Convert a draughts.js move to a hub move
   */
  hub(move) {
    return move.from + move.to + (move.flags === "b" ? move.piece : "");
  }

  /**
   * Legal moves from current position.
   */
  legalMoves() {
    return this.draughts.moves({ verbose: true });
  }

  fen() {
    return this.draughts.fen();
  }

  move(move) {
    this.draughts.move(move);
  }

  undo() {
    this.draughts.undo();
  }

  turn() {
    return this.draughts.turn();
  }

  squaresOf(colour) {
    return this.draughts.SQUARES.filter(square => {
      var r = this.draughts.get(square);
      return r && r.color === colour;
    });
  }

  squaresOfPiece(colour, pieceType) {
    return this.squaresOf(colour).find(square => this.draughts.get(square).type.toLowerCase() === pieceType);
  }

  coordinates(square) {
    return { x: square.charCodeAt(0) - "a".charCodeAt(0) + 1, y: Number(square.substring(1, 2)) };
  }

  distance(a, b) {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }

  manhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  euclideanDistance(a, b) {
    var dx = (a.x - b.x);
    var dy = (a.y - b.y);
    return Math.sqrt(dx * dx + dy * dy);
  }

  otherPlayer(colour) {
    return colour === "w" ? "b" : "w";
  }

  pickRandomMove(moves) {
    return this.hub(moves[Math.floor(Math.random() * moves.length)]);
  }

  filterForcing(legalMoves) {
    var mates = legalMoves.filter(move => /#/.test(move.san));
    return mates.length ? mates : legalMoves.filter(move => /\+/.test(move.san));
  }

  inCheckmate() {
    return this.draughts.in_checkmate();
  }

  inDraw() {
    return this.draughts.in_draw();
  }

  materialEval() {
    return this.material("w") - this.material("b");
  }

  material(colour) {
    var valueOf = { w: 1, b: 1, W: 9, B: 9 };
    return this.squaresOf(colour).map(square => valueOf[this.draughts.get(square).type]).reduce((a, b) => a + b);
  }
}

module.exports = DraughtsUtils;
