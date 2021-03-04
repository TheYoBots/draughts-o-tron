const tap = require("tap");

const DraughtsUtils = require("../src/utils/DraughtsUtils");
const draughts = new DraughtsUtils();

const a1 = draughts.coordinates("a1");
const a8 = draughts.coordinates("a8");
const b8 = draughts.coordinates("b8");

const initialPosition = "W:W31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50:B1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20:H0:F1";


tap.beforeEach(function(t) {
  draughts.reset();
  t();
});

tap.test("uci", function(t) {
  t.equal(draughts.uci({ from: "e2", to: "e4" }), "e2e4", "pawn to e4");
  t.equal(draughts.uci({ from: "a7", to: "a8", flags: "p", piece: "q" }), "a7a8q", "promote to queen on a8");
  t.end();
});

tap.test("fen", function(t) {
  draughts.applyMoves([]);
  t.equal(draughts.fen(), initialPosition, "no moves gives initial position");
  t.end();
});

tap.test("legalMoves", function(t) {
  t.equal(draughts.legalMoves().length, 20, "20 legal moves at start of game");
  t.end();
});

tap.test("squaresOfColour", function(t) {
  t.equal(draughts.squaresOf("w").length, 16, "16 white squares");
  t.equal(draughts.squaresOf("b").length, 16, "16 black squares");
  t.end();
});

tap.test("squareOfKing", function(t) {
  t.equal(draughts.squareOfKing(), "e1", "white king on e1");
  t.equal(draughts.squareOfOpponentsKing(), "e8", "black king on e8");
  t.end();
});

tap.test("coordinates", function(t) {
  t.deepEqual(draughts.coordinates("a1"), { x: 1, y: 1 }, "at at 1,1");
  t.end();
});

tap.test("distance", function(t) {
  t.equal(draughts.distance(a1, a1), 0, "0 distance same square");
  t.equal(draughts.distance(a1, a8), 7, "7 distance between a1 a8");
  t.equal(draughts.distance(a1, b8), 7, "7 distance between a1 b8");
  t.end();
});

tap.test("manhattanDistance", function(t) {
  t.equal(draughts.manhattanDistance(a1, a1), 0, "0 manhattanDistance same square");
  t.equal(draughts.manhattanDistance(a1, a8), 7, "7 manhattanDistance between a1 a8");
  t.equal(draughts.manhattanDistance(a1, b8), 8, "8 manhattanDistance between a1 a8");
  t.end();
});

tap.test("euclideanDistance", function(t) {
  t.equal(draughts.euclideanDistance(a1, a1), 0, "0 euclideanDistance same square");
  t.equal(draughts.euclideanDistance(a1, a8), 7, "7 euclideanDistance between a1 a8");
  t.equal(draughts.euclideanDistance(a1, b8), Math.sqrt(7 * 7 + 1), "7.071 euclideanDistance between a1 a8");
  t.end();
});

tap.test("otherPlayer", function(t) {
  t.equal(draughts.otherPlayer("w"), "b", "w -> b");
  t.equal(draughts.otherPlayer("b"), "w", "b -> w");
  t.end();
});

tap.test("material", function(t) {
  t.equal(draughts.material("w"), draughts.material("b"), "material equal at start");
  t.end();
});

tap.test("materialEval", function(t) {
  t.equal(draughts.materialEval(), 0, "eval 0 at start");
  t.end();
});
