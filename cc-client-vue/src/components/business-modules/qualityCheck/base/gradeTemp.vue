<template>
  <div class="grade-temp">
    <el-row :gutter="30">
      <el-col span="11">
        {{$t('qualityCheck.quality')}}
      </el-col>
      <el-col span="13">
        {{$t('qualityCheck.qualityResult')}}
      </el-col>
    </el-row>
    <el-form :model="form" ref="form">
      <el-row :gutter="30" v-for="(item, index) in configList">
        <el-col :span="11" v-if="!item.fatal">
          {{item.name}}
        </el-col>
        <el-col :span="11" v-else>
          {{item.name}}
          <el-tooltip class="item" effect="dark" placement="right">
            <div slot="content">
              致命性项，如果评分低于60则总分为0
            </div>
            <i class="iconfont icon-tixingweizhi"></i>
          </el-tooltip>
        </el-col>
        <el-col span="6">
          <el-form-item
            :prop="item.order + '_' + item.fatal + '_' + item.weight"
            :rules="rules"
            style="margin-top: -10px;"
            >
            <el-input size="small" :placeholder="$t('public.pleaseEnter')" v-model="form[item.order + '_' + item.fatal + '_' + item.weight]" auto-complete="off" @blur="blur">
              <span slot="prepend" class="percentageb">{{item.weight}}%</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          单项最大分为100
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="30">
      <el-col span="11">
        总分
      </el-col>
      <el-col span="13">
        <span class="totalScore">{{gradeObj.grade}}</span>
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
<script>
//  import {deepClone} from '../../../../utils/m7Utils.js'
  export default {
    name: 'gradeTemp',
    data () {
      let validate1 = (rule, value, callback) => {
        if (!/^\d+$/.test(value)) {
          callback(new Error('评分只能填写0-100的整数'))
        } else if (parseInt(value) > 100) {
          callback(new Error('评分的范围是0至100'))
        } else {
          callback()
        }
      }
      return {
        validate: validate1,
        rules: [
          {required: true, message: '必填'},
          {validator: validate1, trigger: 'blur'}
        ]
      }
    },
    props: {
      configList: Array,
      form: Object,
      gradeObj: Object,
      saveBtn: String
    },
    computed: {
    },
    watch: {
      form: {
        deep: true,
        handler: function (newV) {
          let self = this
          self.gradeObj.grade = 0
          for (var i in self.form) {
            let arr = i.split('_')
            if (arr[1] === 'true') {
              if (self.form[i] < 60) {
                self.gradeObj.grade = 0
                return
              }
            }
            let num = parseInt(self.form[i]) * parseInt(arr[2]) / 100
            if (!num) {
              num = 0
            }
            self.gradeObj.grade += num
          }
          if (!self.gradeObj.grade) {
            self.gradeObj.grade = 0
          } else if (self.gradeObj.grade > 0) {
            self.gradeObj.grade = self.gradeObj.grade.toFixed(1)
          }
        }
      }
    },
    methods: {
      off () {
        this.$emit('off')
      },
      save () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            for (let i in this.form) {
              let arr = i.split('_')
              let num = parseInt(this.form[i]) * parseInt(arr[2]) / 100
              this.gradeObj.obj[arr[0]] = num
            }
            this.$emit('save', this.gradeObj)
          } else {
            this.$message.error('当前存在没有结果的质检项！')
          }
        })
      }
    },
    beforeMount () {
    }
  }
</script>
<style lang="stylus" scoped>
  .icon-tixingweizhi
    display inline-block
    font-size 12px
    color #1abb9c
    line-height 14px
    height 14px
    width 14px
    text-align center
    border-radius 50%
    border 1px solid #1abb9c
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
    border 1px solid #eee
</style>
