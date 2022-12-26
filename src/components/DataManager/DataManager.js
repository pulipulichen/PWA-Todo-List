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
  computed: {
    
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData () {
      this.db.data = {
        backup: () => {
          this.backup()
        },
        restore: (file) => {
          this.restore(file)
        }
      }

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