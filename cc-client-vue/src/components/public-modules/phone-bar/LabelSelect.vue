<template>
  <span class="select-wrap">
    <el-select :class="[stringFlag?'adv-search-width':'']" size="small" v-model="firstObj" :placeholder="$t('webchat.webchatAll')" @change="changeCallLabelSelect">
      <el-option :label="$t('webchat.webchatAll')" value="1"></el-option>
      <el-option
              v-for="item in callLabel.searchFirstLabel"
              :label="item.name"
              :value="item"
              >
      </el-option>
    </el-select>
    <el-select :class="[stringFlag?'adv-search-width':'']"  size="small" v-model="secondObj" :placeholder="$t('webchat.webchatAll')" @change="changeCallLabelSelect">
      <el-option :label="$t('webchat.webchatAll')" value="2"></el-option>
      <el-option
              v-for="item in secondStepLabel"
              :label="item.name"
              :value="item"
              >
      </el-option>
    </el-select>
    <el-select size="small" v-model="thirdObj" :placeholder="$t('webchat.webchatAll')" @change="changeCallLabelSelect">
      <el-option :label="$t('webchat.webchatAll')" value="3"></el-option>
      <el-option
              v-for="item in thirdStepLabel"
              :label="item.name"
              :value="item"
              >
      </el-option>
    </el-select>
  </span>
</template>
<script>
  import {getAllUseMultiCallLabel, getAllUseSingleCallLabel, deepClone} from '../../../utils/m7Utils.js'
  export default {
    name: 'labelSelect',
    props: {
      stringFlag: Boolean,
      secondLabel: Array,
      thirdLabel: Array,
      resetSelect: Boolean,
      isClear: Boolean
    },
    data () {
      return {
        callForm: {
          multiFirst: '',
          multiTwo: '',
          multiThree: ''
        },
        firstObj: '',
        secondObj: '',
        thirdObj: '',
        callLabel: {},
        secondStepLabel: [],
        thirdStepLabel: []
      }
    },
    computed: {
    },
    watch: {
      resetSelect: 'resetSelectes',
      isClear: 'isCleares'
    },
    methods: {
      resetSelectes (cur, prev) {
        if (this.resetSelect) {
          this.firstObj = ''
          this.secondObj = ''
          this.thirdObj = ''
          this.$emit('labelSelect', {multiFirst: '', multiTwo: '', multiThree: ''}, 'multiCallLabel')
        }
      },
      isCleares () {
        if (this.isClear) { // 高级搜索的清空操作
          this.firstObj = ''
          this.secondObj = ''
          this.thirdObj = ''
          this.$emit('labelSelect', {multiFirst: '', multiTwo: '', multiThree: ''}, 'multiCallLabel')
        }
      },
      changeCallLabelSelect (item) {
        if (item.level === 1) {
          let secondStepLabel = this.callLabel.secondStepLabel
          this.secondStepLabel = [] // change的时候之前的数组清空
          this.thirdStepLabel = []
          this.secondObj = ''
          this.thirdObj = ''
          for (let i = 0; i < secondStepLabel.length; i++) {
            if (secondStepLabel[i].keyStr.indexOf(item.keyStr + '-') > -1) { // 根据选择的标签来匹配自己的孩子
              this.secondStepLabel.push(secondStepLabel[i])
            }
          }
          if (this.stringFlag) { // 通话高级搜索带上name值
            this.callForm.multiFirst = item._id + '__' + item.name
          } else {
            this.callForm.multiFirst = item._id
          }
          this.callForm.multiTwo = '' // 清空操作，避免第二次操作的时候带上就值
          this.callForm.multiThree = ''
        } else if (item.level === 2) {
          let thirdStepLabel = this.callLabel.thirdStepLabel
          this.thirdStepLabel = []
          this.thirdObj = ''
          for (let i = 0; i < thirdStepLabel.length; i++) {
            if (thirdStepLabel[i].keyStr.indexOf(item.keyStr + '-') > -1) {
              this.thirdStepLabel.push(thirdStepLabel[i])
            }
          }
          if (this.stringFlag) { // 通话高级搜索带上name值
            this.callForm.multiTwo = item._id + '__' + item.name
          } else {
            this.callForm.multiTwo = item._id
          }
          this.callForm.multiThree = ''
        } else if (item.level === 3) {
          if (this.stringFlag) { // 通话高级搜索带上name值
            this.callForm.multiThree = item._id + '__' + item.name
          } else {
            this.callForm.multiThree = item._id
          }
        }
        if (item === '1') { // 1级标签  请选择
          this.callForm.multiFirst = '' // select 清空
          this.callForm.multiTwo = ''
          this.callForm.multiThree = ''
          this.secondObj = ''
          this.thirdObj = ''
          this.secondStepLabel = [] // 下级的下拉框清空
          this.thirdStepLabel = []
        } else if (item === '2') { // 2级标签 请选择
          this.callForm.multiTwo = ''
          this.callForm.multiThree = ''
          this.thirdObj = ''
          this.thirdStepLabel = []
        } else if (item === '3') {
          this.callForm.multiThree = ''
        }
        if (item === '') {
          this.$emit('labelSelect', {multiFirst: '', multiTwo: '', multiThree: ''}, 'multiCallLabel')
        } else {
          this.$emit('labelSelect', this.callForm, 'multiCallLabel')
        }
      }
    },
    beforeMount () {
      let allLabel = deepClone(this.$store.state.session.dicMap.callLabel)
      if (allLabel === -1) {
        allLabel = []
      }
      let search = true
      let singleObj = getAllUseSingleCallLabel(allLabel, search)
      let multiObj = getAllUseMultiCallLabel(allLabel, singleObj.searchSingleLabel, search)
      this.callLabel = multiObj
    }
  }
</script>
<style lang="stylus" scoped>
  .adv-search-width
    width 192px
    margin-right 14px
</style>
