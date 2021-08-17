function addLegend(hour) {
    let element = document.createElement("DIV");
    element.classList.add("legendsContainer");
    let innerElement = document.createElement("DIV");
    element.style.position = "absolute";
    innerElement.classList.add("legends");
    let degree = hour * 30;
    element.style.transform = `translate(50vmin, 5vmin) rotate(${degree}deg)`;
    clockContainer.appendChild(element);
    element.appendChild(innerElement);
}

for (let i = 0; i < 12; i++) {
    addLegend(i);
}

function updateTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let hourRotation = 30 * hours + minutes / 2 + seconds / 120;
    let minuteRotation = 6 * minutes + seconds / 10;
    let secondRotation = 6 * seconds;

    hour.style.transform = `translate(-50%, 0%) rotate(${hourRotation}deg)`;
    minute.style.transform = `translate(-50%, 0%) rotate(${minuteRotation}deg)`;
    second.style.transform = `translate(-50%, 0%) rotate(${secondRotation}deg)`;
}
setTimeout(() => {
    setInterval(updateTime, 1000);
    // multiple webpages will tik together
}, 1000 - new Date().getMilliseconds());
updateTime();
