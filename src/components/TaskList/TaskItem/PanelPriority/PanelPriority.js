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
    focus() {
      let key = 'priority' + this.task.priority
      // console.log(key)
      this.$refs['priority' + this.task.priority].focus()
    } 
  }
}

export default app