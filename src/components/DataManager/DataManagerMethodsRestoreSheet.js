import XLSX from 'xlsx'

export default function (app) {

  app.methods.restoreTimeField = function (value) {
    if (value !== 0) {
      value = Date.parse(value)
    }
    else if (isNaN(value)) {
      value = false
    }
    return value
  }

  app.methods.restoreBooleanField = function (value) {
    if (isNaN(value)) {
      value = false
    }
    else if (value !== 0 && value !== 1) {
      return value
    }
    return (value === 1)
  }

  app.methods.restoreArrayField = function (value) {
    return value.split(this.arrayValueSplitor)
  }


  app.methods.loadFileODS = async function (file) {
    let reader = new FileReader();
    return new Promise((resolve) => {
      reader.readAsArrayBuffer(file);
      reader.onload = async (e) => {
        var data = new Uint8Array(reader.result);
        var workbook = XLSX.read(data, {type: "array"})
        // resolve(await this.processXLSXData(workbook))
        resolve(workbook)
      }
    })
  } 

  app.methods.parseConfigurationSheetToJSON = function (xlData) {
    let output = {}

    for (let i = 0; i < xlData.length; i++) {
      let row = xlData[i]
      output[row[0]] = row[1]
    }

    return output
  }
    

  app.methods.parsingWorkbookToJSON = async function (workbook) {
    
    var sheet_name_list = workbook.SheetNames;

    let output = {}

    for (let j = 0; j < sheet_name_list.length; j++) {
      //console.log(url)
      //console.log(sheet_name_list)
      let name = sheet_name_list[j]
      var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[name]);

      let headers
      
      for (let len = xlData.length, i = len; i > 0; i--) {
        let rowIndex = (len - i)
        let row = xlData[rowIndex]
        if (!headers) {
          headers = Object.keys(row)
        }
        xlData[rowIndex] = headers.map((header) => {
          return row[header]
        })
        
        if (i % 10 === 5) {
          await this.db.utils.AsyncUtils.sleep(0)
        }
      }
      
      xlData.unshift(headers)

      xlData = await this.db.utils.DataUtils.parseNumber(xlData)

      if (this.arrayJSONAttributes.indexOf(name) > -1) {
        xlData = await this.arrayToJSON(xlData)
      }
      else {
        xlData = this.parseConfigurationSheetToJSON(xlData)
      }
      output[name] = xlData
    }
      
    return output
  }

  app.methods.arrayToJSON = async function (array) {
    let key = array[0]
    let output = []
    for (let i = 1; i < array.length; i++) {
      let o = {}
      key.forEach((k, j) => {
        let value = array[i][j]
        
        if (this.timeFields.indexOf(k) > -1) {
          value = this.restoreTimeField(value)
        }
        if (this.booleanFields.indexOf(k) > -1) {
          value = this.restoreBooleanField(value)
        }
        if (this.arrayFields.indexOf(k) > -1) {
          value = this.restoreArrayField(value)
        }

        o[k] = value
      })

      output.push(o)
    }
    return output
  }

}