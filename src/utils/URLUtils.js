// import $ from 'jquery'
import axios from 'axios'

export default {
  isURL: function (str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  },
  isEmail: function (email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  getParameterID () {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id')
  },
  getTitle: async function (url) {
    if (url.indexOf('//') > -1) {
      url = url.slice(url.indexOf('//') + 2)
    }
    url = "https://script.google.com/macros/s/AKfycbz_ePQoQw651KqM8z-C1FOInhyM40Y5WrDsbxDjr0xBcLoT8HowCWkIA2RR_12v353c/exec?url=" + url
    let result = await axios.get(url)
    return result.data.output
    // return new Promise(function (resolve, reject) {
    //   $.ajax({
    //     url,
    //     complete: function(data) {
    //       resolve(data.responseText);
    //     }
    //   });
    // })
  }
}