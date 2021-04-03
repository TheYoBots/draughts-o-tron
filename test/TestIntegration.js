const tap = require("tap");
const sinon = require("sinon");

const RobotUser = require("../src/RobotUser");
const RandomPlayer = require("../src/bots/RandomPlayer");
const LidraughtsApi = require("../src/LidraughtsApi");

const gameId = "gid001";
const challengeId = "cid001";
const token = "api token";
const id = "YoBot_v2";
const name = "YoBot_v2";
const ratedChallenge = {
  "type": "challenge",
  "challenge": {
    "id": challengeId,
    "challenger": { "id": "YohaanSethNathan" },
    "destUser": { id, name },
    "variant": { "key": "standard", "name": "Standard", "short": "Std" },
    "rated": true,
    "timeControl": { "type": "clock", "limit": 300, "increment": 25, "show": "5+25" },
    "color": "random"
  }
};
const unratedChallenge = JSON.parse(JSON.stringify(ratedChallenge));
unratedChallenge.challenge.rated = false;
const gameStart = { "type": "gameStart", "game": { "id": gameId } };
const gameFullWhite = {
  "type": "gameFull",
  "id": gameId,
  "rated": false,
  "variant": { "key": "standard", "name": "Standard", "short": "Std" },
  "clock": { "initial": 1200000, "increment": 10000 },
  "white": { id, name },
  "black": { "id": "YoBot_v2", "name": "YoBot_v2" },
  "initialFen": "startpos",
  "state": { "type": "gameState", "moves": "" }
};
const gameFullBlack = JSON.parse(JSON.stringify(gameFullWhite));
gameFullBlack.white.id = "other";
gameFullBlack.white.name = "Other";
const chatOther = { "type": "chatLine", "username": "Other", "text": "Hello", "room": "player" };
const chatSelf = { "type": "chatLine", "username": name, "text": "Hello", "room": "player" };

/**
 * The idea of this test suite is to take the ensemble of classes through a 
 * login, accept challenge and game play sequence of actions against a mock lidraughts.
 */

var robotUser;
var lidraughtsApi;
var accountInfo;
var declineChallenge;
var acceptChallenge;
var streamEvents;
var streamGame;
var makeMove;
var chat;

tap.beforeEach(function(t) {
  lidraughtsApi = new LidraughtsApi(token);
  accountInfo = sinon.stub(lidraughtsApi, "accountInfo");
  declineChallenge = sinon.stub(lidraughtsApi, "declineChallenge");
  acceptChallenge = sinon.stub(lidraughtsApi, "acceptChallenge");
  makeMove = sinon.stub(lidraughtsApi, "makeMove");
  chat = sinon.stub(lidraughtsApi, "chat");
  streamEvents = sinon.stub(lidraughtsApi, "streamEvents");
  streamGame = sinon.stub(lidraughtsApi, "streamGame");

  accountInfo.returns({ data: { "id": "YoBot_v2", "username": "YoBot_v2" } });
  declineChallenge.returns({ data: { "ok": true } });
  acceptChallenge.returns({ data: { "ok": true } });

  robotUser = new RobotUser(lidraughtsApi, new RandomPlayer());

  t();
});

async function startAndGetEventHandler(t) {
  const response = await robotUser.start();
  t.equal(response.data.id, "YoBot_v2", "user id returned");
  t.ok(accountInfo.calledOnce, "accountInfo called once");
  t.ok(streamEvents.calledOnce, "streamEvents called once");
  return streamEvents.getCall(0).args[0];
}

async function startGameAndGetGameHandler(t) {
  const eventHandler = await startAndGetEventHandler(t);
  eventHandler(gameStart);
  t.ok(streamGame.calledOnce, "streamGame called once");
  t.equal(streamGame.getCall(0).args[0], gameId);
  return streamGame.getCall(0).args[1];
}

tap.test("decline rated game", async function(t) {
  const eventHandler = await startAndGetEventHandler(t);
  eventHandler(ratedChallenge);
  t.ok(declineChallenge.calledOnce, "declineChallenge called once");
  t.equal(declineChallenge.getCall(0).args[0], challengeId, "called with correct challenge id");
  t.end();
});

tap.test("accept unrated game", async function(t) {
  const eventHandler = await startAndGetEventHandler(t);
  eventHandler(unratedChallenge);
  t.ok(acceptChallenge.calledOnce, "acceptChallenge called once");
  t.equal(acceptChallenge.getCall(0).args[0], challengeId, "called with correct challenge id");
  t.end();
});

tap.test("game start as white", async function(t) {
  const gameEventHandler = await startGameAndGetGameHandler(t);
  gameEventHandler(gameFullWhite);
  t.ok(makeMove.calledOnce, "makeMove called once");
  t.end();
});

tap.test("game start as black", async function(t) {
  const gameEventHandler = await startGameAndGetGameHandler(t);
  gameEventHandler(gameFullBlack);
  t.ok(makeMove.notCalled, "makeMove notCalled");
  gameEventHandler({ "type": "gameState", "moves": "34-29" });
  t.ok(makeMove.calledOnce, "makeMove called once");
  t.end();
});

tap.test("game chat", async function(t) {
  const gameEventHandler = await startGameAndGetGameHandler(t);
  gameEventHandler(chatSelf);
  t.ok(chat.notCalled, "chat not called");
  gameEventHandler(chatOther);
  t.ok(chat.calledOnce, "chat called once");
  t.end();
});
