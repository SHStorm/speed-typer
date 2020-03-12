const WordModule = {
    _$word: document.getElementById('word'),

    init() {

    },

    set word(newWord) {
        if (typeof newWord === 'string') {
            this._$word.textContent = newWord;
            return;
        }

        this.word = 'loading...';

        newWord.then(word => {
            this.word = word;
        });
    },

    get word() {
        return this._$word.textContent;
    }
};
