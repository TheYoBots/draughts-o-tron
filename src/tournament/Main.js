const Tournament = require("./Tournament");
const RandomPlayer = require("../bots/RandomPlayer");

const players = [
  new RandomPlayer(),
];

/**
 * Run tournament and report results to console.
 */

const tournament = new Tournament(players, 16);

console.log("Start");

var rounds = 8;
var round = 1;

console.log(players);

while (round++ <= rounds) {
  tournament.playRound();
  console.log(tournament.getScores());
}


console.log("Results");
console.log(tournament.getRank());
