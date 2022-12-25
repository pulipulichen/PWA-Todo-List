let app = {
  props: ['db'],
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
      sortAction: '',
      lastSortAction: null
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
    sortAction () {
      if (this.sortAction === '') {
        return false
      }
      this.db.config.focusedTask = null

      let baseDir = -1
      if (this.lastSortAction === this.sortAction) {
        baseDir = -1 * baseDir
      }

      //console.log(this.sortAction)
      this.db.localConfig.tasks.sort((a, b) => {
        if (a[this.sortAction] > b[this.sortAction]) {
          return baseDir
        }
        else if (a[this.sortAction] < b[this.sortAction]) {
          return -1 * baseDir
        }
        else {
          return 0
        }
      })
      console.log(this.db.localConfig.tasks.map(t => t.title), (this.lastSortAction === this.sortAction), this.sortAction)

      
      if (this.lastSortAction === this.sortAction) {
        this.lastSortAction = null
      }
      else {
        this.lastSortAction = this.sortAction
      }
      this.sortAction = ''
    }
  },
  computed: {
    
  },
  mounted() {
    
  },
  methods: {
    removeAllCompletedTasks () {
      if (!window.confirm(this.$t('Are you sure you want to remove all completed tasks?'))) {
        return false
      }

      this.db.localConfig.tasks = this.db.localConfig.tasks.filter(task => {
        this.$parent.cleanTask(task)
        return task.isCompleted
      })
    }
  }
}

export default app