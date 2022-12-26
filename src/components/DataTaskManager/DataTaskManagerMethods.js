export default function (app) {

  if (!app.methods) {
    app.methods = {}
  }

  app.methods.initTaskUtils = function () {
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
  }
  
  app.methods.addTaskByFiles = async function (files) {
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
  }

  app.methods.addFilesToTask = async function (task, files) {
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
  }
  app.methods.buildTaskData = function () {
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
  }

  app.methods.cleanTask = function (task) {
    console.log('@TODO cleanTask')
  }

}