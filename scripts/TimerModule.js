const TimerModule = {
    _initialTime: 0,
    _timePerWord: 0,

    _$time: document.getElementById('time'),
    _time: 0,
    _timerInterval: -1,
    _timeEndListeners: [],

    init({initialTime, timePerWord}) {
        this._initialTime = initialTime;
        this._timePerWord = timePerWord;
    },

    set time(newTime) {
        this._time = newTime;
        this.renderTime();
    },

    get time() {
        return this._time;
    },

    incrementTime() {
        this.time += this._timePerWord;
    },

    reset() {
        this.time = this._initialTime;
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
