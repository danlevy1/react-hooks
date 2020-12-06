// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [gameHistory, setGameHistory] = useLocalStorageState('squares', [
    Array(9).fill(null),
  ])
  const [
    displayedSquaresIndex,
    setDisplayedSquaresIndex,
  ] = useLocalStorageState('displayed-squares-index', gameHistory.length - 1)

  const displayedSquares = gameHistory[displayedSquaresIndex]

  const nextValue = calculateNextValue(displayedSquares)
  const winner = calculateWinner(displayedSquares)
  const status = calculateStatus(winner, displayedSquares, nextValue)

  function selectSquare(square) {
    let isNewSquareSelected

    setGameHistory(currentHistory => {
      const currentSquares = currentHistory[displayedSquaresIndex]

      if (winner || currentSquares[square]) {
        isNewSquareSelected = false
        return currentHistory
      }

      isNewSquareSelected = true

      const newSquares = [...currentSquares]
      newSquares[square] = nextValue

      const newHistory = [...currentHistory]
      newHistory.splice(displayedSquaresIndex + 1)
      newHistory.push(newSquares)

      return newHistory
    })
    setDisplayedSquaresIndex(currentIndex =>
      isNewSquareSelected ? currentIndex + 1 : currentIndex,
    )
  }

  function restart() {
    setGameHistory([Array(9).fill(null)])
    setDisplayedSquaresIndex(0)
  }

  const moves = gameHistory.map((squares, index) => {
    let buttonText
    let isButtonDisabled

    if (index === 0) {
      buttonText = 'Go to game start'
      isButtonDisabled = false
    } else {
      buttonText = `Go to move #${index}`
      isButtonDisabled = false
    }

    if (index === displayedSquaresIndex) {
      buttonText += ' (current)'
      isButtonDisabled = true
    }

    return (
      <li key={index}>
        <button
          disabled={isButtonDisabled}
          onClick={() => {
            setDisplayedSquaresIndex(index)
          }}
        >
          {buttonText}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={displayedSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
