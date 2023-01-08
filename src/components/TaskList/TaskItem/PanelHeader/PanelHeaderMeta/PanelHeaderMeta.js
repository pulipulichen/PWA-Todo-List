import dayjs from 'dayjs'

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

var updateLocale = require('dayjs/plugin/updateLocale')
dayjs.extend(updateLocale)

import PanelHeadMetaFile from './PanelHeadMetaFile/PanelHeadMetaFile.vue'

let app = {
  props: ['db', 'task'],
  components: {
    PanelHeadMetaFile
  },
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;

      dayjs.updateLocale(this.$i18n.locale, {
        relativeTime: {
          future: this.$t("in %s"),
          past: this.$t("%s ago"),
          s: this.$t('a few seconds'),
          m: this.$t("a minute"),
          mm: this.$t("%d minutes"),
          h: this.$t("an hour"),
          hh: this.$t("%d hours"),
          d: this.$t("a day"),
          dd: this.$t("%d days"),
          M: this.$t("a month"),
          MM: this.$t("%d months"),
          y: this.$t("a year"),
          yy: this.$t("%d years")
        }
      })
    },
  },
  computed: {
    link () {
      let expression = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
      let matches
      if (this.task.title) {
        matches = this.task.title.match(expression)
        if (matches && matches.length > 0) {
          return matches[0]
        }
      }
        
      if (this.task.description) {
        matches = this.task.description.match(expression)
        if (matches && matches.length > 0) {
          return matches[0]
        }
      }
        
      return false
    },
    displayDueTime () {
      if (this.task.dueTime === false) {
        return false
      }

      // 計算跟現在距離的時間
      let currentTime = (new Date()).getTime()
      let interval = this.task.dueTime - currentTime

      this.isOverdue = (interval < 0)

      if (Math.abs(interval) > 86400000) {
        return dayjs(this.task.dueTime).format('M/D')
      }
      else {
        let fromNow = dayjs(this.task.dueTime).fromNow(true)
        if (this.isOverdue) {
          fromNow = this.$t('over ') + fromNow
        }
        return fromNow
      }
      // return dayjs(this.task.dueTime).format('M/D')
    },
  },
  mounted() {
  },
  methods: {
    setTask (field, value) {
      this.$parent.$parent.setTask(field, value)
    },
    focusPriorityPanel () {
      this.$parent.$parent.focusPriorityPanel()
    },
    focusDescription () {
      this.$parent.$parent.focusDescription()
    }
  }
}

export default app