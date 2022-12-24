import Author from './Author/Author.vue'
import PanelBackup from './PanelBackup/PanelBackup.vue'

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
  components: {
    Author,
    PanelBackup
  },
  computed: {
    
  },
  mounted() {
    
  },
  methods: {
    
  }
}

export default app