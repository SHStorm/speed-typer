const Game = {
    init() {
        this._enableAutofocusOnKeyPress();
        WordInputModule.focus();
        WordInputModule.onInput(this._validateInput.bind(this));
        TimerModule.onTimeEnd(this.restart.bind(this));
    },

    start() {
        WordInputModule.clear();

        ScoreModule.reset();
        TimerModule.startTimer();

        this._nextWord();
    },

    restart() {
        this.start();
    },

    _enableAutofocusOnKeyPress() {
        window.addEventListener('keydown', () => {
            WordInputModule.focus();
        });
    },

    _validateInput() {
        if (this._checkWord()) {
            TimerModule.incrementTime();
            ScoreModule.incrementScore();
            this._nextWord();
        }
    },

    _checkWord() {
        const enteredWord = WordInputModule.word;
        const requiredWord = WordModule.word;

        return enteredWord.toLowerCase() === requiredWord.toLowerCase();
    },

    _nextWord() {
        WordInputModule.clear();
        WordModule.word = this._randomWord();
    },

    async _randomWord() {
        const response = await fetch('https://puzzle.mead.io/puzzle?wordCount=1');
        const responseBody = await response.json();

        return responseBody.puzzle.toLowerCase();
    }
};
