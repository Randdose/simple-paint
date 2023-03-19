// import browser, and app from electron, and import path from path.
const {app, BrowserWindow} = require('electron');
const path = require('path');

// creates a window basically
function createWindow(width, height, htmlPath, preloadPath){

	const win = new BrowserWindow({
		width: width,
		height: height,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			preload: preloadPath
		}
	});

	win.loadFile(htmlPath);
	console.log(preloadPath)
}

app.whenReady().then(() => {

	const{screen} = require('electron');

	const primaryDisplay = screen.getPrimaryDisplay();
	const factor = screen.getPrimaryDisplay().scaleFactor;
	const {width, height} = primaryDisplay.workAreaSize;

	createWindow(width/factor, height/factor, 'index.html', path.join(__dirname, 'preload.js'));

	console.log(primaryDisplay);

});
