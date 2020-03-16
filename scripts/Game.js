const Game = {
    OFFLINE_WORDS: [
        'game', 'box', 'key', 'laptop', 'interesting',
        'motherboard', 'marvelous', 'family', 'gentleman',
        'superhero', 'mouse-pad', 'speed', 'typing', 'tolerance',
        'instrument', 'utility', 'barbarian', 'sandbox',
        'social', 'slave', 'terrarium', 'unfortunately',
        'gymnastics', 'kryptonite', 'napkins', 'premium'
    ],

    _isPlaying: false,

    init({ scorePerWord, initialTime, timePerWord }) {
        WordInputModule.init();
        WordModule.init();
        ScoreModule.init({ scorePerWord });
        TimerModule.init({ initialTime, timePerWord });

        this._enableAutofocusOnKeyPress();
        WordInputModule.focus();
        WordInputModule.onInput(this._handleInput.bind(this));
        TimerModule.onTimeEnd(this._onGameOver.bind(this));

        document.getElementById('restart').addEventListener('click', this._restart.bind(this));
    },

    start() {
        WordInputModule.clear();

        ScoreModule.reset();
        TimerModule.reset();

        this._updateWord();
    },

    _restart() {
        this._showGameScreen();
        this.start();
    },

    _onGameOver() {
        this._isPlaying = false;
        this._showGameOverScreen({ finalScore: ScoreModule.score });
    },

    _showGameScreen() {
        document.getElementById('game-screen').hidden = false;
        document.getElementById('game-over-screen').hidden = true;
    },

    _showGameOverScreen({ finalScore }) {
        document.getElementById('game-screen').hidden = true;
        document.getElementById('game-over-screen').hidden = false;

        document.getElementById('final-score').textContent = finalScore;
        document.getElementById('restart').focus();
    },

    _enableAutofocusOnKeyPress() {
        window.addEventListener('keydown', () => {
            WordInputModule.focus();
        });
    },

    _handleInput() {
        if (!this._isPlaying) {
            this._isPlaying = true;
            TimerModule.startTimer();
        }

        if (this._isWordCompleted()) {
            TimerModule.incrementTime();
            ScoreModule.incrementScore();
            this._updateWord();
        }
    },

    _isWordCompleted() {
        const enteredWord = WordInputModule.word;
        const requiredWord = WordModule.word;

        return enteredWord.toLowerCase() === requiredWord.toLowerCase();
    },

    _updateWord() {
        WordInputModule.clear();
        WordModule.word = this._randomWord();
    },

    async _randomWord() {
        if (!navigator.onLine) {
            return this.OFFLINE_WORDS[Math.floor(Math.random() * this.OFFLINE_WORDS.length)];
        }

        const response = await fetch('https://puzzle.mead.io/puzzle?wordCount=1');
        const responseBody = await response.json();

        return responseBody.puzzle.toLowerCase();
    }
};
