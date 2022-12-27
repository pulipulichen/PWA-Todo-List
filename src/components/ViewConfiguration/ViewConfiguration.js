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
        
    }
  }
}

export default app