import authorImageURL from './author.png'

let StyleConfig = {
  props: ['db'],
  data() {    
    this.$i18n.locale = this.db.config.locale
    return {
      authorImageURL
    }
  },
//  components: {
//  },
  // computed: {
  // },
  watch: {
    'db.localConfig.locale'() {
      this.$i18n.locale = this.db.localConfig.locale;
    },
  },
  // mounted() {
  // },
  // methods: {
  // } // methods
}

export default StyleConfig