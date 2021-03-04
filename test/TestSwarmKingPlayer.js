const test = require("tape");
const SwarmKingPlayer = require("../src/bots/SwarmKingPlayer");
const DraughtsUtils = require("../src/utils/DraughtsUtils");

const player = new SwarmKingPlayer();
const draughts = new DraughtsUtils();

"use strict";

test("getReply", function(t) {
  t.equal(player.getReply({}), "swarm the king!", "chat says swarm the king!");
  t.end();
});

test("getNextMove", function(t) {
  const mate = player.getNextMove(["e2e4", "a7a6", "f1c4", "a8a7", "d1h5", "a7a8"]);
  t.ok(mate === "h5f7" || mate === "c4f7", "mate is played when available");
  t.equal(player.getNextMove(["e2e4","a7a6","f1c4","a8a7"]), "c4f7", "check is played when available");
  t.ok(player.getNextMove([]), "a move is played when available");
  t.notOk(player.getNextMove(["e2e4", "a7a6", "f1c4", "a8a7", "d1h5", "a7a8", "c4f7"]), "no moves available");
  t.end();
});

test("distanceMetric", function(t) {
  draughts.reset();
  const colour = draughts.turn();
  const opponentsKingSquare = draughts.squareOfOpponentsKing();
  t.equals(player.distanceMetric(draughts, opponentsKingSquare, colour), 120, "distance to king metric is 120");
  draughts.applyMoves(["e2e4"]);
  t.equals(player.distanceMetric(draughts, opponentsKingSquare, colour), 122, "distance to king metric is 122");
  draughts.applyMoves(["a7a6"]);
  t.equals(player.distanceMetric(draughts, opponentsKingSquare, colour), 122, "distance to king invariant to opponents move");
  t.end();
});

test("removeReverseMoves", function(t) {
  draughts.reset();
  draughts.applyMoves(["g1f3", "a7a6"]);
  const legalMoves = draughts.legalMoves();
  const noReverse = player.removeReverseMoves(["g1f3", "a7a6"], legalMoves);
  t.equals(noReverse.length, legalMoves.length - 1, "reverse move removed");
  t.end();
});
