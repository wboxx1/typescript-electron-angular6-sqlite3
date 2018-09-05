import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import 'reflect-metadata';
import { DbService as db } from './db.service';
import * as typeorm from 'typeorm';
import { Item } from './assets/models/item.schema';
import { throwError } from 'rxjs';


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const connectionPromise: Promise<typeorm.Connection> = typeorm.createConnection(
	{
		'type': 'sqlite',
		'synchronize': true,
		'logging': true,
		'logger': 'simple-console',
		'database': './dist/assets/data/database.sqlite',
		'entities': [
			Item
		]
	});

function createWindow()
{
	// Create the browser window.
	win = new BrowserWindow(
		{
			width: 800,
			height: 600,
			icon: path.join(__dirname, 'favicon.ico'),
			webPreferences:
			{
				nodeIntegration: true, // turn it on to use node features
			},
		});

	// and load the index.html of the app.
	win.loadURL(url.format(
		{
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file:',
			slashes: true
		}));

	win.webContents.openDevTools();

	// Emitted when the window is closed.
	win.on('closed', () =>
	{
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
		// apiwin = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () =>
{
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin')
	{
		app.quit();
	}
});

app.on('activate', () =>
{
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null)
	{
		createWindow();
	}
});

// Set ipc main to catch all synchronous messages
ipcMain.on('synchronous-message', (event, ...args) =>
{
	switch (args[0])
	{
		case 'add-item':
			connectionPromise
			.then((connection) =>
			{
				return (db.postEntry(connection, args[1]));
			})
			.then((msg) =>
			{
				event.returnValue = msg;
			})
			.catch((err) =>
			{
				throwError(err);
			});
			break;
		case 'delete-item':
			connectionPromise
			.then((connection) =>
			{
				return (db.deleteEntry(connection, args[1]));
			})
			.then((msg) =>
			{
				event.returnValue = msg;
			})
			.catch((err) =>
			{
				throwError(err);
			});
			break;
	}
});
