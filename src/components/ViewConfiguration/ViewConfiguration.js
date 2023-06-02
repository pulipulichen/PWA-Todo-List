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
      ],
      backgroundList: [
        "./assets/background/pexels-artem-saranin-1547813.jpg",
        "./assets/background/pexels-eberhard-grossgasteiger-2310713.jpg",
        "./assets/background/pexels-eusebiu-soica-13840288.jpg",
        "./assets/background/pexels-levent-simsek-4651076.jpg",
        "./assets/background/pexels-muhammad-khairul-iddin-adnan-808510.jpg",
        "./assets/background/pexels-natalia-hutak-4072639.jpg",
        "./assets/background/pexels-pixabay-301673.jpg",
        "./assets/background/pexels-pradipna-lodh-711004.jpg",
        "./assets/background/pexels-skylar-kang-6044224.jpg"
      ],
      selectedPresetBackground: ``
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
    'db.localConfig.backgroundImage' () {
      this.setBackgroundImage()
    },
    'selectedPresetBackground' (selectedPresetBackground) {
      if (this.selectedPresetBackground === '') {
        return false
      }
      this.db.localConfig.backgroundImage = selectedPresetBackground
      this.selectedPresetBackground = ``
    }
  },
  computed: {
    backgroundListRows () {
      let rows = []

      let wide = 5

      let list = JSON.parse(JSON.stringify(this.backgroundList))
      let firstRow = list.slice(0, wide - 1)
      rows.push(firstRow)
      list = list.slice(wide - 1)

      while (list.length > 0) {
         let row = list.slice(0, wide)
         rows.push(row)
         list = list.slice(wide)
      }

      return rows
    }
  },
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
        // console.log(idCode)
        let themeIndex = idCode % (this.themeList.length - 1)
        let theme = this.themeList[themeIndex+1]
        this.db.localConfig.theme = theme
      }
    }
  }
}

export default app