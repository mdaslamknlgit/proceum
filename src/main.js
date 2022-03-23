const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let win;
function createWindow()
{
    win = new BrowserWindow({
        fullscreen: false,
        autoHideMenuBar: true,
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    });
    //console.log("Directory Name :" + __dirname);
    //load the dist folder from Angular

    //File system
    // win.loadURL(
    //     url.format({
    //         // compiled version of our app
    //         pathname: path.join(__dirname, './dist/index.html'),
    //         protocol: "file:",
    //         slashes: true,
    //     })
    // );

    //Localhost
    // win.loadURL(url.format({
    //     pathname: 'localhost:4200',
    //     protocol: 'http:',
    //     slashes: true
    // }));


    //Development live URL
    win.loadURL(url.format({
        pathname: 'dev.medvizz3d.com',
        protocol: 'https:',
        slashes: true
    }));


    // Open the DevTools.

    //win.webContents.openDevTools();

    //Maximize window
    win.maximize();
    //win.autoHideMenuBar = true;
    //win.setApplicationMenu(null);
    //win.setMenuBarVisibility(false);
    //win.setApplicationMenu(false);


    win.on("closed", () =>
    {
        win = null;
    });
}
app.on("ready", createWindow);



// If you are using MACOS, we have to quit the app manually 
app.on("window-all-closed", () =>
{
    if (process.platform !== "darwin")
    {
        app.quit();
    }
});