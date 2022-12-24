/* global Node */
//import $ from 'jquery'
import NavigationBar from './NavigationBar/NavigationBar.vue'
import TaskList from './TaskList/TaskList.vue'
import PanelFilter from './PanelFilter/PanelFilter.vue'

let Index = {
  props: ['db', 'view', 'search'],
  data() {
    this.$i18n.locale = this.db.config.localConfig
    return {
      viewList: ['todo', 'completed']
    }
  },
  components: {
    NavigationBar,
    TaskList,
    PanelFilter
  },
  computed: {
    isInIframe () {
      try {
        if (window.self !== window.top) {
          return false
        }
      } catch (e) {
        return true
      }
    }
  },
  watch: {
    'db.config.inited'(inited) {
      if (inited === false) {
        return false
      }
    },
    'view' (view) {
      this.db.config.view = view
    },
    'search' (search) {
      if (!search) {
        search = ''
      }
      this.db.config.search = search
    },
    'db.config.view' () {
      this.pushRouter()
    },
    'db.config.search' () {
      this.pushRouter()
    } 
  },
  mounted() {
    if (this.view) {
      this.db.config.view = this.view
    }
    if (this.search) {
      this.db.config.search = this.search
    }
  },
  methods: {
    pushRouter: async function () {
      await this.$router.replace(`/${this.db.config.view}/${this.db.config.search}`, () => {}, () => {})
    },
    buildTaskData () {
      let addTodoText = this.db.config.addTodoText
      this.db.config.addTodoText = ''

      let time = (new Date()).getTime()
      return {
        title: addTodoText,
        description: ``,
        location: ``,
        dueTime: false,
        priority: 0,
        isCompleted: false,
        isPinned: false,
        createTime: time,
        modifiedTime: time,
      }
    }
  }
}
// import IndexMethodsPostMessage from './IndexMethodsPostMessage.js'
// IndexMethodsPostMessage(Index)

//import IndexMethodsTest from './IndexMethodsTest.js'
//IndexMethodsTest(Index)

export default Index