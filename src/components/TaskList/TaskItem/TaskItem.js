import dayjs from 'dayjs'
// import relativeTime from 'dayjs/plugin/relativeTime';
// dayjs.extend(relativeTime)

// import updateLocale from 'dayjs/plugin/updateLocale';
// dayjs.extend(updateLocale)

import PanelPriority from './PanelPriority/PanelPriority.vue'
import PanelDueTime from './PanelDueTime/PanelDueTime.vue'

let app = {
  props: ['db', 'task'],
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
      isOverdue: false,
      isModified: false,
      isModifiedTimer: null
    }
  },
  components: {
    PanelPriority,
    PanelDueTime
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;

      // dayjs.updateLocale(this.$i18n.locale, {
      //   relativeTime: {
      //     future: this.$t("in %s"),
      //     past: this.$t("%s ago"),
      //     s: this.$t('a few seconds'),
      //     m: this.$t("a minute"),
      //     mm: this.$t("%d minutes"),
      //     h: this.$t("an hour"),
      //     hh: this.$t("%d hours"),
      //     d: this.$t("a day"),
      //     dd: this.$t("%d days"),
      //     M: this.$t("a month"),
      //     MM: this.$t("%d months"),
      //     y: this.$t("a year"),
      //     yy: this.$t("%d years")
      //   }
      // })
    },
    // 'task.title' () {
    //   this.updateTask()
    // },
    // 'task.description' () {
    //   this.updateTask()
    // },
    // 'task.location' () {
    //   this.updateTask()
    // },
    // 'task.dueTime' () {
    //   this.updateTask()
    // },
    // 'task.priority' () {
    //   this.updateTask()
    // },
    // 'task.isCompleted' () {
    //   this.updateTask()
    // },
    // 'task.isPinned' () {
    //   this.updateTask(true)
    // },
    'db.config.highlightTask': async function () {
      // await this.db.utils.AsyncUtils.sleep(100)
      if (this.db.config.highlightTask === this.task.modifiedTime) {
        console.log(this.db.config.highlightTask, this.task.modifiedTime)
        this.isModified = true
        clearTimeout(this.isModifiedTimer)
        this.isModifiedTimer = setTimeout(() => {
          this.isModified = false
        }, 3000)
      }
      else {
        this.isModified = false
      }
    }
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

      // if (interval > 86400000) {
      //   return dayjs(this.task.dueTime).format('M/D')
      // }
      // else {
      //   return dayjs(this.task.dueTime).fromNow(true)
      // }
      return dayjs(this.task.dueTime).format('M/D')
    },
    displayUpdatedTime () {
      return dayjs(this.task.dueTime).format('M/D HH:mm')
    },
    isShowDetail () {
      return (this.task === this.db.config.focusedTask)
      // return false
    }
  },
  // mounted() {
    
  // },
  methods: {
    updateTask (isPinnedChanged = false) {
      let time = (new Date()).getTime()
      this.task.modifiedTime = time
      if (isPinnedChanged) {
        // console.trace(this.task.title)
        // setTimeout(() => {
        this.db.config.highlightTask = time
        // }, 1000)
        
      }

      let index = this.db.localConfig.tasks.indexOf(this.task)
      if (isPinnedChanged === false || this.task.isPinned === true) {
        this.$set(this.db.localConfig.tasks, index, this.task)
      }
      else {
        // console.log(this.db.localConfig.tasks.map(i => i.title))
        this.db.localConfig.tasks.splice(index, 1)
        this.db.localConfig.tasks.unshift(this.task)
        // console.log(this.db.localConfig.tasks.map(i => i.title))
      }
      
    },
    deleteTask () {
      let title = this.task.title.trim()
      if (title.length > 20) {
        title = title.substring(0, 20) + '...'
      }
      if (!window.confirm(this.$t(`Are you sure to delete task "${title}" ?`))) {
        return false
      }

      let index = this.db.localConfig.tasks.indexOf(this.task)
      this.db.localConfig.tasks.splice(index, 1)
    },
    searchMap () {
      window.open(`https://www.google.com.tw/maps/search/${encodeURIComponent(this.task.location)}/`, '_blank')
    },
    setTask (field, value) {
      this.task[field] = value
      this.updateTask((field === 'isPinned'))
    }
  }
}

export default app