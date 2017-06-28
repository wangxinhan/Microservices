<template>
  <div class="pass-temp">
    <div class="pass-temp-tree">
      <item :model="one" :form="form" v-for="one in configList"></item>
    </div>
    <el-row :gutter="30">
      <el-col span="11">
        总结果
      </el-col>
      <el-col span="13">
        <span class="totalScore" v-if="gradeObj.amount === 'yes'">通过</span>
        <span class="totalScore" v-else-if="gradeObj.amount === 'no'">不通过</span>
        <span class="totalScore" v-else-if="gradeObj.amount === 'dont'">不涉及</span>
      </el-col>
    </el-row>
    <textarea class="chat_info_li_remarks" rows="3" :placeholder="$t('public.pleaseEnter')" v-model.trim="gradeObj.COMMENT"></textarea>
    <div class="scoring">
      <span class="off" @click="off">关闭</span>
      <span class="save" @click="save" v-if="gradeObj.type!=='grade'">{{saveBtn}}</span>
      <span class="save" @click="save" v-if="gradeObj.type==='grade'">保存</span>
    </div>
  </div>
</template>
<script >
  import item from '../Check/item.vue'
  export default {
    name: 'passTemp',
    components: {
      item
    },
    data () {
      return {
      }
    },
    props: {
      configList: Object,
      form: Object,
      gradeObj: Object,
      saveBtn: String
    },
    watch: {
      form: {
        deep: true,
        handler: function (newV) {
          let flog = true
          let arr = []
          for (let i = 0; i < this.configList.length; i++) {
            let item = this.configList[i]
            if (!this.form[item.name]) {
              flog = false
              break
            }
            arr.push(this.form[item.name])
          }
          if (flog) {
            let yes = 0
            let no = 0
            arr.forEach(item => {
              if (item === 'yes') {
                yes++
              } else if (item === 'no') {
                no++
              } else {
              }
            })
            if (no === 0) {
              if (yes !== 0) {
                this.gradeObj.amount = 'yes'
              } else {
                this.gradeObj.amount = 'dont'
              }
            } else {
              this.gradeObj.amount = 'no'
            }
          }
        }
      }
    },
    methods: {
      off () {
        this.$emit('off')
      },
      save () {
        for (let i in this.form) {
          if (!this.form[i]) {
            this.$message.error('当前存在没有结果的质检项')
            return
          }
        }
        this.$emit('save', this.gradeObj)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .pass-temp
    padding 0 20px
  .pass-temp-tree
    padding-left 22px
  .scoring
    text-align center
    color #fff
    margin-top 40px
    span
     display inline-block
     padding 10px 26px
     border-radius 4px
     cursor pointer
    .off
      background #7bcdd2
    .save
      background #1abb9c
      margin-left 40px
  .el-row
    margin-top 12px
    color #8f8f8f
    .el-col-7
    .el-col-11
      line-height 36px
    .el-col-13
      .totalScore
        color #7bcdd2
  .chat_info_li_remarks
    resize none
    font-size 12px
    box-sizing border-box
    width 100%
    margin-top 6px
    border-radius 4px
    padding 6px 10px
    border 1px solid #ccc
</style>
