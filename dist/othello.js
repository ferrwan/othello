const emptyClass = 'board-tile'
const firstPlayerClass = 'first-player'
const secondPlayerClass = 'second-player'
const addFirstPlayerClass = 'add-first-highlight'
const addSecondPlayerClass = 'add-second-highlight'

let othelloBoard = document.getElementById('othello-board')
let tiles = []
let squares = []
let player
let firstPlayerScore = document.getElementById('first-player-score')
let secondPlayerScore = document.getElementById('second-player-score')
let debug = document.getElementById('debug')
debug.setAttribute('style', 'display: none')
let playerTurn = document.getElementById('player-turn')

const initializeBoard = () => {
  othelloBoard.innerHTML = null;
  let count = 0;
  let tmp
  Array(8).fill().map((_, i) => {
    squares.push([])
    tiles.push([])
    tmp = ''
    const boardRow = document.createElement('div')
    let boardTile
    boardRow.setAttribute('class', 'board-row')
    Array(8).fill().map((_,j) => {
      boardTile = document.createElement('div')
      boardTile.setAttribute('id', `tile-${count}`)
      boardTile.addEventListener('click', event => makeMove(event, i, j))
      boardRow.appendChild(boardTile)
      squares[i].push('clear')
      tiles[i][j] = boardTile
      count++
    })
    othelloBoard.appendChild(boardRow)
  })

  tiles[3][3].className = `${emptyClass} ${firstPlayerClass}`
  squares[3][3] = 'first'

  tiles[3][4].className = `${emptyClass} ${secondPlayerClass}`
  squares[3][4] = 'second'

  tiles[4][4].className = `${emptyClass} ${firstPlayerClass}`
  squares[4][4] = 'first'

  tiles[4][3].className = `${emptyClass} ${secondPlayerClass}`
  squares[4][3] = 'second'

  firstPlayerScore.innerHTML = 2
  secondPlayerScore.innerHTML = 2
  let btnStart = document.getElementById('btn-start')
  btnStart.innerHTML = 'Reset Game'

  refresh('second')
}

const opponent = (player) => player === 'first' ? 'second' : 'first'

const checkTiles = (i, j, player, dir, method = 'checkAddable') => {
  let count = 0
  let flipPlayer = false
  let x = j
  let y = i
  while(i >= 0 && i < 8 && j >= 0 && j < 8) {
    if(squares[i][j] === 'clear' || squares[i][j] === 'addable' || (squares[i][j] === player && !flipPlayer)) {
      return null
    } else if(squares[i][j] === player && flipPlayer) {
      if (method === 'checkAddable') {
        return count
      } else {
        while(x != j || y != i) {
          squares[y][x] = player
          tiles[y][x].className = `${emptyClass} ${player === 'first' ? firstPlayerClass : secondPlayerClass}`
          if (dir === 'right') {
            x++
          } else if (dir === 'rightBot') {
            y++
            x++
          } else if (dir === 'bottom') {
            y++
          } else if (dir === 'leftBot') {
            y++
            x--
          } else if (dir === 'left') {
            x--
          } else if (dir === 'leftTop') {
            y--
            x--
          } else if (dir === 'top') {
            y--
          } else if (dir === 'rightTop') {
            y--
            x++
          }
        }
      }
    } else {
      count++
      flipPlayer = true
    }

    if (dir === 'right') {
      j++
    } else if (dir === 'rightBot') {
      i++
      j++
    } else if (dir === 'bottom') {
      i++
    } else if (dir === 'leftBot') {
      i++
      j--
    } else if (dir === 'left') {
      j--
    } else if (dir === 'leftTop') {
      i--
      j--
    } else if (dir === 'top') {
      i--
    } else if (dir === 'rightTop') {
      i--
      j++
    }
  }
  return null
}

const refresh = (playerRef) => {
  player = opponent(playerRef)
  playerTurn.innerHTML = `${player[0].toUpperCase()}${player.slice(1)} Player (${player === 'first' ? 'White' : 'Black'}) turn`
  let tmp
  let canMove = false
  debug.innerHTML = ""
  for(let i = 0; i < 8; i++) {
    tmp = ""
    for(let j = 0; j < 8; j++) {
      if (squares[i][j] === 'clear' || squares[i][j] === 'addable') {
        squares[i][j] = 'clear'
        tiles[i][j].className = emptyClass
        for(let k = 0; k < 8; k++) {
          let count = k === 0 ? checkTiles(i, j+1, player, 'right') : 
                      k === 1 ? checkTiles(i+1, j+1, player, 'rightBot') :
                      k === 2 ? checkTiles(i+1, j, player, 'bottom') :
                      k === 3 ? checkTiles(i+1, j-1, player, 'leftBot') :
                      k === 4 ? checkTiles(i, j-1, player, 'left') :
                      k === 5 ? checkTiles(i-1, j-1, player, 'leftTop') :
                      k === 6 ? checkTiles(i-1, j, player, 'top') : checkTiles (i-1, j+1, player, 'rightTop')

          if (count) {
            canMove = true
            squares[i][j] = 'addable'
            tiles[i][j].className = `${emptyClass} ${ player === 'first' ? addFirstPlayerClass : addSecondPlayerClass }`
            break
          }
        }
      }
      //tmp += `<td>${squares[i][j]}</td>`
    }
    //debug.innerHTML += `<tr>${tmp}</tr>`
  }
  if (!canMove) {
    window.alert(`${player} can't move. ${player} pass`)
    return refresh(player)
  }
  let score1 = 0
  let score2 = 0
  squares.forEach(
    (square) => square.forEach(
      (data) => {
        score1 += (data === 'first') ? 1 : 0
        score2 += (data === 'second') ? 1 : 0
      }
    )
  )
  firstPlayerScore.innerHTML = score1
  secondPlayerScore.innerHTML = score2
}

const makeMove = (e, i, j) => {
  if (squares[i][j] === 'addable') {
    let count = 0
    squares[i][j] = player
    tiles[i][j].className = `${emptyClass} ${player === 'first' ? firstPlayerClass : secondPlayerClass}`
    for(let k = 0; k < 8; k++) {
      k === 0 ? checkTiles(i, j+1, player, 'right', 'makeMove') : 
      k === 1 ? checkTiles(i+1, j+1, player, 'rightBot', 'makeMove') :
      k === 2 ? checkTiles(i+1, j, player, 'bottom', 'makeMove') :
      k === 3 ? checkTiles(i+1, j-1, player, 'leftBot', 'makeMove') :
      k === 4 ? checkTiles(i, j-1, player, 'left', 'makeMove') :
      k === 5 ? checkTiles(i-1, j-1, player, 'leftTop', 'makeMove') :
      k === 6 ? checkTiles(i-1, j, player, 'top', 'makeMove') : checkTiles (i-1, j+1, player, 'rightTop', 'makeMove')
    }
    refresh(player)
  }
}
