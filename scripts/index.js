const SHOULD_AUTO_TYPE = false;

window.addEventListener('keydown', () => {
    WordInputModule.focus();
});

WordInputModule.focus();
WordInputModule.onInput(e => {
    if (SHOULD_AUTO_TYPE && !e.autoTyped) {
        WordInputModule.word = WordInputModule.word.slice(0, -1);
    }

    validateInput();
});

TimerModule.onTimeEnd(restartGame);
restartGame();

if (SHOULD_AUTO_TYPE) {
    startAutoType();
}

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

function startAutoType() {
    const minDelay = 30;
    const maxDelay = 100;

    setTimeout(() => {
        autoType();

        setTimeout(startAutoType, randomInRange(minDelay, maxDelay));
    }, randomInRange(minDelay, maxDelay));
}

function autoType() {
    const word = WordModule.word;
    const wordInput = WordInputModule.word;

    if (word !== 'loading...') {
        WordInputModule.word += nextLetter(wordInput, word);
        const event = new Event('input');
        event.autoTyped = true;
        WordInputModule.dispatchEvent(event);
    }
}

function nextLetter(sub, word) {
    return word.charAt(sub.length);
}

function randomInRange(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}
