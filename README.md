# draught-o-tron

[![CodeFactor](https://www.codefactor.io/repository/github/TheYoBots/draught-o-tron/badge)](https://www.codefactor.io/repository/github/TheYoBots/draught-o-tron) 
[![Open in Gitpod](https://img.shields.io/badge/Gitpod-Open%20in%20Gitpod-%230092CF.svg)](https://gitpod.io/#https://github.com/TheYoBots/draughts-o-tron)
![License MIT](http://img.shields.io/badge/License-MIT-green.svg?style=flat)

[Lidraughts'](https://lidraughts.org) bot interface using [Lidraughts' Bot API](https://lidraughts.org/api#tag/Bot).

### Setup

- Get an [API Access Token](https://lidraughts.org/account/oauth/token) from [Lidraughts.org](https://lidraughts.org).

```bash
$ yarn install

# Linux

$ export API_TOKEN=xxxxxxxxxx

# Windows

$ setx API_TOKEN xxxxxxxxxx
```

### Run

```bash
$ yarn start
```

To implement your draughts bot you only need to create one class that implements the method:

```js
  getNextMove(moves) {
      return hubMove;
  }
```

Where moves is a list of moves so far in hub format e.g. `["34-29", "20-24", "29x20"]`

### Hostless

You do not need to own a server to host a BOT, this code also runs in a browser. You could either use gitpod or your own terminal and type in the [above mentioned commands](https://github.com/TheYoBots/draught-o-tron#setup).

## Acknowledgements

- https://github.com/tailuge/bot-o-tron : Official Lichess in JavaScript.
- https://github.com/shubhendusaurabh/draughts.js : JavaScript draughts/checkers library.
