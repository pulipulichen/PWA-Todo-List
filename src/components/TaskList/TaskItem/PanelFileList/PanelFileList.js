import PanelFileItem from './PanelFileItem/PanelFileItem.vue'
import PanelFileUpload from './PanelFileUpload/PanelFileUpload.vue'
import PanelFileSort from './PanelFileSort/PanelFileSort.vue'

let app = {
  props: ['db', 'task'],
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
    }
  },
  components: {
    PanelFileItem,
    PanelFileUpload,
    PanelFileSort
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
    'task.files' () {
      this.task.modifiedTime = (new Date()).getTime()
    }
  },
  computed: {
    dirPath () {
      return String(this.task.id)
    }
  },
  mounted() {
    
  },
  methods: {
    removeFiles: async function () {
      if (!window.confirm(this.$t('Are you sure you want to remove all files'))) {
        return false
      }

      // let list = await this.db.utils.FileSystemUtils.list(this.dirPath)
      // // console.log(list)
      // for (let i = 0; i < list.length; i++) {
      //   await this.db.utils.FileSystemUtils.remove()
      // }
      await this.db.utils.FileSystemUtils.remove(this.dirPath)
      this.task.files = this.task.files.slice(0,0)
    },
    
  }
}

export default app