function addLegend(hour) {
    let dial = document.getElementById('dial');
    let element = document.createElement("DIV");
    element.classList.add("legendsContainer");
    let innerElement = document.createElement("DIV");
    element.style.position = "absolute";
    innerElement.classList.add("legends");
    let degree = hour * 30;
    element.style.transform = `rotate(${degree}deg)`;
    dial.appendChild(element);
    element.appendChild(innerElement);
}

for (let i = 0; i < 12; i++) {
    addLegend(i + 1);
}

let lastSecondRotation = 0;
let rotationOffset = 0;

function updateDate() {
    let date = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let dayOfWeek = days[date.getDay()];
    let month = months[date.getMonth()];
    let dateNumber = date.getDate();

    let dayMonthElement = document.getElementById('dateDayMonth');
    let dateNumberElement = document.getElementById('dateNumber');

    const container = document.getElementById('theme-container');
    const isDateInside = container && container.classList.contains('date-inside');

    if (dayMonthElement) {
        if (isDateInside) {
            dayMonthElement.innerHTML = `<span style="color: red;">${dayOfWeek}</span>`;
        } else {
            dayMonthElement.innerHTML = `<span style="color: red;">${dayOfWeek}</span> <span style="color: gray;">${month}</span>`;
        }
    }
    if (dateNumberElement) {
        dateNumberElement.textContent = dateNumber;
    }
}

function checkDateDisplayMode() {
    const container = document.getElementById('theme-container');
    if (!container) return;

    const showDate = getDateFromUrlOrDefault();
    if (!showDate) {
        container.classList.add('hide-date');
        return;
    }

    container.classList.remove('hide-date');

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const isLandscape = vw > vh;
    const minDimension = Math.min(vw, vh);
    const clockSize = minDimension;

    let availableSpace;
    if (isLandscape) {
        availableSpace = vw - clockSize;
    } else {
        availableSpace = vh - clockSize;
    }

    const minDateSize = minDimension * 0.20;

    const dateDisplay = document.getElementById('dateDisplay');
    const clockContainer = document.getElementById('clockContainer');
    const dateContainer = document.getElementById('dateContainer');

    if (availableSpace < minDateSize) {
        container.classList.add('date-inside');
        if (dateDisplay && clockContainer && dateDisplay.parentElement !== clockContainer) {
            clockContainer.appendChild(dateDisplay);
        }
    } else {
        container.classList.remove('date-inside');
        if (dateDisplay && dateContainer && dateDisplay.parentElement !== dateContainer) {
            dateContainer.appendChild(dateDisplay);
        }
    }

    updateDate();
} function updateTime() {
    let date = new Date();
    let milliseconds = date.getMilliseconds();

    // next tik's time, tries to be close to 1000
    // if current ms is 007, then wait for 903 ms
    // if current ms is 990, then wait for 1000 + 10 ms before updating time.
    // the minimum waiting is 500ms, maximum waiting is 1500ms. 
    // This avoids the sudden jerky animation in the beginning for caliberation.
    let lag = milliseconds < 500 ? milliseconds : milliseconds - 1000;

    let nextTime = 1000 - lag;

    // This is better than setInterval (which can be slowed down by the browser due to inactivity)
    // If two devices have same time, their clocks will visually together.
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

    const secondsMode = getSecondsModeFromUrlOrDefault();
    let secondRotation;

    if (secondsMode === 'smooth') {
        secondRotation = 6 * (seconds + milliseconds / 1000);
    } else {
        secondRotation = 6 * secondsRounded;
    }

    if (secondsMode === 'smooth' || secondsMode === 'analog') {
        if (secondRotation < lastSecondRotation - 180) {
            rotationOffset += 360;
        }
        lastSecondRotation = secondRotation;
        secondRotation = secondRotation + rotationOffset;
    }

    document.documentElement.style.setProperty('--rotation-angle-second', `${secondRotation}deg`);
    document.documentElement.style.setProperty('--rotation-angle-hour', `${hourRotation}deg`);
    document.documentElement.style.setProperty('--rotation-angle-minute', `${minuteRotation}deg`);

    updateDate();
}

updateTime();
checkDateDisplayMode();

window.addEventListener('resize', checkDateDisplayMode);
let styleIndex = 0;

let cursorTimeout;
function hideCursor() {
    document.body.classList.add('hide-cursor');
}

function showCursor() {
    document.body.classList.remove('hide-cursor');
    if (cursorTimeout) clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(hideCursor, 10000);
}

document.addEventListener('mousemove', showCursor);
document.addEventListener('mousedown', showCursor);
document.addEventListener('keydown', showCursor);
showCursor();

styles = [
    'pill', // Rounded corners
    'oval',
    'roman', // Roman numerals
    'ank', // ank means numbers
    'pike', // pointy design (polygon)
];

function loadStyleSheet(path) {
    var head = document.head; // Selecting the head element
    var link = document.createElement('link'); // Creating a link element

    link.rel = 'stylesheet'; // Setting relation to stylesheet
    link.type = 'text/css'; // Setting the type of the link element
    link.href = path; // Setting the path of the stylesheet

    head.appendChild(link); // Appending the link element to the head
}

styles.map((name) => { loadStyleSheet(`style-${name}.css`); })

function applyStyle(styleName, preventPush = false) {
    document.title = `Clock - ${styleName} style`;
    const container = document.getElementById('theme-container');
    if (container) {
        // remove existing style classes but preserve theme-* classes
        container.classList.remove(...styles);
        container.classList.add(styleName);
    }
    localStorage.setItem('style', styleName);
    if (!preventPush) {
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('style', styleName);
        history.pushState({}, '', currentUrl);
    }
}


function nextStyle() {
    styleIndex = (styleIndex + 1) % styles.length;
    applyStyle(styles[styleIndex]);
}

function getStyleFromUrlOrDefault() {
    const urlParams = new URLSearchParams(window.location.search);
    let style = urlParams.get('style');

    if (!style) {
        style = localStorage.getItem('style') || styles[0];
    }

    let index = styles.indexOf(style);
    if (index == -1) {
        index = 0;
        style = styles[0]; // Fallback to default if not found
    }
    return style;
}

function applyStyleBoot() {
    let style = getStyleFromUrlOrDefault();
    styleIndex = styles.indexOf(style);
    applyStyle(style);
}


applyStyleBoot();
// Apply theme preference (default system or URL)
function applyThemeBoot() {
    const theme = getThemeFromUrlOrDefault();
    // apply on boot without pushing URL/history
    applyTheme(theme, false, true);
}

applyThemeBoot();

function applySecondsBoot() {
    const show = getSecondsFromUrlOrDefault();
    applySeconds(show, false, true);
}

applySecondsBoot();

function applySecondsModeBoot() {
    const mode = getSecondsModeFromUrlOrDefault();
    applySecondsMode(mode, false, true);
}

applySecondsModeBoot();

function applyDateBoot() {
    const show = getDateFromUrlOrDefault();
    applyDate(show, false, true);
}

applyDateBoot();

const settingsButton = document.getElementById('settingsButton');
const settingsDialog = document.getElementById('settingsDialog');
const styleSelect = document.getElementById('styleSelect');
const themeSelect = document.getElementById('themeSelect');
const secondsCheckbox = document.getElementById('secondsCheckbox');
const secondsModeSelect = document.getElementById('secondsModeSelect');
const dateCheckbox = document.getElementById('dateCheckbox');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');

let hideSettingsTimer = null;
let previousStyle = null;
let previousTheme = null;
let previousSeconds = null;
let previousSecondsMode = null;
let previousDate = null;
let settingsSaved = false;

function populateStyleOptions() {
    if (!styleSelect) return;
    styleSelect.innerHTML = '';
    styles.forEach((s) => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        styleSelect.appendChild(opt);
    });
    const current = getStyleFromUrlOrDefault();
    styleSelect.value = current;
}

function populateThemeOptions() {
    if (!themeSelect) return;
    const current = getThemeFromUrlOrDefault();
    themeSelect.value = current;
}

function getThemeFromStorageOrDefault() {
    return localStorage.getItem('theme') || 'system';
}

function getThemeFromUrlOrDefault() {
    const urlParams = new URLSearchParams(window.location.search);
    let theme = urlParams.get('theme');
    if (!theme) {
        theme = localStorage.getItem('theme') || 'system';
    }
    if (!['system', 'light', 'dark'].includes(theme)) theme = 'system';
    return theme;
}

function applyTheme(themeName, persist = false, preventPush = false) {
    // themeName: 'system'|'light'|'dark'
    const container = document.getElementById('theme-container');
    if (!container) return;
    container.classList.remove('theme-light', 'theme-dark');
    if (themeName === 'light') {
        container.classList.add('theme-light');
    } else if (themeName === 'dark') {
        container.classList.add('theme-dark');
    } else {
        // system: don't add theme override so media queries take effect
    }
    if (persist) {
        localStorage.setItem('theme', themeName);
    }
    if (!preventPush) {
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('theme', themeName);
        history.pushState({}, '', currentUrl);
    }
}

function getSecondsFromUrlOrDefault() {
    const urlParams = new URLSearchParams(window.location.search);
    let seconds = urlParams.get('seconds');
    if (seconds === null) {
        seconds = localStorage.getItem('seconds') || 'false';
    }
    return seconds === 'true';
}

function getSecondsModeFromUrlOrDefault() {
    const urlParams = new URLSearchParams(window.location.search);
    let mode = urlParams.get('secondsMode');
    if (!mode) {
        mode = localStorage.getItem('secondsMode') || 'digital';
    }
    if (!['digital', 'analog', 'smooth'].includes(mode)) mode = 'digital';
    return mode;
}

function getDateFromUrlOrDefault() {
    const urlParams = new URLSearchParams(window.location.search);
    let showDate = urlParams.get('date');
    if (showDate === null) {
        showDate = localStorage.getItem('date') || 'false';
    }
    return showDate === 'true';
}

function applySeconds(show, persist = false, preventPush = false) {
    const container = document.getElementById('theme-container');
    if (!container) return;
    if (show) {
        container.classList.remove('hide-seconds');
    } else {
        container.classList.add('hide-seconds');
    }
    if (persist) {
        localStorage.setItem('seconds', show);
    }
    if (!preventPush) {
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('seconds', show);
        history.pushState({}, '', currentUrl);
    }
}

function applySecondsPreview(show) {
    applySeconds(show, false, true);
}

function applySecondsMode(mode, persist = false, preventPush = false) {
    const container = document.getElementById('theme-container');
    if (!container) return;
    container.classList.remove('seconds-mode-digital', 'seconds-mode-analog', 'seconds-mode-smooth');
    container.classList.add(`seconds-mode-${mode}`);
    if (persist) {
        localStorage.setItem('secondsMode', mode);
    }
    if (!preventPush) {
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('secondsMode', mode);
        history.pushState({}, '', currentUrl);
    }
}

function applyDate(show, persist = false, preventPush = false) {
    const container = document.getElementById('theme-container');
    if (!container) return;
    if (show) {
        container.classList.remove('hide-date');
    } else {
        container.classList.add('hide-date');
    }
    if (persist) {
        localStorage.setItem('date', show);
    }
    if (!preventPush) {
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('date', show);
        history.pushState({}, '', currentUrl);
    }
    checkDateDisplayMode();
}

function applyDatePreview(show) {
    applyDate(show, false, true);
}

function applySecondsModePreview(mode) {
    applySecondsMode(mode, false, true);
}

function populateSecondsCheckbox() {
    if (!secondsCheckbox) return;
    const current = getSecondsFromUrlOrDefault();
    secondsCheckbox.checked = current;
    updateSecondsModeVisibility(current);
}

function updateSecondsModeVisibility(showSeconds) {
    const secondsModeContainer = document.getElementById('secondsModeContainer');
    if (secondsModeContainer) {
        if (showSeconds) {
            secondsModeContainer.classList.add('visible');
        } else {
            secondsModeContainer.classList.remove('visible');
        }
    }
}

function populateSecondsModeSelect() {
    const select = document.getElementById('secondsModeSelect');
    if (!select) return;
    const current = getSecondsModeFromUrlOrDefault();
    select.value = current;
}

function populateDateCheckbox() {
    if (!dateCheckbox) return;
    const current = getDateFromUrlOrDefault();
    dateCheckbox.checked = current;
}

function applyStylePreview(styleName) {
    // Apply visual preview without persisting to localStorage or history
    document.title = `Clock - ${styleName} style`;
    const container = document.getElementById('theme-container');
    if (!container) return;
    // remove any other style classes (but keep theme classes)
    container.classList.remove(...styles);
    container.classList.add(styleName);
    // update styleIndex so nextStyle/other code remains consistent
    const idx = styles.indexOf(styleName);
    if (idx !== -1) styleIndex = idx;
}

function showSettingsButton() {
    if (!settingsButton) return;
    settingsButton.classList.add('visible');
    if (hideSettingsTimer) clearTimeout(hideSettingsTimer);
    hideSettingsTimer = setTimeout(() => {
        hideSettingsButton();
    }, 5000);
}

function hideSettingsButton() {
    if (!settingsButton) return;
    settingsButton.classList.remove('visible');
    if (hideSettingsTimer) {
        clearTimeout(hideSettingsTimer);
        hideSettingsTimer = null;
    }
}

if (document.body) {
    document.addEventListener('click', (e) => {
        if (settingsButton && (e.target === settingsButton || settingsButton.contains(e.target))) return;
        if (settingsDialog && settingsDialog.contains && settingsDialog.contains(e.target)) return;
        showSettingsButton();
    });
}

if (settingsButton) {
    settingsButton.addEventListener('click', (e) => {
        e.stopPropagation();
        previousStyle = getStyleFromUrlOrDefault();
        previousTheme = getThemeFromUrlOrDefault();
        previousSeconds = getSecondsFromUrlOrDefault();
        previousSecondsMode = getSecondsModeFromUrlOrDefault();
        previousDate = getDateFromUrlOrDefault();
        settingsSaved = false;
        populateStyleOptions();
        populateThemeOptions();
        populateSecondsCheckbox();
        populateSecondsModeSelect();
        populateDateCheckbox();
        if (settingsDialog && settingsDialog.showModal) {
            settingsDialog.showModal();
        }
    });
}

if (saveButton) {
    saveButton.addEventListener('click', (e) => {
        settingsSaved = true;
        if (styleSelect && styleSelect.value) {
            applyStyle(styleSelect.value);
        }
        if (themeSelect && themeSelect.value) {
            applyTheme(themeSelect.value, true);
        }
        if (secondsCheckbox) {
            applySeconds(secondsCheckbox.checked, true);
        }
        if (secondsModeSelect && secondsModeSelect.value) {
            applySecondsMode(secondsModeSelect.value, true);
        }
        if (dateCheckbox) {
            applyDate(dateCheckbox.checked, true);
        }
        if (settingsDialog && settingsDialog.close) settingsDialog.close();
        hideSettingsButton();
    });
}

if (cancelButton) {
    cancelButton.addEventListener('click', (e) => {
        // closing without saving will trigger the dialog close handler which will revert
        if (settingsDialog && settingsDialog.close) settingsDialog.close();
    });
}

if (styleSelect) {
    styleSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        applyStylePreview(val);
    });
}

if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        applyThemePreview(val);
    });
}

if (secondsCheckbox) {
    secondsCheckbox.addEventListener('change', (e) => {
        const val = e.target.checked;
        applySecondsPreview(val);
        updateSecondsModeVisibility(val);
    });
}

if (secondsModeSelect) {
    secondsModeSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        applySecondsModePreview(val);
    });
}

if (dateCheckbox) {
    dateCheckbox.addEventListener('change', (e) => {
        const val = e.target.checked;
        applyDatePreview(val);
    });
}

if (settingsDialog) {
    settingsDialog.addEventListener('close', (e) => {
        if (!settingsSaved) {
            if (previousStyle) applyStylePreview(previousStyle);
            if (previousTheme) applyThemePreview(previousTheme);
            if (previousSeconds !== null) applySecondsPreview(previousSeconds);
            if (previousSecondsMode) applySecondsModePreview(previousSecondsMode);
            if (previousDate !== null) applyDatePreview(previousDate);
        }
        settingsSaved = false;
        previousStyle = null;
        previousTheme = null;
        previousSeconds = null;
        previousSecondsMode = null;
        previousDate = null;
    });

    settingsDialog.addEventListener('click', (e) => {
        if (e.target === settingsDialog) {
            if (settingsDialog.close) settingsDialog.close();
        }
    });
}

window.addEventListener('popstate', function (event) {
    let style = getStyleFromUrlOrDefault();
    applyStyle(style, true);
    let theme = getThemeFromUrlOrDefault();
    applyTheme(theme, false, true);
    let seconds = getSecondsFromUrlOrDefault();
    applySeconds(seconds, false, true);
    let secondsMode = getSecondsModeFromUrlOrDefault();
    applySecondsMode(secondsMode, false, true);
    let showDate = getDateFromUrlOrDefault();
    applyDate(showDate, false, true);
});
