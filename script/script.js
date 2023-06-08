"use strict";

let squares = [];
let currentPlayer = "x";
let tieCounter = 0;
let gameEnded = false;
const audioPath = "../assets/sounds/";
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
const scoreStorage = {
    x: document.getElementById("x"),
    o: document.getElementById("o"),
    tie: document.getElementById("tie"),
};
const scoreSession = {
    x: document.getElementById("x-session"),
    o: document.getElementById("o-session"),
    tie: document.getElementById("tie-session"),
};
const turn = document.querySelector(".turn");
const game = document.querySelector(".game-squares");
const result = document.querySelector(".result");
const resultText = document.querySelector("h2");
const replay = document.querySelector(".again");
const reset = document.querySelector(".reset");
replay.onclick = playAgain;
reset.onclick = resetScore;

function createGame() {
    for (let i = 1; i <= 9; i++) {
        const square = document.createElement("div");
        square.style.animation;
        square.className = "square";
        square.setAttribute("player", "");
        square.tabIndex = i;
        square.onclick = squareClick;
        square.onkeydown = (e) => {
            if (e.key === "Enter") squareClick(e);
            square.blur();
        };
        // prettier-ignore
        square.onmouseenter = () => {
            if (square.style.cursor !== "default") {
                square.style.backgroundColor = getComputedStyle(document.body).getPropertyValue(`--${currentPlayer}-color`);
            }
        };
        // prettier-ignore
        square.onfocus = () => (square.style.backgroundColor = getComputedStyle(document.body).getPropertyValue(`--${currentPlayer}-color`));
        square.onmouseleave = () => (square.style.backgroundColor = "#181818");
        square.onblur = () => (square.style.backgroundColor = "#181818");
        squares.push(square);
        game.appendChild(square);
    }
    turn.innerHTML = "It's player <span class='x-text'>X</span>'s turn!";
    updateScore();
}

function updateScore() {
    Object.entries(scoreStorage).forEach((value) => {
        if (!localStorage.getItem(value[0])) localStorage.setItem(value[0], 0);
        value[1].textContent = localStorage.getItem(value[0]);
    });
}

function resetScore() {
    const audio = new Audio(audioPath + "reset.mp3");
    audio.play();
    Object.values(scoreSession).forEach((value) => (value.textContent = "0"));
    localStorage.clear();
    updateScore();
    resetGame();
    createGame();
}

function resetGame() {
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
}

function playAgain() {
    const audio = new Audio(audioPath + "start.mp3");
    audio.play();
    resetGame();
    createGame();
}

function getResult(text, scoreAdd) {
    if (scoreAdd === "tie") {
        var audio = new Audio(audioPath + "tie.mp3");
    } else {
        var audio = new Audio(audioPath + "win.mp3");
    }
    audio.play();
    turn.innerHTML = "Game Ended!";
    resultText.innerHTML = text;
    result.style.display = "flex";
    // prettier-ignore
    scoreSession[scoreAdd].textContent = +scoreSession[scoreAdd].textContent + 1;
    localStorage.setItem(scoreAdd, +localStorage.getItem(scoreAdd) + 1);
    squares.forEach((value) => (value.tabIndex = -1));
    updateScore();
    gameEnded = true;
}

function checkGame() {
    winPositions.forEach((position) => {
        let currentPositions = [];
        // prettier-ignore
        position.forEach((value) => currentPositions.push(squares[value].getAttribute("player")));
        if (currentPositions.every((value) => value === currentPlayer)) {
            return getResult(
                `Player <span class=${currentPlayer}-text>${currentPlayer}</span> won!`,
                currentPlayer
            );
        }
    });
    ++tieCounter;
    // prettier-ignore
    if (tieCounter === 9 && !gameEnded) return getResult("It's a <span class='tie-text'>tie</span>!", "tie");
}

function squareClick(event) {
    if (gameEnded) return;
    // prettier-ignore
    if (event.currentTarget.innerHTML) {
        const target = !event.target.innerHTML ? event.target.parentElement : event.target;
        target.style.animation = "0.05s linear alternate shake infinite";
        setTimeout(() => target.style.animation = "", 500);
        return;
    }

    event.currentTarget.style.backgroundColor = "#181818";
    const audio = new Audio(audioPath + currentPlayer + ".mp3");
    audio.play();
    event.currentTarget.innerHTML =
        currentPlayer === "x"
            ? `<span class="x first"></span><span class="x second"></span>`
            : `<span class="o"></span>`;
    event.currentTarget.style.cursor = "default";
    event.currentTarget.setAttribute("player", currentPlayer);
    event.currentTarget.tabIndex = -1;
    checkGame();
    if (gameEnded) return;
    currentPlayer = currentPlayer === "o" ? "x" : "o";
    turn.innerHTML = `It's player <span class=${currentPlayer}-text>${currentPlayer}</span>'s turn!`;
}

createGame();
