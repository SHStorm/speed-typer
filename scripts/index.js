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

const WordInputModule = {
    _$wordInput: document.getElementById('word-input'),
    _inputListeners: [],

    init() {
        this._$wordInput.addEventListener('input', this._handleInput.bind(this));
    },

    set word(newWord) {
        this._$wordInput.value = newWord;
    },

    get word() {
        return this._$wordInput.value;
    },

    clear() {
        this.word = '';
    },

    focus() {
        this._$wordInput.focus();
    },

    onInput(listener) {
        this._inputListeners.push(listener);
    },

    dispatchEvent(event) {
        this._$wordInput.dispatchEvent(event);
    },

    _handleInput(event) {
        this._inputListeners.forEach(listener => listener(event));
    }
};

WordInputModule.init();

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
