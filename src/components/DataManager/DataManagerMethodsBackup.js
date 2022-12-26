// Convertor
// https://docs.google.com/spreadsheets/d/1Dt-nmoDnIny1MPqQ_4Za8CV0OpCBal4dnHxsBkbpEp4/edit?usp=sharing

import XLSX from 'xlsx'
import dayjs from 'dayjs'

export default function (app) {

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
    let tasks = this.db.localConfig[arrayJSONfield]
    this.appendArrayJSON(wb, arrayJSONfield, tasks)
    // export Excel file
    
    // ------------------

    let filename = this.db.config.appNameID + dayjs().format('MMDD-HHmm') + '.ods' 
    
    XLSX.writeFile(wb, filename, {type: 'file', bookType: 'ods', compression: true}) // name of the file is 'book.xlsx'
  }
}