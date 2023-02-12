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
      appendURLToTaskDescription: (task, url, types) => {
        this.appendURLToTaskDescription(task, url, types)
      },
      addTaskByURL: (url, types) => {
        this.addTaskByURL(url, types)
      },
      addTaskByDrop: (dropResult) => {
        this.addTaskByDrop(dropResult)
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
        task.files.sort((x, y) => { return x == urlFilename ? -1 : y == urlFilename ? 1 : 0; });
      }
    }
  }

  app.methods.addBase64FileToTask = async function (task, filename, base64) {
    let filePath = task.id + '/' + filename
    let url

    let blob = await (await fetch(base64)).blob()
    // console.log(base64)
    // console.log(blob)
    if (this.db.localConfig.duplicateFileReplace) {
      url = await this.db.utils.FileSystemUtils.writeFileReplace(filePath, blob)
    }
    else {
      url = await this.db.utils.FileSystemUtils.writeFile(filePath, blob)
    }
    let urlFilename = this.db.utils.FileSystemUtils.basename(url)

    if (task.files.indexOf(urlFilename) === -1) {
      task.files.unshift(urlFilename)
    }
    else {
      task.files.sort((x, y) => { return x == urlFilename ? -1 : y == urlFilename ? 1 : 0; });
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

  app.methods.addTaskByURL = async function (title, types) {
    // console.log(title)



    // 先檢查有沒有重複的任務
    for (let i = 0; i < this.db.localConfig.tasks.length; i++) {
      let task = this.db.localConfig.tasks[i]

      if (task.title.trim() === title ||
        task.description.trim() === title) {
        return false
      }
    }

    let task = this.buildTaskData()
    let description = ''

    if (this.db.utils.URLUtils.isURL(title)) {
      let imageType = false
      for (let i = 0; i < types.length; i++) {
        if (types[i].startsWith('image/')) {
          imageType = types[i]
          break
        }
      }

      if (imageType) {
        // title = websiteURL
        let base64 = await this.db.utils.URLUtils.getBase64(title, imageType)
        let filename = title.split('/').pop().split('#')[0].split('?')[0];

        await this.addBase64FileToTask(task, filename, base64)
        description = title
        title = filename
      }
      else {
        let websiteURL = await this.db.utils.URLUtils.getTitle(title)
        if (websiteURL) {
          description = title
          title = websiteURL
        }
      }

    }


    task.title = title
    task.description = description

    this.db.localConfig.tasks.unshift(task)
    // console.log(title, description)

    // console.log('@TODO cleanTask')
  }

  app.methods.addTaskByDrop = async function (dropResult) {
    
    if (this.db.config.focusedTask) {
      if (dropResult.files && dropResult.files.length > 0) {
        this.addFilesToTask(this.db.config.focusedTask, dropResult.files)
      }
      if (dropResult.title && dropResult.title.length > 0) {
        this.db.config.focusedTask.description = this.db.config.focusedTask.description + '\n' + dropResult.title
      }
      if (dropResult.description && dropResult.description.length > 0) {
        this.db.config.focusedTask.description = this.db.config.focusedTask.description + '\n' + dropResult.description
      }
    }
    else {
      let task = this.db.task.buildTaskData()
      if (dropResult.title) {
        task.title = dropResult.title
      }
      
      if (dropResult.description) {
        task.description = dropResult.description
      }
        
      if (dropResult.files && dropResult.files.length > 0) {
        this.db.task.addFilesToTask(task, dropResult.files)

        if (!dropResult.title || dropResult.title === '') {
          task.title = dropResult.files.map(f => f.name.trim()).join(', ')
        }
      }

      
      this.db.localConfig.tasks.unshift(task)
    }

  }

}
