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
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    time.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    cycleCount = []; // сбрасываем массив циклов при нажатии на кнопку ресет
    console.log(cycleCount)
}

// реализация функции отсчета короткого перерыва если основной таймер закончился 

function shortBreakTimer() {
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

// подсчёт циклов
function contCycle() {

}


// обработчики событий на странице
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);