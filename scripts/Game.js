const Game = {
    init() {
        this._enableAutofocusOnKeyPress();
        WordInputModule.focus();
        WordInputModule.onInput(this._handleInput.bind(this));
        TimerModule.onTimeEnd(this.restart.bind(this));
    },

    start() {
        WordInputModule.clear();

        ScoreModule.reset();
        TimerModule.startTimer();

        this._updateWord();
    },

    restart() {
        this.start();
    },

    _enableAutofocusOnKeyPress() {
        window.addEventListener('keydown', () => {
            WordInputModule.focus();
        });
    },

    _handleInput() {
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
        const response = await fetch('https://puzzle.mead.io/puzzle?wordCount=1');
        const responseBody = await response.json();

        return responseBody.puzzle.toLowerCase();
    }
};
