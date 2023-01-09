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
    addTodo: async function () {
      if (this.canAddTodo === false) {
        return false
      }

      let taskData = this.db.task.buildTaskData()
      this.db.localConfig.tasks.unshift(taskData)
      this.db.config.view = 'todo'
      this.db.config.showConfiguration = false

      this.db.config.focusedTask = taskData

      await this.db.utils.AsyncUtils.sleep(100)
      this.$parent.$parent.focusFocusedTaskDescription()
    },
    focusAddTodoInput () {
      if (!this.$refs.AddTodoInput) {
        return false
      }
      this.$refs.AddTodoInput.focus()
    },
    focusAddTodo () {
      this.focusAddTodoInput()
    }
  }
}

export default app