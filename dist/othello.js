'use strict';

var emptyClass = 'board-tile';
var firstPlayerClass = 'first-player';
var secondPlayerClass = 'second-player';
var addFirstPlayerClass = 'add-first-highlight';
var addSecondPlayerClass = 'add-second-highlight';

var othelloBoard = document.getElementById('othello-board');
var tiles = void 0;
var squares = void 0;
var player = void 0;
var firstPlayerScore = document.getElementById('first-player-score');
var secondPlayerScore = document.getElementById('second-player-score');
var debug = document.getElementById('debug');
debug.setAttribute('style', 'display: none');
var playerTurn = document.getElementById('player-turn');
var gameOver = 0;
var player1Section = document.getElementById('player1');
var player2Section = document.getElementById('player2');

var test = function test() {
  return console.log('test');
};

var initializeBoard = function initializeBoard() {
  othelloBoard.innerHTML = null;
  var count = 0;
  var tmp = void 0;
  tiles = [];
  squares = [];
  Array(8).fill().map(function (_, i) {
    squares.push([]);
    tiles.push([]);
    tmp = '';
    var boardRow = document.createElement('div');
    var boardTile = void 0;
    boardRow.setAttribute('class', 'board-row');
    Array(8).fill().map(function (_, j) {
      boardTile = document.createElement('div');
      boardTile.setAttribute('id', 'tile-' + count);
      boardTile.addEventListener('click', function (event) {
        return makeMove(event, i, j);
      });
      boardTile.addEventListener('mouseover', function (event) {
        return showHint(event, i, j);
      });
      boardTile.addEventListener('mouseout', function (event) {
        return hideHint(event, i, j);
      });
      boardRow.appendChild(boardTile);
      squares[i].push('clear');
      tiles[i][j] = boardTile;
      count++;
    });
    othelloBoard.appendChild(boardRow);
  });

  tiles[3][3].className = emptyClass + ' ' + firstPlayerClass;
  squares[3][3] = 'first';

  tiles[3][4].className = emptyClass + ' ' + secondPlayerClass;
  squares[3][4] = 'second';

  tiles[4][4].className = emptyClass + ' ' + firstPlayerClass;
  squares[4][4] = 'first';

  tiles[4][3].className = emptyClass + ' ' + secondPlayerClass;
  squares[4][3] = 'second';

  firstPlayerScore.innerHTML = 2;
  secondPlayerScore.innerHTML = 2;
  var btnStart = document.getElementById('btn-start');
  btnStart.innerHTML = 'Reset Game';

  refresh('second');
};

var opponent = function opponent(player) {
  return player === 'first' ? 'second' : 'first';
};

var checkTiles = function checkTiles(i, j, player, dir) {
  var method = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'checkAddable';

  var count = 0;
  var flipPlayer = false;
  var x = j;
  var y = i;
  while (i >= 0 && i < 8 && j >= 0 && j < 8) {
    if (squares[i][j] === 'clear' || squares[i][j] === 'addable' || squares[i][j] === player && !flipPlayer) {
      return null;
    } else if (squares[i][j] === player && flipPlayer) {
      if (method === 'checkAddable') {
        return count;
      } else {
        while (x != j || y != i) {
          squares[y][x] = player;
          tiles[y][x].className = emptyClass + ' ' + (player === 'first' ? firstPlayerClass : secondPlayerClass);
          if (dir === 'right') {
            x++;
          } else if (dir === 'rightBot') {
            y++;
            x++;
          } else if (dir === 'bottom') {
            y++;
          } else if (dir === 'leftBot') {
            y++;
            x--;
          } else if (dir === 'left') {
            x--;
          } else if (dir === 'leftTop') {
            y--;
            x--;
          } else if (dir === 'top') {
            y--;
          } else if (dir === 'rightTop') {
            y--;
            x++;
          }
        }
      }
    } else {
      count++;
      flipPlayer = true;
    }

    if (dir === 'right') {
      j++;
    } else if (dir === 'rightBot') {
      i++;
      j++;
    } else if (dir === 'bottom') {
      i++;
    } else if (dir === 'leftBot') {
      i++;
      j--;
    } else if (dir === 'left') {
      j--;
    } else if (dir === 'leftTop') {
      i--;
      j--;
    } else if (dir === 'top') {
      i--;
    } else if (dir === 'rightTop') {
      i--;
      j++;
    }
  }
  return null;
};

var endGame = function endGame(score1, score2) {
  if (gameOver === 2) window.alert('No one can move anymore!');
  window.alert('END OF THE GAME. ' + (score1 > score2 ? 'First' : 'Second') + ' player has won the game');
};

var checkGame = function checkGame(canMove) {
  var score1 = 0;
  var score2 = 0;

  squares.forEach(function (square) {
    return square.forEach(function (data) {
      score1 += data === 'first' ? 1 : 0;
      score2 += data === 'second' ? 1 : 0;
    });
  });
  firstPlayerScore.innerHTML = score1;
  secondPlayerScore.innerHTML = score2;

  if (score1 + score2 === 64) {
    return endGame(score1, score2);
  } else if (!canMove) {
    window.alert(player + ' can\'t move. ' + player + ' pass');
    gameOver++;
    return gameOver === 2 ? endGame() : refresh(player);
  }
};

var refresh = function refresh(playerRef) {

  player = opponent(playerRef);
  if (player === 'first') {
    player1Section.className = 'player-info text-white turn';
    player2Section.className = 'player-info text-white';
  } else {
    player2Section.className = 'player-info text-white turn';
    player1Section.className = 'player-info text-white';
  }
  playerTurn.innerHTML = '' + player[0].toUpperCase() + player.slice(1) + ' Player (' + (player === 'first' ? 'White' : 'Black') + ') turn';
  var tmp = void 0;
  var canMove = false;
  debug.innerHTML = "";
  for (var i = 0; i < 8; i++) {
    tmp = "";
    for (var j = 0; j < 8; j++) {
      if (squares[i][j] === 'clear' || squares[i][j] === 'addable') {
        squares[i][j] = 'clear';
        tiles[i][j].className = emptyClass;
        for (var k = 0; k < 8; k++) {
          var count = k === 0 ? checkTiles(i, j + 1, player, 'right') : k === 1 ? checkTiles(i + 1, j + 1, player, 'rightBot') : k === 2 ? checkTiles(i + 1, j, player, 'bottom') : k === 3 ? checkTiles(i + 1, j - 1, player, 'leftBot') : k === 4 ? checkTiles(i, j - 1, player, 'left') : k === 5 ? checkTiles(i - 1, j - 1, player, 'leftTop') : k === 6 ? checkTiles(i - 1, j, player, 'top') : checkTiles(i - 1, j + 1, player, 'rightTop');

          if (count) {
            canMove = true;
            squares[i][j] = 'addable';
            gameOver = 0;
            //tiles[i][j].className = `${emptyClass} ${ player === 'first' ? addFirstPlayerClass : addSecondPlayerClass }`
            break;
          }
        }
      }
      //tmp += `<td>${squares[i][j]}</td>`
    }
    //debug.innerHTML += `<tr>${tmp}</tr>`
  }
  checkGame(canMove);
};

var showHint = function showHint(e, i, j) {
  if (squares[i][j] === 'addable') {
    tiles[i][j].className = emptyClass + ' ' + (player === 'first' ? addFirstPlayerClass : addSecondPlayerClass);
  }
};

var hideHint = function hideHint(e, i, j) {
  if (squares[i][j] === 'addable') {
    tiles[i][j].className = emptyClass;
  }
};

var makeMove = function makeMove(e, i, j) {
  if (squares[i][j] === 'addable') {
    var count = 0;
    squares[i][j] = player;
    tiles[i][j].className = emptyClass + ' ' + (player === 'first' ? firstPlayerClass : secondPlayerClass);
    for (var k = 0; k < 8; k++) {
      k === 0 ? checkTiles(i, j + 1, player, 'right', 'makeMove') : k === 1 ? checkTiles(i + 1, j + 1, player, 'rightBot', 'makeMove') : k === 2 ? checkTiles(i + 1, j, player, 'bottom', 'makeMove') : k === 3 ? checkTiles(i + 1, j - 1, player, 'leftBot', 'makeMove') : k === 4 ? checkTiles(i, j - 1, player, 'left', 'makeMove') : k === 5 ? checkTiles(i - 1, j - 1, player, 'leftTop', 'makeMove') : k === 6 ? checkTiles(i - 1, j, player, 'top', 'makeMove') : checkTiles(i - 1, j + 1, player, 'rightTop', 'makeMove');
    }
    refresh(player);
  }
};
