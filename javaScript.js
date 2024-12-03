const time = document.getElementById('timer-container');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const workTime = document.getElementById('workTime');
const shortBreak = document.getElementById('shortBreak');
const longBreak = document.getElementById('longBreak');

let timeLeft; // оставшееяся время в секундах
let timerId = null; 
let isPaused = false; // переменная для отслеживания состояния паузы
let cycleCount = []; // массив для хранения количества циклов
let currentMode = "work"; // текущий режим работы

// Функция для обновления отображения времени
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer-container').textContent = timeString;
}
// функция для обновления прогресс бара
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const totalTime = parseInt(workTime.value) * 60; // Общее время в секундах
    const percentage = (timeLeft / totalTime) * 100;
    progressBar.style.width = percentage + '%';
}

// Создаем функции отсчета времени
function startTimer() {
    if (timerId !== null) {
        return;
    }
    
    // Устанавливаем начальное время только если не на паузе
    if(!isPaused) {
        if(currentMode === 'work') {
            timeLeft = parseInt(workTime.value) * 60;
        } else if(currentMode === 'shortBreak') {
            timeLeft = parseInt(shortBreak.value) * 60;
        } else if(currentMode === 'longBreak') {
            timeLeft = parseInt(longBreak.value) * 60;
        }
    }

    timerId = setInterval(() => {
        if(timeLeft > 0) {
            timeLeft--;
            updateProgressBar();
            updateTimer();
        }
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;

            if(currentMode === 'work') {
                cycleCount.push(1);
                console.log('Циклы:', cycleCount);
                contCycle();
            } else if(currentMode === 'shortBreak') {
                currentMode = 'work';
                alert("Перерыв закончен, пора за работу!");
                resetTimer();
                startTimer();
            } else if(currentMode === 'longBreak') {
                currentMode = 'work';
                const userAnswer = confirm('Длинный перерыв закончен, хотите начать новый цикл?');
                if (userAnswer) {
                    resetTimer();
                    startTimer();
                } else {
                    alert('Правильно отдохни. Но не забывай про режим');
                    resetTimer();
                }
            }
        }
    }, 1000);
}

// функция для продолжения работы короткого перерыва
function continueShortBreak() {
    timerId = setInterval(() => {
        timeLeft--;
        updateTimer();
        updateProgressBar();
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            isPaused = false;
            currentMode = 'work';
            cycleCount.push(1+cycleCount.length);
            alert("Перерыв закончен, пора за работу");
            resetTimer();
            startTimer();
        }
    }, 1000);
}

// функция для продолжения работы длинного перерыва
function continueLongBreak() {
    timerId = setInterval(() => {
        timeLeft--;
        updateTimer();
        updateProgressBar();
        if(timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            currentMode = 'work';
            const userAnswer = confirm('Длинный перерыв закончен, хотите начать новый цикл?');
            if (userAnswer) {
                resetTimer();
                startTimer();
            } else {
                alert(' Правильно отдохни. Но не забывай про режим ');
                resetTimer();
            }
        }
    }, 1000);
}

// функция для остановки таймера
function stopTimer() {
    if(timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        isPaused = true;
    }
}

// функция для сброса таймера 
function resetTimer() {
    stopTimer();
    isPaused = false;
    currentMode = 'work';
    timeLeft = parseInt(workTime.value) * 60;
    updateTimer();
    updateProgressBar();
}

// реализация функции отсчета короткого перерыва если основной таймер закончился 

function shortBreakTimer() {
    clearInterval(timerId);
    if (!isPaused) {
        timeLeft = parseInt(shortBreak.value) * 60;
    }
    currentMode = "shortBreak";
    startTimer(); // запускаем основной таймер
}

// реализация функции отсчета длинного перерива если прошло 4 цикла
function longBreakTimer() {
   clearInterval(timerId);
   if (!isPaused) {
    timeLeft = parseInt(longBreak.value) * 60;
   }
   currentMode = 'longBreak';
   startTimer(); // запускаем основной таймер
}


// подсчёт циклов
function contCycle() {
    if (cycleCount.length === 4) {
        alert("Длинный перерыв начался!");
        console.log("Длинный перерыв начался");
        cycleCount = [];
        console.log("Циклы сброшены:", cycleCount);
        currentMode = 'longBreak';
        isPaused = false;
        timeLeft = parseInt(longBreak.value) * 60;
        startTimer();
    } else {
        alert("Короткий перерыв начался!");
        currentMode = 'shortBreak';
        isPaused = false;
        timeLeft = parseInt(shortBreak.value) * 60;
        startTimer();
    }
}


// обработчики событий на странице
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click',() => {
    resetTimer();
    cycleCount = []; // сбрасываем массив циклов при нажатии на кнопку ресет
    console.log(cycleCount);
});