import $ from 'jquery'

let app = {
  props: ['db'],
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
      isDragging: false,
      isDragFromWindow: false,
      stringTypes: [
        'text/uri-list',
        'text/html'
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
    this.initEvents()
  },
  methods: {
    initEvents () {
      // console.log('initEvents')
      window.addEventListener('dragstart', () => {
        // console.log('dragstart')
        this.isDragFromWindow = true
      })

      window.addEventListener('dragenter', () => {
        // console.log('dragenter')
        if (this.isDragFromWindow === false) {
          this.isDragging = true
        }
      })

      // window.addEventListener('mouseleave', () => {
      //   console.log('mouseleave')
      //   this.isDragging = false
      // })

      // window.addEventListener('dragleave', () => {
      //   console.log('dragleave')
      //   this.isDragging = false
      // })

      window.addEventListener('dragend', () => {
        // console.log('dragend')
        this.isDragFromWindow = false
      })
    },
    parseItems: async function (items) {
      let types = []

      for (let i = 0; i < items.length; i++) {
        types.push(items[i].type)
      }
      // console.log(types)

      let length = items.length
      let hasURI = (types.indexOf('text/uri-list') > -1)
      let hasHTML = (types.indexOf('text/html') > -1)
      let hasImage = (types.filter(type => type.startsWith('image/')).length > 0)

      // if (length === 1) {
      //   // 表示這是從檔案直接拉過來的
      // }
      let outputContents = []
      let outputFiles = []

      await (new Promise((resolve, reject) => {
        
        let checkEnd = () => {
          if (outputFiles.length + outputContents.length === length) {
            resolve(true)
          }
        }

        // let len = items.length
        let callbackContent = (str) => {
          // console.log(str)
          outputContents.push(str)
          checkEnd()
        }
        let callbackFile = (result) => {
          // console.log(result)
          outputFiles.push(result)
          checkEnd()
        }

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('text/')) {
            items[i].getAsString(callbackContent)
          }
          else {
            callbackFile(items[i].getAsFile())
          }
        }
      }))

      console.log({types,hasURI,hasHTML,outputContents,outputFiles,})

      if (!hasURI) {
        // 表示是本機傳來的結果
        return {
          files: outputFiles,
        }
      }
      else if (hasURI && !hasHTML) {
        // 表示是拉網址的結果
        let i = 0
        let url = outputContents[i]
        // https://script.google.com/macros/s/AKfycbz_ePQoQw651KqM8z-C1FOInhyM40Y5WrDsbxDjr0xBcLoT8HowCWkIA2RR_12v353c/exec?url=https://pixabay.com
        while (url && !this.db.utils.URLUtils.isURL(url)) {
          i++
          url = outputContents[i]
        }

        let title = url
        let description = ''

        let response = await this.db.utils.URLUtils.getTitle(url)

        if (response !== title) {
          description = title.trim()
          title = response.trim()
        }

        return {
          title,
          description
        }
      }
      else if (!hasURI && hasHTML && outputFiles.length === 0) {
        // 純拉一段文字
        let title = outputContents[0].trim()
        let description = ''
        let limit = 20
        if (title.length > limit) {
          description = title
          title = title.slice(0, limit).trim() + '...'
        }

        return {title, description}
      }
      else if (hasURI && hasHTML && outputFiles.length === 0) {
        // 拉了一段連結
        
        let html = outputContents.filter(c => c.startsWith('<') && c.endsWith('>'))[0]
        let element = $(html)
        let title = element.text().trim()
        
        
        // 表示是拉網址的結果
        let i = 0
        let url = outputContents[i]
        while (url && !this.db.utils.URLUtils.isURL(url)) {
          i++
          url = outputContents[i]
        }
        let description = url.trim()

        return {
          title,
          description
        }
      }
      else if (hasURI && hasHTML && outputFiles.length > 0) {
        let html = outputContents.filter(c => c.startsWith('<') && c.endsWith('>'))[0]
        let element = $(html)
        let title = element.attr('alt')
        if (!title || title.length === '') {
          title = element.attr('title')
        }
        if (!title || title.length === '') {
          title = element.attr('src')
          title = decodeURIComponent(title)
          title = this.db.utils.URLUtils.getFilenameFromURL(title)
        }
        

        let url = element.attr('src')
        url = decodeURIComponent(url)
        let type = types.filter(c => c.startsWith('image/'))[0]


        if (type) {
          let imageType = type.split('/')[1].trim()
          if (title.endsWith('.' + imageType) === false) {
            title = title + '.' + imageType
          }
        }

        // console.log(url, type)
        let base64 = await this.db.utils.URLUtils.getBase64(url, type)
        let blob = await (await fetch(base64)).blob()

        // let file = {
        //   name: title,
        //   base64
        // }
        blob.name = title

        return {
          files: [blob]
        }
      }
    },
    dropHandler: async function (ev) {
      // console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();

      // let files = []
      
      // // console.log(ev.dataTransfer.items[1])
      // // console.log(ev.dataTransfer.items[1].kind)
      // let types = []
      // for (let i = 0; i < ev.dataTransfer.items.length; i++) {
      //   types.push(ev.dataTransfer.items[i].type)
      //   // console.log(ev.dataTransfer.items[i].type)
      //   // ev.dataTransfer.items[i].getAsString(console.log)
      // }
      let result = await this.parseItems(ev.dataTransfer.items)
      console.log(result)
      // // console.log(types)
      // return false

      // console.log(types)
      
      // console.log(ev.dataTransfer.getData("URL"))
      // console.log(ev.dataTransfer.getData("text"))
      // console.log(ev.dataTransfer.getData("text/uri-list"))
      // console.log(ev.dataTransfer.getData("text/plain"))
      // console.log(ev.dataTransfer.getData("text/x-moz-url"))
      // console.log(ev.dataTransfer.getData("text/html"))
      
      

      // if (ev.dataTransfer.items[1] && 
      //     this.stringTypes.indexOf(ev.dataTransfer.items[1].type) > -1) {
          
      //   let url = ev.dataTransfer.getData("URL")
      //   if (url === '') {
      //     url = ev.dataTransfer.getData("text")
      //   }

      //   if (this.db.config.focusedTask) {
      //     this.db.task.appendURLToTaskDescription(this.db.config.focusedTask, url, types)
      //   }
      //   else {
      //     this.db.task.addTaskByURL(url, types)
      //   }
      // }
      // else if (ev.dataTransfer.items) {
        
      //   // Use DataTransferItemList interface to access the file(s)
      //   [...ev.dataTransfer.items].forEach((item, i) => {
      //     // If dropped items aren't files, reject them
      //     if (item.kind === 'file') {
      //       const file = item.getAsFile();
      //       // console.log(`… file[${i}].name = ${file.name}`);
      //       files.push(file)
      //     }
      //   });
      // } else {
      //   // Use DataTransfer interface to access the file(s)
      //   [...ev.dataTransfer.files].forEach((file, i) => {
      //     // console.log(`… file[${i}].name = ${file.name}`);
      //     files.push(file)
      //   });
      // }

      // if (files.length > 0) {
      //   if (this.db.config.focusedTask) {
      //     this.db.task.addFilesToTask(this.db.config.focusedTask, files)
      //   }
      //   else {
      //     this.db.task.addTaskByFiles(files)
      //   }
      // }
      this.db.task.addTaskByDrop(result)
        
      this.isDragging = false
      this.isDragFromWindow = false
    },
    dragOverHandler(ev) {
      // console.log('File(s) in drop zone');
    
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();
    },
    dragLeaveHandler (ev) {
      // console.log('dragLeaveHandler');
      this.isDragging = false
      ev.preventDefault();
    }
  }
}

export default app