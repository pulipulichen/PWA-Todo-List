import ItemFileUpload from './ItemFileUpload/ItemFileUpload.vue'
import ItemAddTodo from './ItemAddTodo/ItemAddTodo.vue'

let app = {
  props: ['db'],
  components: {
    ItemFileUpload,
    ItemAddTodo
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
    
  }
}

export default app