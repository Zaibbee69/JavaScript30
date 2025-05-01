let countdown;

const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds)
{
    clearInterval(countdown);

    // First getting the current time in milliseconds
    const now = Date.now();

    // Calculating the ending time for our clock to run
    const then = now + seconds * 1000;

    // Display time firstly too as soon as run
    displayTimeLeft(seconds);
    displayEndTime(then);

    // Updating our timer on screen after every second
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);

        // Check if timer didn't reach zero
        if (secondsLeft < 0) 
        {
            clearInterval(countdown);
            return;
        }

        // Display it
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds)
{   
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;

    const display = `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;

    document.title = display;
    timerDisplay.textContent = display;
}

function displayEndTime(timestamp)
{
    const end = new Date(timestamp);

    const hour = end.getHours();
    const minutes = end.getMinutes();

    endTime.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? "0" : ""}${minutes}`;
}

function startTimer()
{
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach(button => button.addEventListener("click", startTimer));

document.customForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const mins = this.minutes.value;
    timer(mins * 60);
    this.reset();
});