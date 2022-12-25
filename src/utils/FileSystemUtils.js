let CONFIG = {
  quotaInMB: 5
}

let triggerCallback = function (callback) {
  if (typeof(callback) === 'function') {
    callback()
  }
}

export default {
  type: window.PERSISTENT,
  //type: window.PERSISTENT,
  quota: CONFIG.quotaInMB * 1024 * 1024 /*5MB*/,
  fs: null,
  currentBaseUrl: null,
  // inited: false,
  init: function () {
    return new Promise((resolve, reject) => {
      try {
        // Note: The file system has been prefixed as of Google Chrome 12:
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                
        // window.webkitStorageInfo.queryUsageAndQuota()
        // window.StorageInfo.queryUsageAndQuota()

        let requestFS = (quota) => {
          window.requestFileSystem(this.type,
                quota,
                (fs) => {
                  this.fs = fs
                  // this.inited = true
                  resolve()
                },
                (e) => {
                  reject(e)
                });
        }

        if (this.type === window.TEMPORARY) {
          requestFS(this.quota)
        }
        else {
          navigator.webkitPersistentStorage.requestQuota(this.quota, (grantedBytes) => {
            requestFS(grantedBytes)
            //window.requestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
          }, function(e) {
            // console.log('Error', e);
            reject(e)
          });
        }

        // resolve()
      }
      catch (e) {
        reject(e)
      }
    })
  },
  // onInitFs: function (fs, callback) {
  //   this.fs = fs
  //   //this.statsticQuotaUsage()
  //   //console.log('FileSystem inited')
  //   /*
  //   console.log('Opened file system: ' + fs.name);

  //   this.write('log.txt', 'ok', () => {
  //     this.read('log.txt', (result) => {
  //       console.log(result)
  //     })
  //   })
  //   */
  //   triggerCallback(callback)
  // },
  errorHandler: function (e) {
    //console.log('Filesystem error')
    //console.trace(e)
    if (typeof(e.code) === 'undefined') {
      return
    }
    
    let message = `Error code: ${e.code}<br />
Name: ${e.name}<br />
Message: ${e.message}`
    window.alert(message)
    
    //let errorObject = new Error(e.message);
    //console.log(errorObject.stack);
    console.trace(`FileSystem error: ${e.message}`)
    /*
    var msg = '';
    console.log(['errorHandler', e.code])
    // https://developer.mozilla.org/zh-TW/docs/Web/API/FileError#Error_codes
    switch (e.code) {
      case 10: //case FileError.QUOTA_EXCEEDED_ERR:
      case 22: //case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        WindowHelper.alert('Quota Exceeded. Please delete data.')
        break;
      case 1: //case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case 2: //case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case 9: //case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case 7: //case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      case 13:
        msg = 'FILE_EXISTED'
        break;
      default:
        msg = 'Unknown Error ' + e.code;
        break;
    }
    ;

    //console.log('Error: ' + msg);
    throw 'Error: ' + msg
    */
  },
  createDir: function (rootDirEntry, folders) {
    if (rootDirEntry && !folders) {
      folders = rootDirEntry
      rootDirEntry = this.fs.root
    }

    if (typeof(folders) === 'string') {
      folders = folders.split('/')
    }
    
    return new Promise((resolve, reject) => {
      
      //let errorHandler = this.errorHandler
      let errorHandler = (e) => {
        //console.log(['createDir error'])
        //console.log(folders)
        //console.log(['createDir', e])
        //triggerCallback(callback)
        console.log(['createDir', folders])
        // this.errorHandler(e)
        reject(e)
      }
      
      // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
      while (folders[0] === '.' || 
             folders[0] === '') {
        if (folders.length > 1) {
          folders = folders.slice(1)
        }
        else {
          // return triggerCallback(callback)
          return resolve()
        }
      }
      
      //console.log(folders[0])
      rootDirEntry.getDirectory(folders[0], 
        {create: true}, 
        async (dirEntry) => {
        // Recursively add the new subfolder (if we still have another to create).
        if (folders.length) {
          await this.createDir(dirEntry, folders.slice(1))
          resolve()
        }
        else {
          // triggerCallback(callback)
          resolve()
        }
      }, errorHandler);
    })
      
  },
  removeDir: function (dirPath) {
    // if (InitHelper.ready === false) {
    if (!this.fs) {
      console.log('wait init ready')
      return
    }
    
    let fs = this.fs
    return new Promise((resolve, reject) => {
      fs.root.getDirectory(dirPath, {}, (dirEntry) => {

        dirEntry.removeRecursively(() => {
          //console.log('Directory removed.');
          // triggerCallback(callback)
          resolve()
        }, resolve);

      }, resolve);
    })
      
  },
  writeFromString: function (filePath, content, callback) {
    // if (InitHelper.ready === false) {
      if (!this.fs) {
      console.log('wait init ready')
      return
    }
    
    let fs = this.fs
    
    if (filePath.startsWith('/') === false) {
      filePath = '/' + filePath
    }
    
    //console.log()
    
    //let errorHandler = this.errorHandler
    let errorHandler = (e) => {
      let dirPath = filePath.slice(0, filePath.lastIndexOf('/') + 1).trim()
      //if (dirPath === '') {
      //  this.errorHandler(e)
      //  return
      //}
      
      //console.log(dirPath)
      this.isExists(dirPath, (dirExists) => {
        if (dirExists === false) {
          this.createDir(fs.root, dirPath.split('/'), () => {
            this.writeFromString(filePath, content, callback)
          }); // fs.root is a 
        }
        else {
          this.isExists(filePath, (fileExists) => {
            if (fileExists === true) {
              this.remove(filePath, () => {
                this.writeFromString(filePath, content, callback)
              })
            }
            else {
              this.errorHandler(e)
            }
          })
        }
      })
    }
    
    // we have to check dir is existed.
    //console.log(['write', filePath])
    fs.root.getFile(filePath, 
      {create: true, exclusive: true}, 
      (fileEntry) => {

      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter((fileWriter) => {

          fileWriter.onwriteend = (e) => {
            console.log('Write completed: ' + filePath);
            //console.log(content)
            triggerCallback(callback)
          };

          fileWriter.onerror = (e) => {
            //console.log('Write failed: ' + filePath + ': ' + e.toString());
            triggerCallback(callback)
          };

          // Create a new Blob and write it to log.txt.
          //var bb = new BlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
          //bb.append(content);
          //fileWriter.write(bb.getBlob('text/plain'));

          fileWriter.write(new Blob([content]));
          //fileWriter.write(new Blob([content], {type: 'text/html'}));

      }, errorHandler);

    }, errorHandler);
  },
  isPlainText: function (path) {
    return (path.endsWith('.txt') || 
      path.endsWith('.html') || 
      path.endsWith('.htm') || 
      path.endsWith('.xhtml') || 
      path.endsWith('.xml') || 
      path.endsWith('.json'))
  },
  extractSafeFilename: function (filename, safeMaxLength, maxLength) {
    //console.log(filename)
    let list = filename.trim().match(/[\w\-\.]+/g)
    if (list !== null) {
      list = list.map((m) => {return m})
    }
    else {
      list = []
    }
    let output = ''
    for (let i = 0; i < list.length; i++) {
      if (output !== '') {
        output = output + '_'
      }
      output = output + list[i].trim()
      if (typeof(safeMaxLength) === 'number' 
              && output.length > safeMaxLength) {
        break
      }
    }
    
    if (typeof(maxLength) === 'number' && output.length > maxLength) {
      output = output.slice(0, maxLength).trim()
    }
    
    return output
  },
  read: function (filePath, callback) {
    let fs = this.fs
    filePath = this.resolveFileSystemUrl(filePath)
    //console.log(['read', filePath])
    //let errorHandler = this.errorHandler
    let errorHandler = (e) => {
      if (e.code === 8) {
        // Error code: 8
        // Name: NotFoundError
        // Message: A requested file or directory could not be found at the time an operation was processed.
        
        //console.log('File not found: ' + filePath)
        triggerCallback(callback)
      }
      else {
        this.errorHandler(e)
      }
    }
    fs.root.getFile(filePath, {}, (fileEntry) => {

      // Get a File object representing the file,
      // then use FileReader to read its contents.
      fileEntry.file((file) => {
        let reader = new FileReader();

        reader.onloadend = function (e) {
          //var txtArea = document.createElement('textarea');
          //txtArea.value = this.result;
          //document.body.appendChild(txtArea);
          
          if (typeof(callback) === 'function') {
            callback(this.result)
          }
        };

        if (this.isPlainText(filePath)) {
          reader.readAsText(file)
        }
        else {
          reader.readAsDataURL(file)
        }
      }, errorHandler);

    }, errorHandler);

  },
  writeFromFile: function (dirPath, files, filename, callback) {
    // if (InitHelper.ready === false) {
      if (!this.fs) {
      console.log('wait init ready')
      return
    }
    
    if (typeof(filename) === 'function') {
      callback = filename
      filename = null
    }
    
    //console.log(typeof(files.name))
    if (typeof(files.name) === 'string') {
    //if (files.length > 1) {
      this.writeFromFile(dirPath, [files], filename, (list) => {
        if (typeof(callback) === 'function') {
          callback(list[0])
        }
      })
      return
    }
    
    let fs = this.fs
    let errorHandler = (e) => {
      this.errorHandler(e)
    }
    
    //console.log('go createDir')
    this.createDir(fs.root, dirPath, () => {
      let output = []
      let loop = (i) => {
        if (i < files.length) {
          let file = files[i]
          //console.log(file.name)
          let baseFilePath
          if (filename === null) {
            filename = file.name
          }
          
          //filename = this.filterSafeFilename(filename)
          filename = this.extractSafeFilename(filename)
          
          baseFilePath = dirPath + filename

          let pathPart1 = baseFilePath.slice(0, baseFilePath.lastIndexOf('.'))
          let pathPart2 = baseFilePath.slice(baseFilePath.lastIndexOf('.'))

          let dupCount = 0
          let writeFile = (filePath) => {
            //console.log(['go write file', filePath])
            fs.root.getFile(filePath, {create: true, exclusive: true}, function(fileEntry) {
              //console.log(filePath)
              fileEntry.createWriter(function(fileWriter) {
                //console.log(file.name)
                fileWriter.write(file); // Note: write() can take a File or Blob object.

                let url = fileEntry.toURL()
                output.push(url)

                i++
                loop(i)
              }, errorHandler);
            }, (e) => {
              if (e.code === 13) {
                // code: 13
                // message: "An attempt was made to create a file or directory where an element already exists."
                // name: "InvalidModificationError"
                dupCount++
                filePath = pathPart1 + '_' + dupCount + pathPart2
                writeFile(filePath)
              }
              else {
                //console.log(['error2', e])
                this.errorHandler(e)
              }
            });
          }
          writeFile(baseFilePath)

        }
        else {
          if (typeof(callback) === 'function') {
            callback(output)
          }
        }
      }
      loop(0)
    })  // this.createDir(fs.root, dirPath, () => {
      
  },
  remove: function (path, callback) {
    // if (InitHelper.ready === false) {
      if (!this.fs) {
      console.log('wait init ready')
      return
    }
    
    let fs = this.fs
    //let errorHandler = this.errorHandler
    let errorHandler = (e) => {
      //let link = this.getFileSystemUrl(path)
      //e.message = e.message + `<a href="${link}" target="_blank">${path}</a>`
      //console.trace(JSON.stringify(e))
      this.errorHandler(e.message)
      triggerCallback(callback)
    }
    
    fs.root.getFile(path, {create: false}, function(fileEntry) {

      fileEntry.remove(function() {
        //console.log('File removed: ' + path);
        triggerCallback(callback)
      }, errorHandler)

    }, errorHandler)
  },
  getFileName: function (url) {
    if (url.lastIndexOf('/') > -1) {
      url = url.slice(url.lastIndexOf('/') + 1)
    }
    //url = this.filterSafeFilename(url)
    url = this.extractSafeFilename(url)
    return url
  },
  isExists: function (filePath, callback) {
    if (filePath === '/') {
      return triggerCallback(callback, true)
    }
    
    let fs = this.fs
    let errorHandler = (e) => {
      
      fs.root.getDirectory(filePath, 
        {create: false}, 
        (dirEntry) => {
          triggerCallback(callback, true)
      }, () => {
        triggerCallback(callback, false)
      });
    }
    
    fs.root.getFile(filePath, {}, function (fileEntry) {

      // Get a File object representing the file,
      // then use FileReader to read its contents.
      fileEntry.file(function (file) {
        triggerCallback(callback, true)
      }, errorHandler);

    }, errorHandler);
  },
  getFileSystemUrl: function (path) {
    let fsType = 'temporary'
    if (this.type !== window.TEMPORARY) {
      fsType = 'persistent'
    }
    
    if (path.startsWith('/') === false) {
      path = '/' + path
    }
    
    return 'filesystem:' + location.protocol + '//' + location.host + '/' + fsType + path
  },
  resolveFileSystemUrl: function (path) {
    if (path.startsWith('filesystem:')) {
      let parts = path.split('/')
      path = '/' + parts.slice(4).join('/')
    }
    path = decodeURIComponent(path)
    return path
  },
  readEventFilesText: function (files, callback) {
    //console.log(typeof(files.name))
    let isArray = true
    if (typeof(files.name) === 'string') {
    //if (files.length > 1) {
      files = [files]
      isArray = false
    }
    
    let output = []
    let i = 0
    
    let reader = new FileReader();
    reader.onload = function (event) {
      let result = event.target.result
      output.push(result)
      i++
      loop(i)
    };
    
    let loop = (i) => {
      if (i < files.length) {
        let file = files[i]
        //console.log(file);
        //reader.readAsDataURL(file);
        reader.readAsText(file)
      }
      else {
        if (isArray === false) {
          output = output[0]
        }
        triggerCallback(callback, output)
      }
    }
    loop(i)
  },
  stripAssetFileSystemPrefix: function (url) {
    if (url === null
            || typeof(url) !== 'string'
            || !url.startsWith('filesystem:')
            || url.lastIndexOf('/assets/') === -1) {
      return url
    }
    
    return url.slice(url.lastIndexOf('/assets/') + 1)
    
  },
  appendAssetFileSystemPrefix: function (url, postId) {
    if (typeof(url) !== 'string') {
      return ''
    }
    
    if (this.currentBaseUrl === null) {
      let currentBaseUrl = location.href
      this.currentBaseUrl = currentBaseUrl.slice(0, currentBaseUrl.lastIndexOf('/') + 1)
    }
      
    //console.log(['filterImageListToFileSystem url 1:', url])
    if (url.startsWith(this.currentBaseUrl) === false 
            && (
            url.startsWith('//')
            || url.startsWith('http://')
            || url.startsWith('https://'))) {
      return url
    }
    // filesystem:http://localhost:8383/temporary/2/assets/2019-0406-062107.png
    url = url.slice(url.lastIndexOf('/assets/') + 1)
    url = `/${postId}/${url}`
    //console.log(['filterImageListToFileSystem url 2:', this.getFileSystemUrl(url)])
    return this.getFileSystemUrl(url)
  },
  statsticQuotaUsage: function (callback) {
    let storage = navigator.webkitTemporaryStorage
    if (this.type === window.PERSISTENT) {
      storage = navigator.webkitPersistentStorage
    }
    
    storage.queryUsageAndQuota((quoteUsed, quotaTotal) => {
      triggerCallback(callback, quoteUsed, quotaTotal)
    })
  },
  list: function (path, callback) {
    let fs = this.fs
    let errorHandler = (e) => {
      if (e.code === 8) {
        // Error code: 8
        // Name: NotFoundError
        // Message: A requested file or directory could not be found at the time an operation was processed.
        console.log('list not found: ' + path)
        triggerCallback(callback)
      }
      else {
        this.errorHandler(e)
      }
    }
    let fileList = []
    /*
    var dirReader = fs.root.createReader();
    var entries = [];

    // Call the reader.readEntries() until no more results are returned.
    var readEntries = function() {
       dirReader.readEntries (function(results) {
        if (!results.length) {
          listResults(entries.sort());
        } else {
          entries = entries.concat(toArray(results));
          readEntries();
        }
      }, errorHandler);
    };

    readEntries(); // Start reading dirs.
    */
    fs.root.getDirectory(path, {}, function(dirEntry){
      var dirReader = dirEntry.createReader();
      dirReader.readEntries(function(entries) {
        for(var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (entry.isFile){
            //console.log('File: ' + entry.fullPath);
            fileList.push(entry.fullPath)
          }
        }
        triggerCallback(callback, fileList)
      }, errorHandler);
    }, errorHandler);
  },
  /*
  filterSafeFilename: function (filename) {
    if (filename.indexOf('+') > -1) {
      filename = filename.split('+').join('_')
    }
    return filename
  }
  */
  /*
  copy: function (oldPath, newPath, callback) {
    console.log(oldPath)
    return this.read(oldPath, (fileContent) => {
      console.log(newPath)
      this.writeFromString(newPath, fileContent, callback)
    })
  },
  move: function (oldPath, newPath, callback) {
    return this.copy(oldPath, newPath, () => {
      this.remove(oldPath, callback)
    })
  }
  */
  copy: function (oldPath, newPath, callback) {
    let fs = this.fs
    oldPath = this.resolveFileSystemUrl(oldPath)
    newPath = this.resolveFileSystemUrl(newPath)
    let newPathDir = newPath.slice(0, newPath.lastIndexOf('/'))
    let newName = newPath.slice(newPath.lastIndexOf('/') + 1)
    //console.log(['read', filePath])
    //let errorHandler = this.errorHandler
    let errorHandler = (e) => {
      if (e.code === 8) {
        // Error code: 8
        // Name: NotFoundError
        // Message: A requested file or directory could not be found at the time an operation was processed.
        
        //console.log('File not found: ' + filePath)
        triggerCallback(callback)
      }
      else {
        this.errorHandler(e)
      }
    }
    fs.root.getFile(oldPath, {}, (fileEntry) => {
      // Get a File object representing the file,
      // then use FileReader to read its contents.
      fs.root.getDirectory(newPathDir, {create: true}, (dirEntry) => {
        fileEntry.copyTo(dirEntry, newName, callback, errorHandler)
      })

    }, errorHandler);
  },
  
  move: function (oldPath, newPath, callback) {
    let fs = this.fs
    oldPath = this.resolveFileSystemUrl(oldPath)
    newPath = this.resolveFileSystemUrl(newPath)
    let newPathDir = newPath.slice(0, newPath.lastIndexOf('/'))
    let newName = newPath.slice(newPath.lastIndexOf('/') + 1)
    //console.log(['read', filePath])
    //let errorHandler = this.errorHandler
    let errorHandler = (e) => {
      if (e.code === 8) {
        // Error code: 8
        // Name: NotFoundError
        // Message: A requested file or directory could not be found at the time an operation was processed.
        
        //console.log('File not found: ' + filePath)
        triggerCallback(callback)
      }
      else {
        this.errorHandler(e)
      }
    }
    fs.root.getFile(oldPath, {}, (fileEntry) => {
      // Get a File object representing the file,
      // then use FileReader to read its contents.
      fs.root.getDirectory(newPathDir, {create: true}, (dirEntry) => {
        fileEntry.moveTo(dirEntry, newName, callback, errorHandler)
      })

    }, errorHandler);
  }
}

//FileSystemHelper.init()