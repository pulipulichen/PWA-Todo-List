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
        'default'
      ]
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
  },
  // computed: {
    
  // },
  mounted() {
    this.testViewConfiguration()
  },
  methods: {
    testViewConfiguration () {
      setTimeout(() => {
        this.db.config.showConfiguration = true
      }, 1000)
    }
  }
}

export default app