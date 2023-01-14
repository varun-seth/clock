
### icons

This app is meant to be installed from the browser.


- Safari MacOS = icon.png
  - prefers favicon. 
    - If there is no transparency then the system just rounds the 4 corners.
    - If it has some transparency then the system creates a white box around it.
    - In certain cases, it discards this and moves to next preference.
  - If the favicon is not `png`, then it prefers a maskable icon (defined in the manifest)
  - If no maskable is found then it uses a normal icon from manifest.
- Chrome MacOS = icon-maskable.png
  - Prefers the manifest icon's maskable icon.
  - Chrome apps take the entire space available, so the icons are bigger than normal (in the dock and command tab menu).
- Safari iOS = icon-rounded.png
  - Only takes "size=180x180", otherwise it will show the first character of the app icon.
  - If the icon has any other shape than the rounded box, it will add a black background with a rounded box. This is done every time the app is minimized.
  - If the icon has any transparency (rounded box design) then minimizing the app also adds one extra artifact at the bottom. This is why no transparency has been used.
  