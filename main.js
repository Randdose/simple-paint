const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow(){
	const win = new BrowserWindow({
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	win.loadFile('index.html')
}

app.whenReady().then(() => {

	let mainWindow = null;

	const {screen} = require('electron');

	const primaryDisplay = screen.getPrimaryDisplay();
	const {width, height} = primaryDisplay.workAreaSize;

	document.write(width, height)

	mainWindow = new BrowserWindow({width, height});
	mainWindow.loadFile('index.html');
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
