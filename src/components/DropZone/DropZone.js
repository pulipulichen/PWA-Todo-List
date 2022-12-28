let app = {
  props: ['db'],
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
      isDragging: false,
      isDragFromWindow: false
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
      if (ev.dataTransfer.items) {
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

      if (this.db.config.focusedTask) {
        this.db.task.addFilesToTask(this.db.config.focusedTask, files)
      }
      else {
        this.db.task.addTaskByFiles(files)
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