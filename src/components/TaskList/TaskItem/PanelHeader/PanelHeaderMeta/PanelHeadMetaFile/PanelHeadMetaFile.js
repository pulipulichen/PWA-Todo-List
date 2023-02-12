let app = {
  props: ['db', 'task'],
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
      mime: null,
      mimeIcon: null
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
  },
  computed: {
    file () {
      return this.task.files[0]
    },
    filePath () {
      // console.log(this.task.files)
      return this.task.id + '/' + this.task.files[0]
    },
    fileSystemURL () {
      return this.db.utils.FileSystemUtils.getFileSystemUrl(this.filePath)
    },
    isImage () {
      return (this.mime && this.mime.startsWith('image/')) 
    },
    thumbnail () {
      if (this.isImage) {
        console.log(`url('${this.fileSystemURL}')`)
        return `url('${this.fileSystemURL}')`
      }
      else {
        return `url(${this.mimeIcon})`
      }
    }
  },
  mounted() {
    this.initMetadata()
  },
  methods: {
    initMetadata: async function () {
      let metadata = await this.db.utils.FileSystemUtils.getFileMetadata(this.filePath)
      this.mime = metadata.mime
      this.mimeIcon = './assets/mimetypes-icons-scalable/' + metadata.mimeIcon + '.svg'
    },
    popupPreview () {
      this.db.utils.FileSystemUtils.popupPreview(this.filePath)
    },
    clickThumbnail () {
      if (this.isImage) {
        this.popupPreview()
      }
      else {
        this.$refs.DownloadButton.click()
      }
    },
    focusFilelist () {
      this.$parent.$parent.$parent.focusFilelist()
    }
  }
}

export default app