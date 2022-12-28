let app = {
  props: ['db'],
  components: {
    // DataTaskManager: () => import(/* webpackChunkName: "components/DataTaskManager" */ './DataTaskManager/DataTaskManager.vue')
  },
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
      timeFields: [
        'dueTime',
        'createTime',
        'modifiedTime'
      ],
      arrayJSONAttributes: [
        'tasks'
      ],
      booleanFields: [
        'dueTime',
        'isCompleted', 
        'isPinned'
      ],
      arrayFields: [
        'files'
      ],
      arrayValueSplitor: ';'
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
  },
  // computed: {
  // },
  mounted() {
    this.initData()

    // this.testBackup20221227()
  },
  methods: {
    initData () {
      this.db.data = {
        backup: () => {
          this.backup()
        },
        backupCompleted: () => {
          this.backupCompleted()
        },
        restore: (file) => {
          this.restore(file)
        },
        reset: () => {
          this.reset()
        }
      }
    },
    reset: async function () {
      // console.log('reset')
      this.arrayJSONAttributes.forEach(field => {
        this.db.localConfig[field] = this.db.localConfig[field].slice(0,0)
        // console.log(this.db.localConfig[field])
      })
      this.db.config.view = 'todo'
      this.db.config.showConfigurations = false

      await this.db.utils.FileSystemUtils.reset()
    }
  }
}

import DataManagerMethodsRemote from './DataManagerMethodsRemote.js'
DataManagerMethodsRemote(app)

import DataManagerMethodsBackup from './DataManagerMethodsBackup.js'
DataManagerMethodsBackup(app)

import DataManagerMethodsBackupSheet from './DataManagerMethodsBackupSheet.js'
DataManagerMethodsBackupSheet(app)

import DataManagerMethodsRestore from './DataManagerMethodsRestore.js'
DataManagerMethodsRestore(app)

import DataManagerMethodsRestoreSheet from './DataManagerMethodsRestoreSheet.js'
DataManagerMethodsRestoreSheet(app)

export default app