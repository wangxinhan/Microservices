<template>
  <div class="font14">
    <div v-for="item in groupCallLabel">
      <label class="label-box">
        <input type="checkbox" v-model.trim="item.checked" :value="item._id" @change="changeCallLabel()"><span class="label-text">{{item.name}}</span>
      </label>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'SingleLabel',
    data () {
      return {
      }
    },
    props: {
      callLabel: Array
    },
    computed: {
      groupCallLabel () {
        let all = this.callLabel
        let labelIdObj = window.localStorage.getItem('labelIdObj')
        let check = []
        if (labelIdObj) {
          labelIdObj = JSON.parse(labelIdObj)
          let callId = this.$store.state.cti.globalLet.currentCallSheetId
          if (labelIdObj.callID === callId) {
            check = labelIdObj.labelIdArray
          }
        }
        let newCallLabel = []
        for (let item in all) {
          newCallLabel.push(all[item])
          newCallLabel[item].checked = false
          for (let checkItem in check) {
            if (check[checkItem] === all[item]._id) {
              newCallLabel[item].checked = true
              break
            }
          }
        }
        return newCallLabel
      }
    },
    methods: {
      getAllCheck () {
        return this.groupCallLabel.filter(item => item.checked).map(item => item._id)
      },
      changeCallLabel () {
        let CheckIds = this.getAllCheck()
        let callID = this.$store.state.cti.globalLet.currentCallSheetId
        let labelId = ''
        let labelIdObj = {}
        let labelIdArray = []
        labelIdObj.callID = callID
        for (let i = 0; i < CheckIds.length; i++) {
          labelId += CheckIds[i] + '##'
          labelIdArray.push(CheckIds[i])
        }
        labelIdObj.labelIdArray = labelIdArray
        window.localStorage.setItem('labelIdObj', JSON.stringify(labelIdObj))
        this.$store.dispatch('phoneMark', labelId)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .label-box
    position relative
    float left
    input
      sing-inp()
    input:checked+span
      sing-sped()
    input+span
      sing-sp()
    input:checked+span
      &:after
        sing-af()
      &:before
        sing-be()
</style>
