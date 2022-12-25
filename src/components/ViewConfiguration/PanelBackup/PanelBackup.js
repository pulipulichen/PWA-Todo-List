
import XLSX from 'xlsx'
import dayjs from 'dayjs'

let app = {
  props: ['db'],
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
      timeFields: [
        'dueTime',
        'createTime',
        'modifiedTime'
      ],
      arrayJSONAttributes: [
        'tasks'
      ],
      booleanFields: [
        'dueTime',
        'isCompleted', 
        'isPinned'
      ]
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
  },
  computed: {
    
  },
  mounted() {
    
  },
  methods: {
    backup () {
      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new() // make Workbook of Excel

      // ---------------------

      this.appendConfiguration(wb)
      // ------------------

      this.appendArrayJSON(wb, 'tasks')
      // export Excel file
      
      // ------------------

      let filename = this.db.config.appNameID + dayjs().format('MMDD-HHmm') + '.ods' 
      
      XLSX.writeFile(wb, filename, {type: 'file', bookType: 'ods', compression: true}) // name of the file is 'book.xlsx'
    },
    appendConfiguration (wb) {
      
      let configJSON = {}

      Object.keys(this.db.localConfig).forEach(key => {
        if (this.arrayJSONAttributes.indexOf(key) > -1) {
          return false
        }
        configJSON[key] = this.db.localConfig[key]
      })

      XLSX.utils.book_append_sheet(wb, this.buildAOAData(configJSON), 'configuration') // sheetAName is name of Worksheet
    },
    appendArrayJSON (wb, field) {
      let arrayJSON = this.db.localConfig[field]

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
            task[key] = value.join('\n')
          }
        }

        return task
      })

      // export json to Worksheet of Excel
      // only array possible
      var data = XLSX.utils.json_to_sheet(arrayJSON) 

      // add Worksheet to Workbook
      // Workbook contains one or more worksheets
      XLSX.utils.book_append_sheet(wb, data, field) // sheetAName is name of Worksheet
      
    },
    buildAOAData (json) {
      let aoa = Object.keys(json).map(key => {
        return [key, json[key]]
      })

      // XLSX.utils.sheet_add_aoa(wb, configAOA, { origin: "configuration" });
      let data = XLSX.utils.aoa_to_sheet(aoa)     

      return data
    },
    // restore () {
    //   window.alert(this.$t('TODO'))
    // },
    openFile: async function (event) {
      //console.log(1);
      if (!window.FileReader) {
        console.error(this.$t('Browser is not compatible'))
        return false // Browser is not compatible
      }
  
      //var reader = new FileReader();
  
      let file = event.target.files[0]
      let filename = file.name
      
      // this.config.loadingProgress = 0
       
      let data
      // if (filename.endsWith('.csv')) {
      //   rawData = await this.loadFileCSV(file)
      // }
      if (filename.endsWith('.ods')) {
        data = await this.loadFileODS(file)
      }
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
      Object.keys(data['configuration']).forEach(key => {
        this.db.localConfig[key] = data['configuration'][key]
      })
      this.db.config.showConfiguration = false
    },
    loadURLODS: function (url) {

      return new Promise((resolve) => {
        /* set up async GET request */
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "arraybuffer";

        req.onload = async (e) => {
          var data = new Uint8Array(req.response);
          var workbook = XLSX.read(data, {type:"array"});

          resolve(await this.processXLSXData(workbook))
        }

        req.send();
      })
    },
    
    loadFileODS: async function (file) {
      let reader = new FileReader();
      return new Promise((resolve) => {
        reader.readAsArrayBuffer(file);
        reader.onload = async (e) => {
          var data = new Uint8Array(reader.result);
          var workbook = XLSX.read(data, {type: "array"})
          resolve(await this.processXLSXData(workbook))
        }
      })
    },
    arrayToJSON: async function (array) {
      let key = array[0]
      let output = []
      for (let i = 1; i < array.length; i++) {
        let o = {}
        key.forEach((k, j) => {
          let value = array[i][j]
          if (this.timeFields.indexOf(k) > -1) {
            if (value !== 0) {
              value = Date.parse(value)
            }
            else if (isNaN(value)) {
              value = false
            }
          }
          if (this.booleanFields.indexOf(k) > -1) {
            console.log(k, value, typeof(value))
            value = this.parseBoolean(value)
            console.log(k, value, typeof(value))
          }
          o[k] = value
        })

        output.push(o)
      }
      return output
    },
    parseBoolean (value) {
      if (isNaN(value)) {
        value = false
      }
      else if (value !== 0 && value !== 1) {
        return value
      }
      return (value === 1)
    },
    processXLSXData: async function (workbook) {
      
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
          xlData[rowIndex] = headers.map(header => {
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
          xlData = this.parseConfigurationJSON(xlData)
        }
        output[name] = xlData
      }
        
      return output
    },
    parseConfigurationJSON (xlData) {
      let output = {}

      for (let i = 0; i < xlData.length; i++) {
        let row = xlData[i]
        output[row[0]] = row[1]
      }

      return output
    }
    
  }
}

export default app