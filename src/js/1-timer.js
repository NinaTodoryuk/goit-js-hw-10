import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dataTime = document.querySelector('#datetime-picker'); // countdown сell
const startBtn = document.querySelector('button[data-start]');
const timerCell = {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
};

if (startBtn && dataTime && !Object.values(timerCell).some(field => field === null)) {
    } else {
    throw new Error('Missing required elements');
}

const time = Date.now(); // Отримання поточного часу

let userSelectedDate = null;
startBtn.disabled = true;
let timerInterval;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(time), 
    minuteIncrement: 1,// Використання поточного часу як значення за замовчуванням
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        if (selectedDate < new Date()) {
            iziToast.error({
                title: "Error",
                message: "Please choose a date in the future",
            });
            startBtn.disabled = true;
        } else {
            userSelectedDate = selectedDate;
            startBtn.disabled = false;
        }
    },
};

flatpickr(dataTime, options);

// Додати обробник подій click на поле вводу дати
dataTime.addEventListener("click", () => {
    // Відкриття календаря Flatpickr
    flatpickr(dataTime, options);
});

startBtn.addEventListener("click", () => {
    if (!userSelectedDate) return;

    const startTime = new Date();
    const endTime = userSelectedDate.getTime();

    startBtn.disabled = true;
    dataTime.disabled = true;

    function updateTimer() {
        const currentTime = new Date();
        const timeRemaining = endTime - currentTime.getTime();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            dataTime.disabled = false;
            Object.values(timerCell).forEach(cell => cell.textContent = '00');
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(timeRemaining);

        timerCell.days.textContent = addLeadingZero(days.toString());
        timerCell.hours.textContent = addLeadingZero(hours.toString());
        timerCell.minutes.textContent = addLeadingZero(minutes.toString());
        timerCell.seconds.textContent = addLeadingZero(seconds.toString());
    }

    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
});

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return value.padStart(2, '0');
}
