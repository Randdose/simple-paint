const {contextBridge} = require('electron');

app.whenReady().then(() => {

	const {screen} = require('electron');

	const primaryDisplay = screen.getPrimaryDisplay();
	const {width, height} = primaryDisplay.workAreaSize;

	//console.log(primaryDisplay);
})

window.addEventListener('DOMContentLoaded', () => {

	console.log(json);
	console.log(themeName);

});
