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
      },
      appendURLToTaskDescription:(task, url) => {
        this.appendURLToTaskDescription(task, url)
      },
      addTaskByURL: (url) => {
        this.addTaskByURL(url)
      }
    }
    // console.log(this.db.task)
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
      let url
      // console.log('dup', this.db.localConfig.duplicateFileReplace)
      if (this.db.localConfig.duplicateFileReplace) {
        url = await this.db.utils.FileSystemUtils.writeFileReplace(filePath, file)
      }
      else {
        url = await this.db.utils.FileSystemUtils.writeFile(filePath, file)
      }
      // console.log(url, filePath)

      let urlFilename = this.db.utils.FileSystemUtils.basename(url)

      taskData.files.unshift(urlFilename)
    }

    taskData.title = filenames.join(', ')

    this.db.localConfig.tasks.unshift(taskData)
    this.db.config.view = 'todo'
    this.db.config.showConfiguration = false
    this.db.config.focusedTask = taskData
  }

  app.methods.addFilesToTask = async function (task, files) {
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      let filename = file.name
      
      // console.log({file, filename})
      let filePath = task.id + '/' + filename
      // let url = await this.db.utils.FileSystemUtils.writeFile(filePath, file)
      let url
      if (this.db.localConfig.duplicateFileReplace) {
        url = await this.db.utils.FileSystemUtils.writeFileReplace(filePath, file)
      }
      else {
        url = await this.db.utils.FileSystemUtils.writeFile(filePath, file)
      }
      // console.log(url, filePath)

      let urlFilename = this.db.utils.FileSystemUtils.basename(url)

      if (task.files.indexOf(urlFilename) === -1) {
        task.files.unshift(urlFilename)
      }
      else {
        task.files.sort((x,y) => { return x == urlFilename ? -1 : y == urlFilename ? 1 : 0; });
      }
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

  app.methods.appendURLToTaskDescription = function (task, url) {
    if (task.description.trim().endsWith(url)) {
      return false
    }

    task.description = task.description + '\n' + url
  }

  app.methods.addTaskByURL = async function (title) {
    // console.log(title)

    // 先檢查有沒有重複的任務
    for (let i = 0; i < this.db.localConfig.tasks.length; i++) {
      let task = this.db.localConfig.tasks[i]

      if (task.title.trim() === title || 
        task.description.trim() === title) {
        return false
      }
    }

    let description = ''

    if (this.db.utils.URLUtils.isURL(title)) {
      let websiteURL = await this.db.utils.URLUtils.getTitle(title)
      if (websiteURL) {
        description = title
        title = websiteURL
      }
    }

    let task = this.buildTaskData()
    task.title = title
    task.description = description

    this.db.localConfig.tasks.unshift(task)
    // console.log(title, description)

    // console.log('@TODO cleanTask')
  }

}