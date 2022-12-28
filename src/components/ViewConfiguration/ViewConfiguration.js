import Author from './Author/Author.vue'
// import PanelBackup from './PanelBackup/PanelBackup.vue'

let app = {
  props: ['db'],
  components: {
    Author,
    PanelBackup: () => import(/* webpackChunkName: "components/PanelBackup" */ './PanelBackup/PanelBackup.vue')
  },
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
      themeList: [
        'default',
        "sticky",
        "white",
        "red",
        "orange",
        "yellow",
        "olive",
        "teal",
        "blue",
        "violet",
        "purple",
        "pink",
        "brown",
        //"black" // 黑色是給isCompleted使用
      ]
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
    'db.localConfig.backgroundImage' () {
      this.setBackgroundImage()
    }
  },
  // computed: {
    
  // },
  mounted() {
    // this.testViewConfiguration()
    this.setBackgroundImage()
    this.initTheme()
  },
  methods: {
    testViewConfiguration () {
      setTimeout(() => {
        this.db.config.showConfiguration = true
      }, 1000)
    },
    setBackgroundImage () {
      let url = this.db.localConfig.backgroundImage
      if (url === '') {
        document.body.style.backgroundImage = ``
      }
      else {
        document.body.style.backgroundImage = `url(${url})`
      } 
    },
    initTheme () {
      if (this.db.localConfig.tasks.length === 0 && 
          this.db.localConfig.theme === 'default') {
        let id = this.db.utils.URLUtils.getParameterID()
        if (!id) {
          return false
        }

        let idCode = this.db.utils.StringUtils.hashCode(id)
        console.log(idCode)
        let themeIndex = idCode % (this.themeList.length - 1)
        let theme = this.themeList[themeIndex+1]
        this.db.localConfig.theme = theme
      }
    }
  }
}

export default app