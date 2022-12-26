// Convertor
// https://docs.google.com/spreadsheets/d/1Dt-nmoDnIny1MPqQ_4Za8CV0OpCBal4dnHxsBkbpEp4/edit?usp=sharing

export default function (app) {
  app.methods.loadURLODS = function (url) {

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
  }
}