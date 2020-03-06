const SHOULD_AUTO_TYPE = false;

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

const TimerModule = {
    INITIAL_TIME: 30,
    TIME_PER_WORD: 2,

    _$time: document.getElementById('time'),
    _time: 0,
    _timerInterval: -1,
    _timeEndListeners: [],

    set time(newTime) {
        this._time = newTime;
        this.renderTime();
    },

    get time() {
        return this._time;
    },

    incrementTime() {
        this.time += this.TIME_PER_WORD;
    },

    reset() {
        this.time = this.INITIAL_TIME;
    },

    renderTime() {
        this._$time.textContent = this._time;
    },

    startTimer() {
        this.reset();
        this._timerInterval = setInterval(this._tick.bind(this), 1000);
    },

    _tick() {
        this.time--;

        if (this.time === 0) {
            this._timeEnded();
        }
    },

    _timeEnded() {
        if (this._timerInterval === -1) {
            return;
        }

        clearInterval(this._timerInterval);
        this._timerInterval = -1;
        this._timeEndListeners.forEach(listener => listener());
    },

    onTimeEnd(listener) {
        this._timeEndListeners.push(listener);
    }
};

const WordModule = {
    _$word: document.getElementById('word'),

    set word(newWord) {
        if (typeof newWord === 'string') {
            this._$word.textContent = newWord;
            return;
        }

        this.word = 'Loading...';

        newWord.then(word => {
            this.word = word;
        });
    },

    get word() {
        return this._$word.textContent;
    }
};

const $wordInput = document.getElementById('word-input');

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

    $wordInput.value = '';
    nextWord();
}

function checkWord() {
    const enteredWord = $wordInput.value;
    const requiredWord = WordModule.word;

    return enteredWord.toLowerCase() === requiredWord.toLowerCase();
}

function nextWord() {
    $wordInput.value = '';
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
