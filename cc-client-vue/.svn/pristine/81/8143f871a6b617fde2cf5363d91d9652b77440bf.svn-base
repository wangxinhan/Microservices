<template>
  <div class="i18n">
   <select  @change="changeLang" v-model.trim="selected">
     <option  v-for="option in options" v-bind:value="option.value">
       {{ option.text }}
     </option>
   </select>
  </div>
</template>
<script>
  //    import Workbench from './components/workbench/workbench.vue'
  import Vue from 'vue'
  (function defaultLang () {
    let lang = window.localStorage.lang
    if (!lang) {
      window.localStorage.lang = 'zh_CN'
    } else {
      if (lang !== 'zh_CN') {
        document.getElementById('m7LanguageStyle').href = './static/i18nStyle/lang-' + lang + '.css'
      }
    }
  })()
  export default {
    name: 'i18n',
    data () {
      return {
        selected: window.localStorage.lang,
        options: [
          { text: '中文', value: 'zh_CN' },
          { text: '日文', value: 'ja' },
          { text: '英文', value: 'en' }
        ]
      }
    },
    methods: {
      changeLang () {
        window.localStorage.lang = this.selected
        Vue.config.lang = this.selected
        let languageStyle = document.getElementById('m7LanguageStyle')
        if (this.selected === 'zh_CN') {
          languageStyle.href = ''
        } else {
          languageStyle.href = './static/i18nStyle/lang-' + this.selected + '.css'
        }
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import '../../../assets/common.styl';
</style>

