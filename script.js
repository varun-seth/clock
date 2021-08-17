function updateTime() {
    date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    hour_rotation = 30 * hours + minutes / 2;
    minute_rotation = 6 * minutes + seconds / 10;
    second_rotation = 6 * seconds;

    hour.style.transform = `translate(-50%, 0%) rotate(${hour_rotation}deg)`;
    minute.style.transform = `translate(-50%, 0%) rotate(${minute_rotation}deg)`;
    second.style.transform = `translate(-50%, 0%) rotate(${second_rotation}deg)`;
}
setTimeout(() => {
    setInterval(updateTime, 1000);
    // multiple webpages will tik together
}, 1000 - new Date().getMilliseconds());
updateTime();
