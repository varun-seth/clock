function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
if (window.cssVars) {
  cssVars({
    watch: true
  });
}
function addLegend(hour) {
  var dial = document.getElementById('dial');
  var element = document.createElement("DIV");
  element.classList.add("legendsContainer");
  var innerElement = document.createElement("DIV");
  element.style.position = "absolute";
  innerElement.classList.add("legends");
  var degree = hour * 30;
  element.style.transform = `rotate(${degree}deg)`;
  dial.appendChild(element);
  element.appendChild(innerElement);
}
for (var i = 0; i < 12; i++) {
  addLegend(i + 1);
}
var lastSecondRotation = 0;
var rotationOffset = 0;
function updateDate() {
  var date = new Date();
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var dayOfWeek = days[date.getDay()];
  var month = months[date.getMonth()];
  var dateNumber = date.getDate();
  var dayMonthElement = document.getElementById('dateDayMonth');
  var dateNumberElement = document.getElementById('dateNumber');
  var container = document.getElementById('theme-container');
  var isDateInside = container && container.classList.contains('date-inside');
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
  var container = document.getElementById('theme-container');
  if (!container) return;
  var showDate = getDateFromUrlOrDefault();
  if (!showDate) {
    container.classList.add('hide-date');
    return;
  }
  container.classList.remove('hide-date');
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var isLandscape = vw > vh;
  var minDimension = Math.min(vw, vh);
  var clockSize = minDimension;
  var availableSpace;
  if (isLandscape) {
    availableSpace = vw - clockSize;
  } else {
    availableSpace = vh - clockSize;
  }
  var minDateSize = minDimension * 0.20;
  var dateDisplay = document.getElementById('dateDisplay');
  var clockContainer = document.getElementById('clockContainer');
  var dateContainer = document.getElementById('dateContainer');
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
}
function updateTime() {
  var date = new Date();
  var milliseconds = date.getMilliseconds();

  // next tik's time, tries to be close to 1000
  // if current ms is 007, then wait for 903 ms
  // if current ms is 990, then wait for 1000 + 10 ms before updating time.
  // the minimum waiting is 500ms, maximum waiting is 1500ms. 
  // This avoids the sudden jerky animation in the beginning for caliberation.
  var lag = milliseconds < 500 ? milliseconds : milliseconds - 1000;
  var nextTime = 1000 - lag;

  // This is better than setInterval (which can be slowed down by the browser due to inactivity)
  // If two devices have same time, their clocks will visually together.
  setTimeout(function () {
    updateTime();
  }, nextTime);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var secondsRounded = Math.round(seconds + milliseconds / 1000);
  // because of rounding 60 is possible. But it is atmost 1 second different from seconds

  var hourRotation = 30 * hours + minutes / 2 + seconds / 120;
  var minuteRotation = 6 * minutes + secondsRounded / 10;
  var secondsMode = getSecondsModeFromUrlOrDefault();
  var secondRotation;
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
var styleIndex = 0;
var cursorTimeout;
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
styles = ['pill',
// Rounded corners
'oval', 'roman',
// Roman numerals
'ank',
// ank means numbers
'pike' // pointy design (polygon)
];
function loadStyleSheet(path) {
  var head = document.head; // Selecting the head element
  var link = document.createElement('link'); // Creating a link element

  link.rel = 'stylesheet'; // Setting relation to stylesheet
  link.type = 'text/css'; // Setting the type of the link element
  link.href = path; // Setting the path of the stylesheet

  head.appendChild(link); // Appending the link element to the head
}
styles.map(function (name) {
  loadStyleSheet(`style-${name}.css`);
});
function applyStyle(styleName) {
  var preventPush = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  document.title = `Clock - ${styleName} style`;
  var container = document.getElementById('theme-container');
  if (container) {
    var _container$classList;
    // remove existing style classes but preserve theme-* classes
    (_container$classList = container.classList).remove.apply(_container$classList, _toConsumableArray(styles));
    container.classList.add(styleName);
  }
  localStorage.setItem('style', styleName);
  if (!preventPush) {
    var currentUrl = new URL(window.location);
    currentUrl.searchParams.set('style', styleName);
    history.pushState({}, '', currentUrl);
  }
}
function nextStyle() {
  styleIndex = (styleIndex + 1) % styles.length;
  applyStyle(styles[styleIndex]);
}
function getStyleFromUrlOrDefault() {
  var urlParams = new URLSearchParams(window.location.search);
  var style = urlParams.get('style');
  if (!style) {
    style = localStorage.getItem('style') || styles[0];
  }
  var index = styles.indexOf(style);
  if (index == -1) {
    index = 0;
    style = styles[0]; // Fallback to default if not found
  }
  return style;
}
function applyStyleBoot() {
  var style = getStyleFromUrlOrDefault();
  styleIndex = styles.indexOf(style);
  applyStyle(style);
}
applyStyleBoot();
// Apply theme preference (default system or URL)
function applyThemeBoot() {
  var theme = getThemeFromUrlOrDefault();
  // apply on boot without pushing URL/history
  applyTheme(theme, false, true);
}
applyThemeBoot();
function applySecondsBoot() {
  var show = getSecondsFromUrlOrDefault();
  applySeconds(show, false, true);
}
applySecondsBoot();
function applySecondsModeBoot() {
  var mode = getSecondsModeFromUrlOrDefault();
  applySecondsMode(mode, false, true);
}
applySecondsModeBoot();
function applyDateBoot() {
  var show = getDateFromUrlOrDefault();
  applyDate(show, false, true);
}
applyDateBoot();
var settingsButton = document.getElementById('settingsButton');
var settingsDialog = document.getElementById('settingsDialog');
if (settingsDialog && window.dialogPolyfill) {
  dialogPolyfill.registerDialog(settingsDialog);
}
var styleSelect = document.getElementById('styleSelect');
var themeSelect = document.getElementById('themeSelect');
var secondsCheckbox = document.getElementById('secondsCheckbox');
var secondsModeSelect = document.getElementById('secondsModeSelect');
var dateCheckbox = document.getElementById('dateCheckbox');
var saveButton = document.getElementById('saveButton');
var cancelButton = document.getElementById('cancelButton');
var hideSettingsTimer = null;
var previousStyle = null;
var previousTheme = null;
var previousSeconds = null;
var previousSecondsMode = null;
var previousDate = null;
var settingsSaved = false;
function populateStyleOptions() {
  if (!styleSelect) return;
  styleSelect.innerHTML = '';
  styles.forEach(function (s) {
    var opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    styleSelect.appendChild(opt);
  });
  var current = getStyleFromUrlOrDefault();
  styleSelect.value = current;
}
function populateThemeOptions() {
  if (!themeSelect) return;
  var current = getThemeFromUrlOrDefault();
  themeSelect.value = current;
}
function getThemeFromStorageOrDefault() {
  return localStorage.getItem('theme') || 'dark';
}
function getThemeFromUrlOrDefault() {
  var urlParams = new URLSearchParams(window.location.search);
  var theme = urlParams.get('theme');
  if (!theme) {
    theme = localStorage.getItem('theme') || 'dark';
  }
  if (!['system', 'light', 'dark'].includes(theme)) theme = 'dark';
  return theme;
}
function applyTheme(themeName) {
  var persist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var preventPush = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  // themeName: 'system'|'light'|'dark'
  var container = document.getElementById('theme-container');
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
    var currentUrl = new URL(window.location);
    currentUrl.searchParams.set('theme', themeName);
    history.pushState({}, '', currentUrl);
  }
}
function getSecondsFromUrlOrDefault() {
  var urlParams = new URLSearchParams(window.location.search);
  var seconds = urlParams.get('seconds');
  if (seconds === null) {
    seconds = localStorage.getItem('seconds') || 'true';
  }
  return seconds === 'true';
}
function getSecondsModeFromUrlOrDefault() {
  var urlParams = new URLSearchParams(window.location.search);
  var mode = urlParams.get('secondsMode');
  if (!mode) {
    mode = localStorage.getItem('secondsMode') || 'analog';
  }
  if (!['digital', 'analog', 'smooth'].includes(mode)) mode = 'analog';
  return mode;
}
function getDateFromUrlOrDefault() {
  var urlParams = new URLSearchParams(window.location.search);
  var showDate = urlParams.get('date');
  if (showDate === null) {
    showDate = localStorage.getItem('date') || 'true';
  }
  return showDate === 'true';
}
function applySeconds(show) {
  var persist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var preventPush = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var container = document.getElementById('theme-container');
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
    var currentUrl = new URL(window.location);
    currentUrl.searchParams.set('seconds', show);
    history.pushState({}, '', currentUrl);
  }
}
function applySecondsPreview(show) {
  applySeconds(show, false, true);
}
function applySecondsMode(mode) {
  var persist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var preventPush = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var container = document.getElementById('theme-container');
  if (!container) return;
  container.classList.remove('seconds-mode-digital', 'seconds-mode-analog', 'seconds-mode-smooth');
  container.classList.add(`seconds-mode-${mode}`);
  if (persist) {
    localStorage.setItem('secondsMode', mode);
  }
  if (!preventPush) {
    var currentUrl = new URL(window.location);
    currentUrl.searchParams.set('secondsMode', mode);
    history.pushState({}, '', currentUrl);
  }
}
function applyDate(show) {
  var persist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var preventPush = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var container = document.getElementById('theme-container');
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
    var currentUrl = new URL(window.location);
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
  var current = getSecondsFromUrlOrDefault();
  secondsCheckbox.checked = current;
  updateSecondsModeVisibility(current);
}
function updateSecondsModeVisibility(showSeconds) {
  var secondsModeContainer = document.getElementById('secondsModeContainer');
  if (secondsModeContainer) {
    if (showSeconds) {
      secondsModeContainer.classList.add('visible');
    } else {
      secondsModeContainer.classList.remove('visible');
    }
  }
}
function populateSecondsModeSelect() {
  var select = document.getElementById('secondsModeSelect');
  if (!select) return;
  var current = getSecondsModeFromUrlOrDefault();
  select.value = current;
}
function populateDateCheckbox() {
  if (!dateCheckbox) return;
  var current = getDateFromUrlOrDefault();
  dateCheckbox.checked = current;
}
function applyStylePreview(styleName) {
  var _container$classList2;
  // Apply visual preview without persisting to localStorage or history
  document.title = `Clock - ${styleName} style`;
  var container = document.getElementById('theme-container');
  if (!container) return;
  // remove any other style classes (but keep theme classes)
  (_container$classList2 = container.classList).remove.apply(_container$classList2, _toConsumableArray(styles));
  container.classList.add(styleName);
  // update styleIndex so nextStyle/other code remains consistent
  var idx = styles.indexOf(styleName);
  if (idx !== -1) styleIndex = idx;
}
function showSettingsButton() {
  if (!settingsButton) return;
  settingsButton.classList.add('visible');
  if (hideSettingsTimer) clearTimeout(hideSettingsTimer);
  hideSettingsTimer = setTimeout(function () {
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
  document.addEventListener('click', function (e) {
    if (settingsButton && (e.target === settingsButton || settingsButton.contains(e.target))) return;
    if (settingsDialog && settingsDialog.contains && settingsDialog.contains(e.target)) return;
    showSettingsButton();
  });
}
if (settingsButton) {
  settingsButton.addEventListener('click', function (e) {
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
  saveButton.addEventListener('click', function (e) {
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
  cancelButton.addEventListener('click', function (e) {
    // closing without saving will trigger the dialog close handler which will revert
    if (settingsDialog && settingsDialog.close) settingsDialog.close();
  });
}
if (styleSelect) {
  styleSelect.addEventListener('change', function (e) {
    var val = e.target.value;
    applyStylePreview(val);
  });
}
if (themeSelect) {
  themeSelect.addEventListener('change', function (e) {
    var val = e.target.value;
    applyThemePreview(val);
  });
}
if (secondsCheckbox) {
  secondsCheckbox.addEventListener('change', function (e) {
    var val = e.target.checked;
    applySecondsPreview(val);
    updateSecondsModeVisibility(val);
  });
}
if (secondsModeSelect) {
  secondsModeSelect.addEventListener('change', function (e) {
    var val = e.target.value;
    applySecondsModePreview(val);
  });
}
if (dateCheckbox) {
  dateCheckbox.addEventListener('change', function (e) {
    var val = e.target.checked;
    applyDatePreview(val);
  });
}
if (settingsDialog) {
  settingsDialog.addEventListener('close', function (e) {
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
  settingsDialog.addEventListener('click', function (e) {
    if (e.target === settingsDialog) {
      if (settingsDialog.close) settingsDialog.close();
    }
  });
}
window.addEventListener('popstate', function (event) {
  var style = getStyleFromUrlOrDefault();
  applyStyle(style, true);
  var theme = getThemeFromUrlOrDefault();
  applyTheme(theme, false, true);
  var seconds = getSecondsFromUrlOrDefault();
  applySeconds(seconds, false, true);
  var secondsMode = getSecondsModeFromUrlOrDefault();
  applySecondsMode(secondsMode, false, true);
  var showDate = getDateFromUrlOrDefault();
  applyDate(showDate, false, true);
});
