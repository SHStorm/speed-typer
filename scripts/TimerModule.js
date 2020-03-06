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
