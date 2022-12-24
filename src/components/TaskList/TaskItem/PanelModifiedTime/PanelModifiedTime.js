import dayjs from 'dayjs'

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
    displayModifiedTime () {
      // return new Date(this.task.modifiedTime)
      let modifiedTimeString = dayjs.unix(this.task.modifiedTime / 1000).format('M/D HH:mm')
      let currentTimeString = dayjs().format('M/D ')
      if (modifiedTimeString.startsWith(currentTimeString)) {
        modifiedTimeString = modifiedTimeString.slice(currentTimeString.length).trim()
      }
      
      return modifiedTimeString
    },
  },
  mounted() {
    
  },
  methods: {
    
  }
}

export default app