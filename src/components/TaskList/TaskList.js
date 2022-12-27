import TaskItem from './TaskItem/TaskItem.vue'

// https://github.com/SortableJS/Vue.Draggable#typical-use
import draggable from 'vuedraggable'

let app = {
  props: ['db'],
  components: {
    TaskItem,
    draggable
  },
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
    filteredTaskList () {
      if (Array.isArray(this.db.localConfig.tasks) === false) {
        console.log('is not array')
        return []
      }

      // console.log(this.db.localConfig.tasks)

      let list = this.db.localConfig.tasks.filter((task) => {
        // console.log(task, )
        if (task.isCompleted !== (this.db.config.view === 'completed') ) {
          return false
        }

        if (this.db.config.search !== '' && 
          task.title.indexOf(this.db.config.search) === -1 && 
          task.description.indexOf(this.db.config.search) === -1 &&
          task.location.indexOf(this.db.config.search) === -1) {
            return false
        }

        return true
      })

      list.sort((a, b) => {
        if (a.isPinned && !b.isPinned) {
          return -1
        }
        if (!a.isPinned && b.isPinned) {
          return 1
        }
        return 0
      })

      this.db.config.focusedTask = list[0]

      return list
    },
    hasPinned () {
      let list = this.db.localConfig.tasks.filter(task => {
        return (task.isPinned && this.showTask(task))
      })
      return (list.length > 0)
    },
    hasNotPinned () {
      let list = this.db.localConfig.tasks.filter(task => {
        return (!task.isPinned && this.showTask(task))
      })
      return (list.length > 0)
    }
  },
  mounted() {
    // this.testFocusFirst ()
  },
  methods: {
    showTask (task) {
      let view = this.db.config.view
      // console.log(view, task.isCompleted)
      return ((view === 'todo' && !task.isCompleted) || (view === 'completed' && task.isCompleted))
    }
  }
}

export default app