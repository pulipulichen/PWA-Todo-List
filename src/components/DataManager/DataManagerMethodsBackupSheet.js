//import MLR from "ml-regression-multivariate-linear"

import XLSX from 'xlsx'

export default function (app) {

  app.methods.appendConfiguration = function (wb, configJSON) {
    
    XLSX.utils.book_append_sheet(wb, this.buildAOAData(configJSON), 'configuration') // sheetAName is name of Worksheet
  }

  app.methods.buildAOAData = function (json) {
    let aoa = Object.keys(json).map(key => {
      return [key, json[key]]
    })

    // XLSX.utils.sheet_add_aoa(wb, configAOA, { origin: "configuration" });
    let data = XLSX.utils.aoa_to_sheet(aoa)     

    return data
  }


  app.methods.appendArrayJSON = function (wb, field, arrayJSON) {

    arrayJSON = arrayJSON.map(task => {
      for (let i = 0; i < this.timeFields.length; i++) {
        // if (!task[this.timeFields[i]]) {
        //   continue
        // }
        let value = task[this.timeFields[i]]
        // console.log(value, typeof(value))
        if (value !== false) {
          task[this.timeFields[i]] = new Date(value).toUTCString()
        }
        else {
          task[this.timeFields[i]] = ''
        }
      }

      let keys = Object.keys(task)
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let value = task[key]

        if (this.timeFields.indexOf(key) > -1) {
          if (value !== false) {
            task[key] = new Date(value).toUTCString()
          }
          else {
            task[key] = ''
          }
        }

        if (Array.isArray(value)) {
          task[key] = value.join(this.arrayValueSplitor)
        }
      }

      return task
    })

    // console.log(arrayJSON)

    // export json to Worksheet of Excel
    // only array possible
    var data = XLSX.utils.json_to_sheet(arrayJSON) 

    // add Worksheet to Workbook
    // Workbook contains one or more worksheets
    XLSX.utils.book_append_sheet(wb, data, field) // sheetAName is name of Worksheet
    
  }

}