const SHOULD_AUTO_TYPE = true;
const INITIAL_TIME = 10;

let score = 0;
let time = INITIAL_TIME;

const $word = document.getElementById('word');
const $wordInput = document.getElementById('word-input');
const $score = document.getElementById('score');
const $time = document.getElementById('time');

window.addEventListener('keydown', () => {
    $wordInput.focus();
});

$wordInput.focus();
$wordInput.addEventListener('input', e => {
    if (SHOULD_AUTO_TYPE && !e.autoTyped) {
        $wordInput.value = $wordInput.value.slice(0, -1);
    }

    validateInput();
});

renderScore();
nextWord();
startTimer();

if (SHOULD_AUTO_TYPE) {
    startAutoType();
}

function validateInput() {
    if (checkWord()) {
        incrementTime();
        incrementScore();
        nextWord();
    }
}

function incrementTime() {
    time++;
    renderTime();
}

function incrementScore() {
    score++;
    renderScore();
}

function renderScore() {
    $score.textContent = score + '';
}

function renderTime() {
    $time.textContent = time + '';
}

function startTimer() {
    renderTime();

    setInterval(updateTimer, 1000);
}

function updateTimer() {
    time--;
    renderTime();

    if (time === 0) {
        restartGame();
    }
}

function restartGame() {
    score = 0;
    renderScore();

    time = INITIAL_TIME;
    renderTime();

    $wordInput.value = '';
    nextWord();
}

function checkWord() {
    const enteredWord = $wordInput.value;
    const requiredWord = $word.textContent;

    return enteredWord.toLowerCase() === requiredWord.toLowerCase();
}

function nextWord() {
    $wordInput.value = '';
    $word.textContent = 'loading...';

    randomWord().then(word => {
        $word.textContent = word;
    });
}

async function randomWord() {
    const response = await fetch('http://puzzle.mead.io/puzzle?wordCount=1');
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
    const word = $word.textContent;
    const wordInput = $wordInput.value;

    if (word !== 'loading...') {
        $wordInput.value += nextLetter(wordInput, word);
        const event = new Event('input');
        event.autoTyped = true;
        $wordInput.dispatchEvent(event);
    }
}

function nextLetter(sub, word) {
    return word.charAt(sub.length);
}

function randomInRange(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}
