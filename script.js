function addLegend(hour) {
    let element = document.createElement("DIV");
    element.classList.add("legendsContainer");
    let innerElement = document.createElement("DIV");
    element.style.position = "absolute";
    innerElement.classList.add("legends");
    let degree = hour * 30;
    element.style.transform = `translate(50vmin, 0vmin) rotate(${degree}deg)`;
    clockContainer.appendChild(element);
    element.appendChild(innerElement);
}

for (let i = 0; i < 12; i++) {
    addLegend(i);
}

function updateTime() {
    let date = new Date();
    let milliseconds = date.getMilliseconds();

    // next tik's time, tries to be close to 1000
    // if current ms is 007, then wait for 903 ms
    // if current ms is 990, then wait for 1000 + 10 ms before updating time.
    let lag = milliseconds < 500 ? milliseconds : milliseconds - 1000;

    let nextTime = 1000 - lag;
    setTimeout(() => {
        updateTime();
    }, nextTime);

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let secondsRounded = Math.round(seconds + milliseconds / 1000);
    // because of rounding 60 is possible. But it is atmost 1 second different from seconds

    let hourRotation = 30 * hours + minutes / 2 + seconds / 120;
    let minuteRotation = 6 * minutes + secondsRounded / 10;
    let secondRotation = 6 * secondsRounded;

    hour.style.transform = `translate(-50%, 0%) rotate(${hourRotation}deg)`;
    minute.style.transform = `translate(-50%, 0%) rotate(${minuteRotation}deg)`;
    second.style.transform = `translate(-50%, 0%) rotate(${secondRotation}deg)`;
}

updateTime();
