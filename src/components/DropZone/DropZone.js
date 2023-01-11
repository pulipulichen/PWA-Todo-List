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
    dropHandler (ev) {
      // console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();

      let files = []
      
      // console.log(ev.dataTransfer.items[1])
      // console.log(ev.dataTransfer.items[1].kind)
      let types = []
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        types.push(ev.dataTransfer.items[i].type)
        console.log(ev.dataTransfer.items[i].type)
        ev.dataTransfer.items[i].getAsString(console.log)
      }

      // console.log(types)
      
      // console.log(ev.dataTransfer.getData("URL"))
      // console.log(ev.dataTransfer.getData("text"))
      // console.log(ev.dataTransfer.getData("text/uri-list"))
      // console.log(ev.dataTransfer.getData("text/plain"))
      // console.log(ev.dataTransfer.getData("text/x-moz-url"))
      // console.log(ev.dataTransfer.getData("text/html"))
      
      

      if (ev.dataTransfer.items[1] && 
          this.stringTypes.indexOf(ev.dataTransfer.items[1].type) > -1) {
          
        let url = ev.dataTransfer.getData("URL")
        if (url === '') {
          url = ev.dataTransfer.getData("text")
        }

        if (this.db.config.focusedTask) {
          this.db.task.appendURLToTaskDescription(this.db.config.focusedTask, url, types)
        }
        else {
          this.db.task.addTaskByURL(url, types)
        }
      }
      else if (ev.dataTransfer.items) {
        
        // Use DataTransferItemList interface to access the file(s)
        [...ev.dataTransfer.items].forEach((item, i) => {
          // If dropped items aren't files, reject them
          if (item.kind === 'file') {
            const file = item.getAsFile();
            // console.log(`… file[${i}].name = ${file.name}`);
            files.push(file)
          }
        });
      } else {
        // Use DataTransfer interface to access the file(s)
        [...ev.dataTransfer.files].forEach((file, i) => {
          // console.log(`… file[${i}].name = ${file.name}`);
          files.push(file)
        });
      }

      if (files.length > 0) {
        if (this.db.config.focusedTask) {
          this.db.task.addFilesToTask(this.db.config.focusedTask, files)
        }
        else {
          this.db.task.addTaskByFiles(files)
        }
      }
        
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