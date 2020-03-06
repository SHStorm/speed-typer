window.addEventListener('keydown', () => {
    WordInputModule.focus();
});

WordInputModule.focus();
WordInputModule.onInput(() => {
    validateInput();
});

TimerModule.onTimeEnd(restartGame);
restartGame();

function validateInput() {
    if (checkWord()) {
        TimerModule.incrementTime();
        ScoreModule.incrementScore();
        nextWord();
    }
}

function restartGame() {
    ScoreModule.reset();
    TimerModule.startTimer();

    WordInputModule.clear();
    nextWord();
}

function checkWord() {
    const enteredWord = WordInputModule.word;
    const requiredWord = WordModule.word;

    return enteredWord.toLowerCase() === requiredWord.toLowerCase();
}

function nextWord() {
    WordInputModule.clear();
    WordModule.word = randomWord();
}

async function randomWord() {
    const response = await fetch('https://puzzle.mead.io/puzzle?wordCount=1');
    const responseBody = await response.json();

    return responseBody.puzzle.toLowerCase();
}
