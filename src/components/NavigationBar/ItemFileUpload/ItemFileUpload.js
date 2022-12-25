let app = {
  props: ['db'],
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
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
    openFile: async function (event) {
      //console.log(1);
      if (!window.FileReader) {
        console.error(this.$t('Browser is not compatible'))
        return false // Browser is not compatible
      }
  
      //var reader = new FileReader();
      let taskData = this.db.task.buildTaskData()
  
      if (event.target.files.length === 1) {

        let file = event.target.files[0]
        let filename = file.name
        
        // ---------------------------------
        // 建立task
        
        taskData.title = filename

        // ---------------------------------
        //上傳檔案

        // console.log({file, filename})
        let filePath = taskData.id + '/' + filename
        let url = await this.db.utils.FileSystemUtils.writeFile(filePath, file)
        // console.log(url, filePath)

        let urlFilename = this.db.utils.FileSystemUtils.basename(url)

        taskData.files.unshift(urlFilename)
      }
      else if (event.target.files.length > 1) {
        let filenames = []

        for (let i = 0; i < event.target.files.length; i++) {
          let file = event.target.files[i]
          let filename = file.name
          
          // ---------------------------------
          // 建立task
          
          filenames.push(filename)

          // ---------------------------------
          //上傳檔案

          // console.log({file, filename})
          let filePath = taskData.id + '/' + filename
          let url = await this.db.utils.FileSystemUtils.writeFile(filePath, file)
          // console.log(url, filePath)

          let urlFilename = this.db.utils.FileSystemUtils.basename(url)

          taskData.files.unshift(urlFilename)
        }

        taskData.title = filenames.join(', ')
      }
      
      this.db.localConfig.tasks.unshift(taskData)
      this.db.config.view = 'todo'
      this.db.config.focusedTask = taskData
    },
  }
}

export default app