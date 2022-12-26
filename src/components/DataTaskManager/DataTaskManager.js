let app = {
  props: ['db'],
  components: {},
  data () {    
    this.$i18n.locale = this.db.localConfig.locale
    return {
    }
  },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
  },
  computed: {},
  mounted() {
    this.initTaskUtils()
  },
  methods: {}
}

import DataTaskManagerMethods from './DataTaskManagerMethods.js';
DataTaskManagerMethods(app)

export default app