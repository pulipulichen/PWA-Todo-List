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
  computed: {
    
  },
  mounted() {
    
  },
  methods: {
    openFile: async function (event) {
      //console.log(1);
      if (!window.FileReader) {
        console.error(this.$t('Browser is not compatible'))
        return false // Browser is not compatible
      }

      this.db.task.addTaskByFiles(event.target.files)
    },
  }
}

export default app