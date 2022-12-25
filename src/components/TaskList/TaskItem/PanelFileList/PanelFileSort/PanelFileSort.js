let app = {
  props: ['db', 'task'],
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
      sortAction: '',
      lastSortAction: null
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
    sortAction: async function () {
      if (this.sortAction === '') {
        return false
      }

      let baseDir = -1
      if (this.lastSortAction === this.sortAction) {
        baseDir = -1 * baseDir
      }

      //console.log(this.sortAction)
      let files = await this.getFiles()
      files.sort((a, b) => {
        if (a[this.sortAction] > b[this.sortAction]) {
          return baseDir
        }
        else if (a[this.sortAction] < b[this.sortAction]) {
          return -1 * baseDir
        }
        else {
          return 0
        }
      })
      // console.log(this.db.localConfig.tasks.map(t => t.title), (this.lastSortAction === this.sortAction), this.sortAction)

      
      if (this.lastSortAction === this.sortAction) {
        this.lastSortAction = null
      }
      else {
        this.lastSortAction = this.sortAction
      }
      this.sortAction = ''

      let filenames = files.map(f => f.name)
      this.task.files = this.task.files.slice(0,0).concat(filenames)
    }
  },
  // computed: {
    
  // },
  // mounted() {
    
  // },
  methods: {
    getFiles: async function () {
      let files = []

      for (let i = 0; i < this.task.files.length; i++) {
        let filename = this.task.files[i]
        let filePath = this.task.id + '/' + filename

        let metadata = await this.db.utils.FileSystemUtils.getFileMetadata(filePath)

        files.push({
          name: filename,
          size: metadata.sizeNumber,
          time: metadata.modificationTime
        })
      }

      return files
    }
  }
}

export default app