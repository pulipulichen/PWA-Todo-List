// Convertor
// https://docs.google.com/spreadsheets/d/1Dt-nmoDnIny1MPqQ_4Za8CV0OpCBal4dnHxsBkbpEp4/edit?usp=sharing

import XLSX from 'xlsx'
import dayjs from 'dayjs'

import JSZip from 'jszip'
import { saveAs } from 'file-saver';

export default function (app) {

  app.methods.testBackup20221227 = async function () {
    const zip = new JSZip();

    zip.file("Hello.txt", "Hello World\n");

    const img = zip.folder("images")
    img.file("smile.gif", await this.fetchData('./dist/asset/favicon.png'), {base64: true});

    let content = await zip.generateAsync({type:"blob"})
    saveAs(content, "example.zip")
  }

  app.methods.fetchData = async function (url) {
    let res = await fetch(url)
    return res.blob()
  } 

  app.methods.backup = async function () {
    // A workbook is the name given to an Excel file
    var wb = XLSX.utils.book_new() // make Workbook of Excel

    // ---------------------

    let configJSON = {}
    Object.keys(this.db.localConfig).forEach(key => {
      if (this.arrayJSONAttributes.indexOf(key) > -1) {
        return false
      }
      configJSON[key] = this.db.localConfig[key]
    })
    this.appendConfiguration(wb, configJSON)
    // ------------------

    let arrayJSONfield = 'tasks'
    let tasks = JSON.parse(JSON.stringify(this.db.localConfig[arrayJSONfield]))
    this.appendArrayJSON(wb, arrayJSONfield, tasks)

    // console.log(tasks)
    // console.log(this.db.localConfig[arrayJSONfield])
    // export Excel file
    
    // ------------------

    let filename = this.db.config.appNameID + '_' + dayjs().format('MMDD-HHmm') + '.ods' 
    
    if (this.backupHasFiles(tasks) === false) {
      XLSX.writeFile(wb, filename, {type: 'file', bookType: 'ods', compression: true}) // name of the file is 'book.xlsx'
    }
    else {
      const zip = new JSZip();

      // XLSX.writeFile(wb, filename, {type: 'file', bookType: 'ods', compression: true}) // name of the file is 'book.xlsx'
      let sheetBase64 = XLSX.write(wb, {type: 'base64', bookType: 'ods', compression: true}) // name of the file is 'book.xlsx'
      // zip.file("Hello.txt", "Hello World\n");
      zip.file(filename, sheetBase64, {base64: true});

      await this.backupFiles(zip, this.db.localConfig[arrayJSONfield])

      let content = await zip.generateAsync({type:"blob"})
      saveAs(content, "example.zip")
    }
      
  }

  app.methods.backupHasFiles = function (tasks) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].files.length > 0) {
        return true
      }
    }

    return false
  }

  app.methods.getTaskBackupFilePath = function (task) {
    let title = task.title.trim()

    if (title.length > 20) {
      title = title.slice(0, 20).trim()
    }

    return task.id + ' - ' + title
  }

  app.methods.backupFiles = async function (zip, tasks) {
    const rootFolder = zip.folder(this.db.config.appNameID) // 先建立資料夾

    for (let i = 0; i < tasks.length; i++) {
      let task = tasks[i]
      let files = task.files

      if (files.length === 0) {
        continue
      }

      // 建立資料夾
      let taskFolder = rootFolder.folder(this.getTaskBackupFilePath(task))
      
      for (let j = 0; j < files.length; j++) {
        let file = files[j]
        let filePath = task.id + '/' + file
        // let fileSystemURL = this.db.utils.FileSystemUtils.getFileSystemUrl(filePath)

        try {
          // console.log(fileSystemURL)
          // let base64 = await this.fetchData(fileSystemURL)
          let base64 = await this.db.utils.FileSystemUtils.readBase64(filePath)
          taskFolder.file(file, base64, {base64: true})
        }
        catch (e) {
          console.error(e)
        }
      }
    }
  }

  app.methods.backupCompleted = async function () {
    // A workbook is the name given to an Excel file
    var wb = XLSX.utils.book_new() // make Workbook of Excel

    // ---------------------

    let configJSON = {}
    Object.keys(this.db.localConfig).forEach(key => {
      if (this.arrayJSONAttributes.indexOf(key) > -1) {
        return false
      }
      configJSON[key] = this.db.localConfig[key]
    })
    this.appendConfiguration(wb, configJSON)
    // ------------------

    let arrayJSONfield = 'tasks'
    let tasks = this.db.localConfig[arrayJSONfield]
    tasks = tasks.filter(task => task.isCompleted)
    this.appendArrayJSON(wb, arrayJSONfield, tasks)
    // export Excel file
    
    // ------------------

    let filename = this.db.config.appNameID + '-completed-' + dayjs().format('MMDD-HHmm') + '.ods' 
    XLSX.writeFile(wb, filename, {type: 'file', bookType: 'ods', compression: true}) // name of the file is 'book.xlsx'

    // ------------------

    this.db.localConfig.tasks = this.db.localConfig.tasks.filter(task => !task.isCompleted)
  }
}