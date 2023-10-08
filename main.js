const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
  Notification
} = require("electron");
const path = require("path");
// const electronReload = require("electron-reload"); // 引入electron-reload热加载
let tray = null; // 托盘对象
let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 172,
    height: 200,
    frame: false,
    transparent: true,
    icon: path.join(__dirname, '/asset/img/icon_new.ico'),
    // 让html中的require可以使用
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
  //   win.setFullScreen(true)
  win.setResizable(false);

//   win.webContents.openDevTools(); // 打开开发者工具
};
// 启用热加载，传递主窗口对象和额外的选项
/* electronReload(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`),
  argv: [],
}); */
app.setAppUserModelId("赛博木鱼"); // 设置应用程序的ID
app.whenReady().then(() => {
  createWindow();
   const notification = new Notification({
    title: '操作提示',
    body: '左边白色框可以拖动哦~',
  })
  notification.show();
   // 监听通知的点击事件

  ipcMain.on("quit-app", () => {
    app.quit(); // 执行退出应用程序
  });
  ipcMain.on("minimize-to-tray", () => {
    win.hide(); // 执行最小化到托盘
  });
  ipcMain.on("top-app",()=>{
    const isOnTop = win.isAlwaysOnTop();
    win.setAlwaysOnTop(!isOnTop)
  })
   tray = new Tray(path.join(__dirname, '/asset/img/icon_new.ico'));
  // tray = new Tray(path.join(path.dirname(app.getPath("exe")), './asset/img/icon_new.ico'));
  
    // 创建一个上下文菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示应用",
      click: () => {
        win.show();
      },
    },

    {
      label: "退出应用",
      click: () => {
        app.quit();
      },
    },

  ]);
  // 设置托盘图标的上下文菜单
  tray.setContextMenu(contextMenu);
  tray.setToolTip("赛博木鱼");
   // 监听双击托盘事件
  tray.on('double-click', () => {
    win.show();
  });
});
