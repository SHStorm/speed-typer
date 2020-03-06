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
