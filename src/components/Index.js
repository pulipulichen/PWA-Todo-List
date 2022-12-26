/* global Node */
//import $ from 'jquery'
// import NavigationBar from './NavigationBar/NavigationBar.vue'
// import TaskList from './TaskList/TaskList.vue'
// import PanelFilter from './PanelFilter/PanelFilter.vue'
// import ViewConfiguration from './ViewConfiguration/ViewConfiguration.vue'
// import DropZone from './DropZone/DropZone.vue'

// import browserFileStorage from 'browser-file-storage'

let Index = {
  props: ['db', 'view', 'search'],
  components: {
    NavigationBar: () => import(/* webpackChunkName: "components/NavigationBar" */ './NavigationBar/NavigationBar.vue'),
    TaskList: () => import(/* webpackChunkName: "components/TaskList" */ './TaskList/TaskList.vue'),
    PanelFilter: () => import(/* webpackChunkName: "components/PanelFilter" */ './PanelFilter/PanelFilter.vue'),
    ViewConfiguration: () => import(/* webpackChunkName: "components/ViewConfiguration" */ './ViewConfiguration/ViewConfiguration.vue'),
    DropZone: () => import(/* webpackChunkName: "components/DropZone" */ './DropZone/DropZone.vue'),
    EmptyListMessage: () => import(/* webpackChunkName: "components/EmptyListMessage" */ './EmptyListMessage/EmptyListMessage.vue')
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
    this.initTaskUtils()
  },
  methods: {

    pushRouter: async function () {
      this.db.config.showConfiguration = false
      this.db.config.focusedTask = false
      await this.$router.replace(`/${this.db.config.view}/${this.db.config.search}`, () => {}, () => {})
    },

    initTaskUtils () {
      this.db.task = {
        buildTaskData: () => {
          return this.buildTaskData()
        },
        addTaskByFiles: (files) => {
          this.addTaskByFiles(files)
        },
        addFilesToTask: (task, files) => {
          this.addFilesToTask(task, files)
        }
      }
    },
    addTaskByFiles: async function (files) {
      if (files.length === 0) {
        return false
      }

      let taskData = this.buildTaskData()

      let filenames = []
      for (let i = 0; i < files.length; i++) {
        let file = files[i]
        let filename = file.name
        
        // ---------------------------------
        // 建立task
        
        filenames.push(filename)

        // ---------------------------------
        //上傳檔案

        // console.log({file, filename})
        let filePath = taskData.id + '/' + filename
        let url = await this.db.utils.FileSystemUtils.writeFile(filePath, file)
        // console.log(url, filePath)

        let urlFilename = this.db.utils.FileSystemUtils.basename(url)

        taskData.files.unshift(urlFilename)
      }

      taskData.title = filenames.join(', ')

      this.db.localConfig.tasks.unshift(taskData)
      this.db.config.view = 'todo'
      this.db.config.focusedTask = taskData
    },
    addFilesToTask: async function (task, files) {
      for (let i = 0; i < files.length; i++) {
        let file = files[i]
        let filename = file.name
        
        // console.log({file, filename})
        let filePath = task.id + '/' + filename
        let url = await this.db.utils.FileSystemUtils.writeFile(filePath, file)
        // console.log(url, filePath)

        let urlFilename = this.db.utils.FileSystemUtils.basename(url)

        task.files.unshift(urlFilename)
      }
    },
    buildTaskData () {
      let addTodoText = this.db.config.addTodoText
      this.db.config.addTodoText = ''

      let time = (new Date()).getTime()
      let task = {
        id: this.db.localConfig.taskCount,
        title: addTodoText,
        description: ``,
        location: ``,
        dueTime: false,
        priority: 0,
        isCompleted: false,
        isPinned: false,
        createTime: time,
        modifiedTime: time,
        files: []
      }

      this.db.localConfig.taskCount++

      return task
    },
    cleanTask (task) {
      console.log('@TODO cleanTask')
    },
    initFileSystem: async function () {
      await this.db.utils.FileSystemUtils.init(this.db.config.appNameID)
    }
  }
}
// import IndexMethodsPostMessage from './IndexMethodsPostMessage.js'
// IndexMethodsPostMessage(Index)

//import IndexMethodsTest from './IndexMethodsTest.js'
//IndexMethodsTest(Index)

export default Index