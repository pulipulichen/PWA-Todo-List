
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

      let configJSON = {
        title: this.db.localConfig.title,
        favicon: this.db.localConfig.favicon,
      }

      XLSX.utils.book_append_sheet(wb, this.buildAOAData(configJSON), 'configuration') // sheetAName is name of Worksheet

      // ------------------

      let arrayJSON = this.db.localConfig.tasks

      arrayJSON = arrayJSON.map(task => {
        for (let i = 0; i < this.timeFields.length; i++) {
          if (!task[this.timeFields[i]]) {
            continue
          }
          task[this.timeFields[i]] = new Date(task[this.timeFields[i]]).toUTCString()
        }
        return task
      })

      // export json to Worksheet of Excel
      // only array possible
      var data = XLSX.utils.json_to_sheet(arrayJSON) 

      // add Worksheet to Workbook
      // Workbook contains one or more worksheets
      XLSX.utils.book_append_sheet(wb, data, 'data') // sheetAName is name of Worksheet
      
      // export Excel file
      
      let filename = this.db.config.appNameID + dayjs().format('MMDD-HHmm') + '.ods' 
      
      XLSX.writeFile(wb, filename, {type: 'file', bookType: 'ods', compression: true}) // name of the file is 'book.xlsx'
    },
    buildAOAData (json) {
      let aoa = Object.keys(json).map(key => {
        return [key, json[key]]
      })

      // XLSX.utils.sheet_add_aoa(wb, configAOA, { origin: "configuration" });
      let data = XLSX.utils.aoa_to_sheet(aoa)     

      return data
    },
    restore () {
      window.alert(this.$t('TODO'))
    },
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
       
      let rawData
      // if (filename.endsWith('.csv')) {
      //   rawData = await this.loadFileCSV(file)
      // }
      if (filename.endsWith('.ods')) {
        rawData = await this.loadFileODS(file)
      }
      
      // await this.processRawData(rawData)
      this.db.localConfig.tasks = 
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
          o[k] = array[i][j]
        })

        output.push(o)
      }
      return output
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

        if (name === 'tasks') {
          xlData = this.arrayToJSON(xlData)
        }
        output[name] = xlData
      }
        
      return output
    }
    
  }
}

export default app