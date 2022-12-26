// Convertor
// https://docs.google.com/spreadsheets/d/1Dt-nmoDnIny1MPqQ_4Za8CV0OpCBal4dnHxsBkbpEp4/edit?usp=sharing

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
    Object.keys(data.configuration).forEach(key => {
      this.db.localConfig[key] = data.configuration[key]
    })
    this.db.config.showConfiguration = false
  }
}