let localConfig = {
  taskCount: 0,
  title: '',
  favicon: '',
  tasks: []
}

// ----------------------------------------------------------------

let localConfigEnv = {
  locale: 'zh-TW'
}

for (let name in localConfigEnv) {
  localConfig[name] = localConfigEnv[name]
}

export default localConfig