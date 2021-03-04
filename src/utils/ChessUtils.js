const Draughts = require("draughts.js").Draughts;


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
   * Convert a draughts.js move to a uci move
   */
  uci(move) {
    return move.from + move.to + (move.flags === "p" ? move.piece : "");
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
      const r = this.draughts.get(square);
      return r && r.color === colour;
    });
  }

  squareOfKing() {
    return this.squaresOfPiece(this.draughts.turn(), "k");
  }

  squareOfOpponentsKing() {
    return this.squaresOfPiece(this.otherPlayer(this.draughts.turn()), "k");
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
    const dx = (a.x - b.x);
    const dy = (a.y - b.y);
    return Math.sqrt(dx * dx + dy * dy);
  }

  otherPlayer(colour) {
    return colour === "w" ? "b" : "w";
  }

  pickRandomMove(moves) {
    return this.uci(moves[Math.floor(Math.random() * moves.length)]);
  }

  filterForcing(legalMoves) {
    const mates = legalMoves.filter(move => /#/.test(move.san));
    return mates.length ? mates : legalMoves.filter(move => /\+/.test(move.san));
  }

  inCheckmate() {
    return this.draughts.in_checkmate();
  }

  inStalemate() {
    return this.draughts.in_stalemate();
  }

  materialEval() {
    return this.material("w") - this.material("b");
  }

  material(colour) {
    const valueOf = { p: 1, n: 3, b: 3, r: 6, q: 9, k: 0 };
    return this.squaresOf(colour).map(square => valueOf[this.draughts.get(square).type]).reduce((a, b) => a + b);
  }
}

module.exports = DraughtsUtils;
