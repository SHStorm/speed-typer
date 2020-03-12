const ScoreModule = {
    _scorePerWord: 0,

    _$score: document.getElementById('score'),
    _score: 0,

    init({scorePerWord}) {
        this._scorePerWord = scorePerWord;
    },

    set score(newScore) {
        this._score = newScore;
        this.renderScore();
    },

    get score() {
        return this._score;
    },

    incrementScore() {
        this.score = this.score + this._scorePerWord;
    },

    reset() {
        this.score = 0;
    },

    renderScore() {
        this._$score.textContent = this._score;
    }
};
