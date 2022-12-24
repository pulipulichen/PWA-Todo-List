import dayjs from 'dayjs'

let app = {
  props: ['db', 'task'],
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
      isOverdue: false
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
  },
  computed: {
    date () {
      if (this.task.dueTime === false) {
        return undefined
      }

      let currentTime = (new Date()).getTime()
      let interval = this.task.dueTime - currentTime

      this.isOverdue = (interval < 0)
      // console.log(currentTime, this.task.dueTime, interval)

      // return (new Date(this.task.dueTime))
      // return new Date()
      // 2018-06-12T19:30"
      return dayjs.unix(this.task.dueTime / 1000).format('YYYY-MM-DDTHH:mm')
    },
  },
  mounted() {
    
  },
  methods: {
    setDueTime($event) {
      // console.log($event.target.value)
      let ms = new Date($event.target.value).getTime()
      // ms = ms + 8*60*60*1000
      // console.log(`${ms}
// ${new Date().getTime()}
// ${new Date().getTime() - ms}`)
      this.$parent.setTask('dueTime', ms)
    }
  }
}

export default app