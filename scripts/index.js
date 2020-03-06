const SHOULD_AUTO_TYPE = false;
const INITIAL_TIME = 30;
const TIME_PER_WORD = 2;

const ScoreModule = {
    _SCORE_STEP: 5,

    _$score: document.getElementById('score'),
    _score: 0,

    set score(newScore) {
        this._score = newScore;
        this.renderScore();
    },

    get score() {
        return this._score;
    },

    incrementScore() {
        this.score = this.score + this._SCORE_STEP;
    },

    reset() {
        this.score = 0;
    },

    renderScore() {
        this._$score.textContent = this._score;
    }
};

let time = INITIAL_TIME;

const $word = document.getElementById('word');
const $wordInput = document.getElementById('word-input');
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

startTimer();
restartGame();

if (SHOULD_AUTO_TYPE) {
    startAutoType();
}

function validateInput() {
    if (checkWord()) {
        incrementTime();
        ScoreModule.incrementScore();
        nextWord();
    }
}

function incrementTime() {
    time += TIME_PER_WORD;
    renderTime();
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
    ScoreModule.reset();

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
