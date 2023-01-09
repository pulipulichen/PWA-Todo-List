/* global Node */

let Index = {
  props: ['db', 'view', 'search'],
  components: {
    NavigationBar: () => import(/* webpackChunkName: "components/NavigationBar" */ './NavigationBar/NavigationBar.vue'),
    TaskList: () => import(/* webpackChunkName: "components/TaskList" */ './TaskList/TaskList.vue'),
    PanelFilter: () => import(/* webpackChunkName: "components/PanelFilter" */ './PanelFilter/PanelFilter.vue'),
    ViewConfiguration: () => import(/* webpackChunkName: "components/ViewConfiguration" */ './ViewConfiguration/ViewConfiguration.vue'),
    DropZone: () => import(/* webpackChunkName: "components/DropZone" */ './DropZone/DropZone.vue'),
    ListPlaceholderMessage: () => import(/* webpackChunkName: "components/ListPlaceholderMessage" */ './ListPlaceholderMessage/ListPlaceholderMessage.vue'),
    DataTaskManager: () => import(/* webpackChunkName: "components/DataTaskManager" */ './DataTaskManager/DataTaskManager.vue'),
    DataManager: () => import(/* webpackChunkName: "components/DataManager" */ './DataManager/DataManager.vue')
  },
  data() {
    this.$i18n.locale = this.db.config.localConfig
    return {
      viewList: ['todo', 'completed']
    }
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
    },
    hasTodoTasks () {
      return (this.db.localConfig.tasks.filter(t => !t.isCompleted).length > 0)
    },
    hasCompletedTasks () {
      return (this.db.localConfig.tasks.filter(t => t.isCompleted).length > 0)
    },
    hasTasks () {
      if (this.db.config.view === 'todo') {
        return this.hasTodoTasks
      }
      else if (this.db.config.view === 'completed') {
        return this.hasCompletedTasks
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
    },
  },
  mounted() {
    if (this.view) {
      this.db.config.view = this.view
    }
    if (this.search) {
      this.db.config.search = this.search
    }

    this.initFileSystem()
    // this.initTaskUtils()
  },
  methods: {

    pushRouter: async function () {
      this.db.config.showConfiguration = false
      this.db.config.focusedTask = false
      await this.$router.replace(`/${this.db.config.view}/${this.db.config.search}`, () => {}, () => {})
    },

    
    initFileSystem: async function () {
      await this.db.utils.FileSystemUtils.init(this.db.config.appNameID)
    },

    focusAddTodo () {
      this.$refs.NavigationBar.focusAddTodo()
    },

    focusFocusedTaskDescription () {
      this.$refs.TaskList.focusFocusedTaskDescription()
    }
  }
}
// import IndexMethodsPostMessage from './IndexMethodsPostMessage.js'
// IndexMethodsPostMessage(Index)

//import IndexMethodsTest from './IndexMethodsTest.js'
//IndexMethodsTest(Index)

// import IndexMethodsTask from './IndexMethodsTask.js'
// IndexMethodsTask(Index)

export default Index