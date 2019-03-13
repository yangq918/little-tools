
//通信模块，mian process与renderer process（web page）
const {ipcMain} = require('electron')

ipcMain.on('allDataBases-m', (event, arg) => {
    console.log("mian1" + arg);
    arg.database = 'information_schema';
    const DB = require('./utils/DB');
    DB.init(arg);
    DB.allDataBases(function (results) {
       console.log(results);
        event.sender.send('allDataBases-r', results)
    });

});


ipcMain.on('mainDataBasesDetail-m', (event, arg) => {
    console.log("mian1" + arg);
    arg.database = 'information_schema';
    const DB = require('./utils/DB');
    DB.init(arg);
    DB.dataBasesDetail(arg,function (results) {
        event.sender.send('mainDataBasesDetail-r', results)
    });

});


ipcMain.on('secondDataBasesDetail-m', (event, arg) => {
    arg.database = 'information_schema';
    const DB = require('./utils/DB');
    DB.init(arg);
    DB.dataBasesDetail(arg,function (results) {
        event.sender.send('secondDataBasesDetail-r', results)
    });

});









