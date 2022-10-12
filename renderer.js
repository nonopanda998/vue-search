const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

//获取ping命令的返回并展示
const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // 打印 'pong'
    // const information = document.getElementById('warn')
    // information.innerText = `响应pong：(v${response})})`
}

func()


//渲染器

const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
    const title = titleInput.value
    window.electronAPI.setTitle(title)
});



//打开文件返回文件路径
const btn1 = document.getElementById('btn1')
const filePathElement = document.getElementById('filePath')

btn1.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile()
    filePathElement.innerText = filePath
})


//计数器
const counter = document.getElementById('counter')
window.electronAPI.handleCounter((event, value) => {
    const oldValue = Number(counter.innerText)
    const newValue = oldValue + value
    counter.innerText = newValue
    event.sender.send('counter-value', newValue)
})


//dom体监听加载
window.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('counter')
    ipcRenderer.on('update-counter', (_event, value) => {
        const oldValue = Number(counter.innerText)
        const newValue = oldValue + value
        counter.innerText = newValue
    })
})


const counter1 = document.getElementById('counter')

window.electronAPI.onUpdateCounter((_event, value) => {
    const oldValue = Number(counter1.innerText)
    const newValue = oldValue + value
    counter1.innerText = newValue
})
