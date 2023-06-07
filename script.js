"use strict";

let squares = [];
let currentPlayer = "x";
let tieCounter = 0;
let gameEnded = false;
const winPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // 1
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // 2
    [0, 4, 8],
    [2, 4, 6], // 3
];
const score = {
    x: document.getElementById("x"),
    o: document.getElementById("o"),
    tie: document.getElementById("tie"),
};
const turn = document.querySelector(".turn");
const game = document.querySelector(".game-squares");
const result = document.querySelector(".result");
const resultText = result.firstElementChild.firstElementChild;
const replay = result.lastElementChild;
replay.addEventListener("click", playAgain);

function createGame() {
    for (let i = 0; i < 9; i++) {
        const square = document.createElement("div");
        square.style.animation;
        square.className = "square";
        square.setAttribute("player", null);
        square.addEventListener("click", squareClick);
        squares.push(square);
        game.appendChild(square);
    }
    turn.innerHTML = "It's player <span class='x-text'>X</span>'s turn!";
    updateScore();
}

function updateScore() {
    Object.entries(score).forEach((value) => {
        if (!localStorage.getItem(value[0])) localStorage.setItem(value[0], 0);
        value[1].textContent = localStorage.getItem(value[0]);
    });
}

function playAgain() {
    result.style.animation = "1.2s up";
    setTimeout(() => {
        result.style.display = "none";
        resultText.textContent = "";
        result.style.animation = "0.8s down";
    }, 1100);
    currentPlayer = "x";
    game.innerHTML = "";
    squares = [];
    tieCounter = 0;
    gameEnded = false;
    createGame();
}

function getResult(text, scoreAdd) {
    turn.innerHTML = "Game Ended";
    resultText.innerHTML = text;
    result.style.display = "flex";
    localStorage.setItem(scoreAdd, +localStorage.getItem(scoreAdd) + 1);
    updateScore();
    gameEnded = true;
}

function checkGame() {
    winPositions.forEach((position) => {
        let currentPositions = [];
        // prettier-ignore
        position.forEach((value) =>
            currentPositions.push(squares[value].innerHTML ? squares[value].getAttribute("player") : null)
        );
        if (currentPositions.every((value) => value === currentPlayer))
            return getResult(
                `Player <span class=${currentPlayer}-text>${currentPlayer}</span> won!`,
                currentPlayer
            );
    });
    tieCounter += 1;
    // prettier-ignore
    if (tieCounter === 9 && !gameEnded) return getResult("It's a <span class='tie-text'>tie</span>!", "tie");
}

function squareClick(event) {
    // prettier-ignore
    if (event.currentTarget.innerHTML) {
        const target = !event.target.innerHTML ? event.target.parentElement : event.target;
        target.style.animation = "0.05s linear alternate shake infinite";
        setTimeout(() => target.style.animation = "", 500);
        return;
    }

    event.currentTarget.innerHTML =
        currentPlayer === "x"
            ? `<span class="x first"></span><span class="x second"></span>`
            : `<span class="o"></span>`;
    event.currentTarget.setAttribute("player", currentPlayer);
    checkGame();
    if (gameEnded) return;
    currentPlayer = currentPlayer === "o" ? "x" : "o";
    turn.innerHTML = `It's player <span class=${currentPlayer}-text>${currentPlayer}</span>'s turn!`;
}

createGame();
