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
    // если таймер уже запущен не создаем новый
    if (timerId !== null) {
        return;
    }
    // Если это первый запуск то получаем значение из инпута
    if(!isPaused) {
        timeLeft = parseInt(workTime.value) * 60;
    }

    timerId = setInterval (()=>{
        // уменьшаем оставшееся время 
        timeLeft--;
        updateProgressBar();
        updateTimer();

        // конвертируем в минуты и секунды
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        // обновляем отоброжение таймера
        time.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // если время истекло
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;  // сбрасываем таймер так как он закончился
            isPaused = true; // переводим в состояние паузы при нажатии на кнопку стоп
            cycleCount.push(1+cycleCount.length); // увеличиваем количество циклов
            console.log(cycleCount);
            // уведомление  о том что время истекло
            alert('время вышло');
            shortBreakTimer();  // запускаем функцию короткого перерыва
            contCycle();  // запускаем функцию подсчета циклов 
        }

    }, 1000)
}

// функция для остановки таймера
function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    isPaused = true; // переводим в состояние паузы при нажатии на кнопку стоп
}

// функция для сброса таймера 
function resetTimer() {
    stopTimer();
    isPaused = false; // сбрасываем состояние паузы
    timeLeft = parseInt(workTime.value) * 60;
    updateTimer();
    updateProgressBar();
    progressBar.style.width = '100%'; // Устанавливаем шкалу на 100% при сбросе
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    time.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

// реализация функции отсчета короткого перерыва если основной таймер закончился 

function shortBreakTimer() {
    clearInterval(timerId);
    // получаем значение из инпута
    timeLeft = parseInt(shortBreak.value) * 60;
    timerId = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        time.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        // если время истекло
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            alert(' перерыв закончкен, пора за работу '); 
            resetTimer();
            startTimer(); // запускаем основной таймер
        }
    }, 1000) 
}

// реализация функции отсчета длинного перерива если прошло 4 цикла
function longBreakTimer() {
    clearInterval(timerId);
    timeLeft = parseInt(longBreak.value) * 60;
    timerId = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        time.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            //  уведомление с кнопкой да или нет
            const userAnswer = confirm(` длинный перерыв закончился,
                Хотите начать новый цикл?`);
                 if (userAnswer) {
                    resetTimer();
                    startTimer();
                 } else {
                    alert('Правильно отдохни. Но не забывай про режим ');
                    resetTimer();
                 }
        }
    }, 1000)
}


// подсчёт циклов
function contCycle() {
    if (cycleCount.length === 4) {
        longBreakTimer();
        cycleCount = [];
        alert(" длинный перерыв начался");
        console.log(" длинный перерыв начался");
        console.log(cycleCount);
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