const SHOULD_AUTO_TYPE = false;

let score = 0;

const $word = document.getElementById('word');
const $wordInput = document.getElementById('word-input');
const $score = document.getElementById('score');

window.addEventListener('keydown', () => {
    $wordInput.focus();
});

$wordInput.focus();
$wordInput.addEventListener('input', () => {
    validateInput();
});

renderScore();
nextWord();

if (SHOULD_AUTO_TYPE) {
    startAutoType();
}

function validateInput() {
    if (checkWord()) {
        incrementScore();
        nextWord();
    }
}

function incrementScore() {
    score++;
    renderScore();
}

function renderScore() {
    $score.textContent = score + '';
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
        $wordInput.dispatchEvent(new Event('input'));
    }
}

function nextLetter(sub, word) {
    return word.charAt(sub.length);
}

function randomInRange(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}
