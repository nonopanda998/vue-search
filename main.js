//主进程文件，主进程与渲染进程进行交互，所有nodejs操作在这里进行，渲染进程不允许访问.
//对于nodejs的操作，都在主进程加载的预处理preload.js中对外暴露。
//各个进程间的通信使用开发人员提供的IPC通道，调用ipcMain 和 ipcRenderer 模块进行通信。


//
// 主进程模块\渲染器模块\进程通信模块
const {app, BrowserWindow,ipcMain,dialog,Menu} = require('electron')
// nodejs的路径模块
const path = require('path')

//创建应用窗口
const createWindow = () => {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            //窗口渲染时加入对应的js，preload里暴露了版本号和环境变量供全局使用
            preload: path.join(__dirname, 'preload.js')
        }
    })




    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () => win.webContents.send('update-counter', 1),
                    label: 'Increment',
                },
                {
                    click: () => win.webContents.send('update-counter', -1),
                    label: 'Decrement',
                }
            ]
        }

    ])

    Menu.setApplicationMenu(menu)

    //加载网页
    win.loadFile('index.html')
    //获取网页内容
    const contents = win.webContents

    //加载进程通信的控制器，此处加载了ping命令
    // ipcMain.handle('ping', () => 'pong')
    // Open the DevTools.
    win.webContents.openDevTools()
}



//在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。
//您可以通过使用 app.whenReady() API来监听此事件。
//在whenReady()成功后调用createWindow()。
app.whenReady().then(() => {
    //使用ipcMain监听事件
    ipcMain.on('set-title', handleSetTitle)
    ipcMain.handle('dialog:openFile', handleFileOpen)
    ipcMain.on('counter-value', (_event, value) => {
        console.log(value) // will print value to Node console
    })



    //渲染窗口
    createWindow()
    //苹果操作系统支持
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

})

//所有渲染器被关闭后，退出主进程
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})






//设置标题
function handleSetTitle (event, title) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
}
//打开文件
async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
        return
    } else {
        return filePaths[0]
    }
}


