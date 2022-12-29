
import PanelPriority from './PanelPriority/PanelPriority.vue'
import PanelDueTime from './PanelDueTime/PanelDueTime.vue'
import PanelModifiedTime from './PanelModifiedTime/PanelModifiedTime.vue'
import PanelHeader from './PanelHeader/PanelHeader.vue'
import PanelFileList from './PanelFileList/PanelFileList.vue'

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
    PanelDueTime,
    PanelModifiedTime,
    PanelHeader,
    PanelFileList
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;

      
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
        // console.log(this.db.config.highlightTask, this.task.modifiedTime)
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
    deleteTask: async function () {
      let title = this.task.title.trim()
      if (title.length > 20) {
        title = title.substring(0, 20) + '...'
      }
      if (!window.confirm(this.$t(`Are you sure to delete task "${title}" ?`))) {
        return false
      }

      let index = this.db.localConfig.tasks.indexOf(this.task)
      await this.db.utils.FileSystemUtils.remove(this.task.id)
      // this.$parent.$parent.cleanTask(this.task)
      
      this.db.localConfig.tasks.splice(index, 1)
    },
    searchMap () {
      window.open(`https://www.google.com.tw/maps/search/${encodeURIComponent(this.task.location)}/`, '_blank')
    },
    setTask: async function (field, value) {
      this.task[field] = value
      this.updateTask((field === 'isPinned'))

      if (field === 'isCompleted') {
        this.checkCompletedListIsEmpty()

        await this.db.utils.AsyncUtils.sleep(0)
        this.db.config.focusedTask = null
      }
    },
    focusPriorityPanel: async function () {
      // this.db.config.focusedTask = this.task
      // while (!this.$refs.PanelPriority) {
      //   await this.db.utils.AsyncUtils.sleep(100)
      // }
      // // await nextTick()
      // this.$refs.PanelPriority.focus()

      return this.focusRef('PanelPriority')
    },
    focusDescription: async function () {
      // this.db.config.focusedTask = this.task
      // while (!this.$refs.TextareaDescription) {
      //   await this.db.utils.AsyncUtils.sleep(100)
      // }
      // // await nextTick()
      // this.$refs.TextareaDescription.focus()

      return this.focusRef('TextareaDescription')
    },
    checkCompletedListIsEmpty () {
      let list = this.db.localConfig.tasks.filter(tasks => tasks.isCompleted)

      if (list.length === 0) {
        this.db.config.view = 'todo'
      }
    },
    focusRef: async function (ref) {
      this.db.config.focusedTask = this.task

      while (!this.$refs[ref]) {
        await this.db.utils.AsyncUtils.sleep(100)
      }
      // await nextTick()
      let ele = this.$refs[ref].$el
      if (!ele) {
        ele = this.$refs[ref]
      }
      // console.log(ref)
      ele.scrollIntoView({
        behavior: 'smooth'
      })
      ele.focus()
    },
    focusFilelist: async function () {
      return this.focusRef('PanelFileList')
    },
    focusTitleInput: async function () {
      let ref = 'PanelHeader'
      this.db.config.focusedTask = this.task

      while (!this.$refs[ref]) {
        await this.db.utils.AsyncUtils.sleep(100)
      }

      this.$refs[ref].focusInput()
    }
  }
}

export default app