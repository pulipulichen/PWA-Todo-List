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
  computed: {
    canAddTodo () {
      return (this.db.config.addTodoText.trim() === '')
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
    }
  }
}

export default app