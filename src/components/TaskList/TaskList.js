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

			let basicMatch = ((view === 'todo' && !task.isCompleted) || (view === 'completed' && task.isCompleted))
			if (this.db.config.search !== '') {
				if (task.title.indexOf(this.db.config.search) === -1 && 
					task.description.indexOf(this.db.config.search) === -1 && 
					task.location.indexOf(this.db.config.search) === -1 && 
					task.files.join('').indexOf(this.db.config.search) === -1) {
					return false
				}
			}
      // console.log(view, task.isCompleted)
      return basicMatch
    },
    focusPrevTask (task) {
      let index = this.$refs.TaskItem.indexOf(task)
      if (index === 0) {
        return false
      }
      this.$refs.TaskItem[(index-1)].focusTitleInput()
      // console.log(this.$refs.TaskItem.length, this.$refs.TaskItem.indexOf(task))
    },
    focusNextTask (task) {
      let index = this.$refs.TaskItem.indexOf(task)
      if (index === this.$refs.TaskItem.length - 1) {
        return false
      }
      this.$refs.TaskItem[(index+1)].focusTitleInput()
      // console.log(this.$refs.TaskItem.length, this.$refs.TaskItem.indexOf(task))
    },
    focusFocusedTaskDescription () {
      let index = this.db.localConfig.tasks.indexOf(this.db.config.focusedTask)
      // console.log(index, this.db.localConfig.tasks, this.db.config.focusedTask)
      if (index > -1) {
        this.$refs.TaskItem[index].focusDescription()
      }
        
    }
  }
}

export default app