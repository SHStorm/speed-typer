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

    set isDisabled(flag) {
        this._$wordInput.disabled = flag;
    },

    _handleInput() {
        this._inputListeners.forEach(listener => listener());
    }
};
