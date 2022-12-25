import ItemFileUpload from './ItemFileUpload/ItemFileUpload.vue'

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
  components: {
    ItemFileUpload
  },
  computed: {
    canAddTodo () {
      return (this.db.config.addTodoText.trim() !== '')
    },
    computedTitle () {
      let title = this.db.localConfig.title.trim()
      if (title === '') {
        return false
      }
      return title
    },
    computedFavicon () {
      let favicon = this.db.localConfig.favicon.trim()
      if (favicon === '') {
        return false
      }
      return favicon
    },
    hasTodoTasks () {
      return (this.db.localConfig.tasks.filter(t => !t.isCompleted).length > 0)
    },
    hasCompletedTasks () {
      return (this.db.localConfig.tasks.filter(t => t.isCompleted).length > 0)
    }
  },
  mounted() {
    
  },
  methods: {
    addTodo () {
      if (this.canAddTodo === false) {
        return false
      }

      let taskData = this.$parent.buildTaskData()
      this.db.localConfig.tasks.unshift(taskData)
      this.db.config.view = 'todo'
    }
  }
}

export default app