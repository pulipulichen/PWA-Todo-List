
import PanelHeaderMeta from './PanelHeaderMeta/PanelHeaderMeta.vue'

let app = {
  props: ['db', 'task'],
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
    }
  },
  components: {
    PanelHeaderMeta
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
  },
  computed: {
    isFocused () {
      return (this.task === this.db.config.focusedTask)
    }
  },
  // mounted() {
    
  // },
  methods: {
    focusPrevTask () {
      return this.$parent.$parent.$parent.focusPrevTask(this.$parent)
    },
    focusNextTask () {
      // console.log(this.$parent.$parent.$parent)
      return this.$parent.$parent.$parent.focusNextTask(this.$parent)
    },
    focusInput () {
      return this.$refs.TitleInput.focus()
    }
  }
}

export default app