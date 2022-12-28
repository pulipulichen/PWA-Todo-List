// Convertor
// https://docs.google.com/spreadsheets/d/1Dt-nmoDnIny1MPqQ_4Za8CV0OpCBal4dnHxsBkbpEp4/edit?usp=sharing

import JSZip from 'jszip'

export default function (app) {

  app.methods.restore = async function (event) {
    //console.log(1);
    if (!window.FileReader) {
      console.error(this.$t('Browser is not compatible'))
      return false // Browser is not compatible
    }

    //var reader = new FileReader();

    let file = event.target.files[0]

    let filename = file.name
      
    // this.config.loadingProgress = 0
     
    // let data
    // if (filename.endsWith('.csv')) {
    //   rawData = await this.loadFileCSV(file)
    // }
    if (filename.endsWith('.ods')) {
      await this.restoreFromODS(file)
    }
    else if (filename.endsWith('.zip')) {
      await this.restoreFromZIP(file)
    }
      
    this.db.config.showConfiguration = false
    event.target.value = ''
  }

  app.methods.restoreFromODS = async function (file) {
    let workbook = await this.loadFileODS(file)
    let data = await this.parsingWorkbookToJSON(workbook)
    // resolve(await this.processXLSXData(workbook))

    // console.log(data)
    if (!data) {
      return false
    }

    // await this.processRawData(rawData)
    // this.db.localConfig.tasks = 
    this.arrayJSONAttributes.forEach(field => {
      // console.log(field)
      this.db.localConfig[field] = this.db.localConfig[field].splice(0,0).concat(data[field])
      // console.log(this.db.localConfig[field])
    })
    Object.keys(data.configuration).forEach(key => {
      this.db.localConfig[key] = data.configuration[key]
    })
  }

  app.methods.restoreFromZIP = async function (file) {
    let zip = await JSZip.loadAsync(file)
    let files = Object.keys(zip.files)
    for (let i = 0; i < files.length; i++) {
      let filepath = files[i]

      // console.log(filename)
      let file = await zip.files[filepath].async('blob')
      if (filepath.endsWith('/')) {
        continue
      }
      else if (filepath.indexOf('/') === -1) {
        // 設定檔
        await this.restoreFromODS(file)
        // console.log(this.db.localConfig.tasks)
      }
      else {
        let filename = filepath.slice(filepath.lastIndexOf('/') + 1)
        // 分析並還原到原本的位置
        let fileSystemPath = filepath.slice(filepath.indexOf('/') + 1)
        fileSystemPath = fileSystemPath.split('/').map((part, i) => {
          if (i !== 1) {
            return part
          }
          
          return part.slice(0, part.indexOf(' - ')).trim()
        }).join('/')
        // console.log(filename)
        // console.log(filepath)
        // console.log(file)
        await this.db.utils.FileSystemUtils.writeFromFile(fileSystemPath, file, filename)
      }

    }
    // Object.keys(zip.files).forEach(function (filename) {
    //   zip.files[filename].async('string').then(function (fileData) {
    //     console.log(fileData) // These are your file contents      
    //   })
    // })
    
  }
}