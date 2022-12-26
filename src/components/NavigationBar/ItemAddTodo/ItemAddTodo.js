let app = {
  props: ['db'],
  components: {},
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
    canAddTodo () {
      return (this.db.config.addTodoText.trim() !== '')
    },
  },
  mounted() {
    
  },
  methods: {
    addTodo () {
      if (this.canAddTodo === false) {
        return false
      }

      let taskData = this.db.task.buildTaskData()
      this.db.localConfig.tasks.unshift(taskData)
      this.db.config.view = 'todo'
    },
    focusAddTodoInput () {
      if (!this.$refs.AddTodoInput) {
        return false
      }
      this.$refs.AddTodoInput.focus()
    }
  }
}

export default app