
// import XLSX from 'xlsx'
// import dayjs from 'dayjs'

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
    reset () {
      if (!window.confirm(this.$t('Are you sure you want to reset?'))) {
        return false
      }
      this.db.data.reset()
    },
    backup () {
      this.db.data.backup()
    },
    
    // restore () {
    //   window.alert(this.$t('TODO'))
    // },
    restore: async function (event) {
      // if (!window.confirm(this.$t('Are you sure you want to restore?'))) {
      //   return false
      // }
      this.db.data.restore(event)
    },
    
  }
}

export default app