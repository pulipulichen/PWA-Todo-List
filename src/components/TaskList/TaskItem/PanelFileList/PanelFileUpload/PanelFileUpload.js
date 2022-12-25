let app = {
  props: ['db', 'task'],
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
  
      let file = event.target.files[0]
      let filename = file.name
      
      // console.log({file, filename})
      let filePath = this.task.id + '/' + filename
      let url = await this.db.utils.FileSystemUtils.writeFile(filePath, file)
      // console.log(url, filePath)

      let urlFilename = this.db.utils.FileSystemUtils.basename(url)

      this.task.files.unshift(urlFilename)
    },
  }
}

export default app