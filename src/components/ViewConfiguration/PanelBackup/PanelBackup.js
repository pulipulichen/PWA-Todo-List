
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
    backup () {
      this.db.data.backup()
    },
    
    // restore () {
    //   window.alert(this.$t('TODO'))
    // },
    openFile: async function (event) {
      this.db.data.restore(event)
    },
    
  }
}

export default app