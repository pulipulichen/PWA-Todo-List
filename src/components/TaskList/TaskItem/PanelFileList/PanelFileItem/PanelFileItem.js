let app = {
  props: ['db', 'task', 'file'],
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
      modificationTime: null,
      size: null,
      mime: null,
      mimeIcon: null
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
    file () {
      this.initMetadata()
    }
  },
  computed: {
    filePath () {
      return this.task.id + '/' + this.file
    },
    fileSystemURL () {
      return this.db.utils.FileSystemUtils.getFileSystemUrl(this.filePath)
    },
    isImage () {
      return (this.mime && this.mime.startsWith('image/')) 
    },
    thumbnail () {
      if (this.isImage) {
        return `url('${this.fileSystemURL}')`
      }
      else {
        return `url(${this.mimeIcon})`
      }
    }
  },
  mounted: async function () {
    this.initMetadata()
  },
  methods: {
    initMetadata: async function () {
      let metadata = await this.db.utils.FileSystemUtils.getFileMetadata(this.filePath)
      this.modificationTime = this.db.utils.DateUtils.format(metadata.modificationTime)
      this.size = metadata.size
      this.mime = metadata.mime
      this.mimeIcon = './assets/mimetypes-icons-scalable/' + metadata.mimeIcon + '.svg'
    },
    remove: async function () {
      if (!window.confirm(this.$t(`Are you sure you want to remove "${this.file}"`))) {
        return false
      }
      // let path = this.$parent.getFileSystemLocalPath(this.file)
      await this.db.utils.FileSystemUtils.remove(this.filePath)
      
      let index = this.task.files.indexOf(this.file)
      this.task.files.splice(index, 1)
      // this.$parent.$parnets
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
    }
  }
}

export default app