let localConfig = {
  taskCount: 0,
  title: '',
  favicon: '',
  backgroundImage: '',
  theme: 'default',
  tasks: [],
  duplicateFileReplace: true
}

// ----------------------------------------------------------------

let localConfigEnv = {
  locale: 'zh-TW'
}

for (let name in localConfigEnv) {
  localConfig[name] = localConfigEnv[name]
}

export default localConfig