<!--群发短信：输入多个号码  选择短信模板  群发-->
<template>
  <div class="smsMass" id="smsMassWrap" v-if="loading">
    <affix :label="$t('sms.smsMass')"></affix>
    <el-row>
      <el-col :span="12">
      <div class="send">
        <span class="phone-num">{{$t('sms.phoneNum')}}:</span>
        <el-input size="small"
          type="textarea"
          :rows="6"
          :placeholder="$t('public.pleaseEnter')"
          resize="none"
          v-model.trim="form.smsPhoneNum">
        </el-input>
        <span class="cho-mo-title">{{$t('sms.chooseTempToSend')}}:</span>
        <el-select size="small" class="cho-mo" v-model.trim="selectedsms" :placeholder="$t('public.pleasePick')" @change="changeout">
          <el-option
            v-for="item in smsTemplates"
            class="sms-mass-select-option"
            :label="item.displayname"
            :value="item.num" v-bind:value="item.num">
          </el-option>
        </el-select>
        <!--选择模板后 展示模板内容-->
        <div class="sms-mo" id="smsBatchContentPane" v-if="cursmstemplate" v-html="cursmstemplate.contented">
        </div>
        <p class="qimo" v-if="cursmstemplate">{{cursmstemplate.signname}}</p>
        <!--信息字数和条数提示-->
        <p class="warn-text" v-html="$t('sms.reciprocalNum')"></p>
        <p class="warn-text2" v-html="$t('sms.smsPagingNum')"></p>
      </div>
      <div class="submit">
        <el-button type="primary" size="small" @click.stop="reset" class="sms-reset">{{$t('public.reset')}}</el-button>
        <el-button type="primary" size="small" @click.stop="sendBatchSms" class="sms-send">{{$t('sms.send')}}</el-button>
      </div>
      </el-col>
      <!--页面右侧 说明-->
      <el-col :span="12" class="mass-attention">
        <div class="caption">
          {{$t('sms.attention')}}:<br>
          {{$t('sms.tip1')}}<br>
          {{$t('sms.tip2')}}<br>
          {{$t('sms.tip3')}}<br>
          {{$t('sms.tip4')}}<br>
          {{$t('sms.tip5')}}<br>
          {{$t('sms.tip6')}}<br>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import affix from '../../ui-modules/affix/Affix.vue'
  export default {
    name: 'smsMass',
    props: {
      refresh: String
    },
    data () {
      return {
        loading: false,
        selectedsms: '',
        smsTemplates: '',
        cursmstemplate: '',
        splitCount: 1,
        form: {
          smsPhoneNum: ''
        }
      }
    },
    methods: {
//      select 选择
      changeout (option) {
        for (let k = 0; k < this.smsTemplates.length; k++) {
          if (this.smsTemplates[k].num === option) {
            this.cursmstemplate = this.smsTemplates[k]
            document.getElementById('smsMassWrap').getElementsByClassName('warn-text')[0].style.display = 'none'
            document.getElementById('smsMassWrap').getElementsByClassName('warn-text2')[0].style.display = 'none'
            this.$nextTick(() => {
              this.updateSmsBatchNum()
            })
          }
        }
      },
//      获得下拉框 数据
      getSmsTemplate () {
        this.$store.dispatch('getselectsms').then((smsselsect) => {
          this.loading = true
          if (smsselsect) {
            this.smsTemplates = smsselsect
            this.cursmstemplate = this.smsTemplates[0]
            if (this.smsTemplates[0]) {
              this.selectedsms = this.smsTemplates[0].num
            }
          }
        })
      },
//      群发短信
      sendBatchSms () {
        let smsMassWrap = document.getElementById('smsMassWrap')
        let nodeList = smsMassWrap.getElementsByClassName('smsTemplateVar')
        let committmpl = {}
        committmpl.nums = this.form.smsPhoneNum
        if (committmpl.nums === '') {
          this.$message.error(this.$t('sms.pleaseInpPhoneNum'))
          return false
        }
        let numArr = null
        let isHuiChe = true
        if (committmpl.nums.indexOf(',') !== -1) {
          isHuiChe = false
          numArr = committmpl.nums.split(',')
        } else {
          numArr = committmpl.nums.split('\n')
        }
        let account = this.$store.state.session.user.account
        if (numArr.length > 3000) {
          if (account && account === 'N00000009376') {
            if (numArr.length > 50000) {
              this.$message.error(this.$t('sms.level50000'))
              return false
            }
          } else {
            this.$message.error(this.$t('sms.level3000'))
            return false
          }
        }
        for (let i = 0; i < numArr.length; i++) {
          let patrn = /^(13[0-9]{9})|(15[0-9][0-9]{8})|(18[0-9][0-9]{8})|(17[0-9][0-9]{8})|(14[0-9][0-9]{8})$/
          if (!patrn.exec(numArr[i]) || numArr[i].length !== 11) {
            this.$message.error(this.$t('sms.errorPhoneNum') + numArr[i])
            return false
          }
        }
        committmpl.numCount = numArr.length
        committmpl.splitCount = this.splitCount
        if (isHuiChe) {
          committmpl.nums = committmpl.nums.replace(/\n/g, ',')
        }
        committmpl.operatorStrategy = this.cursmstemplate.operatorStrategy
        committmpl.content = this.cursmstemplate.content
        committmpl.sendType = 'template'
        committmpl.templateid = this.cursmstemplate._id
        committmpl.template = committmpl.content
        committmpl.vars = this.cursmstemplate.vars
        committmpl.batchTemplateSign = this.cursmstemplate.templateSign
        let smsChannelLen = 0
        if (this.cursmstemplate.smsChannel) {
          smsChannelLen = this.cursmstemplate.smsChannel.length
        }
        if (smsChannelLen > 0) {
          committmpl.smsChannel = this.cursmstemplate.smsChannel[0]
        } else {
          this.$message.error(this.$t('sms.channelerror'))
          return
        }
        if (committmpl.operatorStrategy) {
          committmpl.yd_smsChannel = this.cursmstemplate.yd_smsChannel
          committmpl.dx_smsChannel = this.cursmstemplate.dx_smsChannel
          committmpl.lt_smsChannel = this.cursmstemplate.lt_smsChannel
          committmpl.df_smsChannel = this.cursmstemplate.df_smsChannel
        }
        for (let i = 0; i < nodeList.length; i++) {
          let j = i + 1
          committmpl['batchSmsTemplateVar' + j] = this.delSpecialChar(nodeList[i].innerHTML)
          committmpl.content = committmpl.content.replace('{' + j + '}', committmpl['batchSmsTemplateVar' + j])
        }
        committmpl.content = this.delSpecialChar(committmpl.content)
        if (this.cursmstemplate.sign === '') {
          this.$message.error(this.$t('sms.sendphonenameerror'))
          return
        }
        this.$store.dispatch('sendBatchSms', committmpl).then(response => {
          if (response) {
            this.$message.success(this.$t('sms.sendsuccess'))
          } else {
            this.$message.error(this.$t('sms.sendfail'))
          }
        })
      },
//      将英文引号等转换成中文 去掉特殊字符
      delSpecialChar (content) {
        content = content.replace(/\\'/g, "'")
        content = content.replace(/\\"/g, '"')
        let contentarr = content.split('"')
        let str = ''
        let str2 = ''
        for (var j = 0; j < contentarr.length - 1; j++) {
          str += contentarr[j] + (j % 2 ? '”' : '“')
        }
        str += contentarr[j]
        contentarr = str.split("'")
        for (var m = 0; j < contentarr.length - 1; m++) {
          str2 += contentarr[m] + (m % 2 ? '’' : '‘')
        }
        str2 += contentarr[m]
        let reg1 = new RegExp('<[^<]*>', 'gi')
        str2 = str2.replace(reg1, '')
        let reg2 = new RegExp('</', 'gi')
        str2 = str2.replace(reg2, '')
        if (str2.substr(str2.length - 1, 1) === '\\' && str2.substr(str2.length - 2, 2) !== '\\\\') {
          str2 = str2 + '\\'
        }
        return str2
      },
//      发信息内容 更改时 计数
      updateSmsBatchNum () {
        let pane = document.getElementById('smsBatchContentPane')
        let paneWrap = document.getElementById('smsMassWrap')
        if (pane) {
          let span = pane.getElementsByClassName('smsTemplateVar')
          if (span) {
            let self = this
            for (var j = 0; j < span.length; j++) {
              span[j].onkeyup = function (cur) {
                self.$store.dispatch('getCache', {type: 'smsSign', id: self.cursmstemplate.sign}).then(curSign => {
                  let content = self.cursmstemplate.content
                  let textCount = self.$store.state.sms.textCount
                  let smsSplitBaseNum = self.$store.state.sms.smsSplitBaseNum
                  let sign = curSign.name
                  let signLen = sign ? sign.length : 0
                  let varLength = self.cursmstemplate.vars * 3
                  let nodeList = paneWrap.getElementsByClassName('smsTemplateVar')
                  let fenzi = paneWrap.getElementsByClassName('fenzi')
                  let fenmu = paneWrap.getElementsByClassName('fenmu')
                  let pagingNum = paneWrap.getElementsByClassName('pagingNum')
                  let inputCount = 0
                  paneWrap.getElementsByClassName('warn-text')[0].style.display = 'block'
                  for (let i = 0; i < nodeList.length; i++) {
                    inputCount += nodeList[i].innerHTML.length
                  }
                  if (fenzi && fenzi.length > 0) {
                    let fenziNum = textCount - signLen + varLength - content.length - inputCount
                    let curElement = cur.srcElement
                    if (fenziNum < 0) {
                      curElement.innerHTML = curElement.innerHTML.substr(0, curElement.innerHTML.length + fenziNum)
                      inputCount = inputCount + fenziNum
                      fenziNum = 0
                    }
                    fenzi[0].innerHTML = fenziNum
                  }
                  if (fenmu && fenmu.length > 0) {
                    fenmu[0].innerHTML = textCount - signLen
                  }
                  if (pagingNum && pagingNum.length > 0) {
                    if ((inputCount + content.length - varLength + signLen) > smsSplitBaseNum) {
                      let n = 1
                      let nc = parseInt((inputCount + content.length - varLength + signLen - smsSplitBaseNum) / smsSplitBaseNum)
                      let nv = (inputCount + content.length - varLength + signLen - smsSplitBaseNum) % smsSplitBaseNum
                      n += nc
                      if (nv > 0) {
                        n += 1
                      }
                      pagingNum[0].innerHTML = n
                      self.splitCount = n
                      paneWrap.getElementsByClassName('warn-text2')[0].style.display = 'block'
                    } else {
                      pagingNum[0].innerHTML = 1
                    }
                  }
                })
              }
            }
          }
        }
      },
      reset () {
        this.form.smsPhoneNum = ''
        let smsMassWrap = document.getElementById('smsMassWrap')
        let nodeList = smsMassWrap.getElementsByClassName('smsTemplateVar')
        for (let i = 0; i < nodeList.length; i++) {
          nodeList[i].innerHTML = ''
        }
        document.getElementById('smsMassWrap').getElementsByClassName('warn-text')[0].style.display = 'none'
        document.getElementById('smsMassWrap').getElementsByClassName('warn-text2')[0].style.display = 'none'
      }
    },
    watch: {
      refresh (cur, old) {
        if (cur === 'mass') {
          this.getSmsTemplate()
        }
      }
    },
    beforeMount () {
      this.getSmsTemplate()
    },
    beforeUpdate () {
      this.updateSmsBatchNum()
    },
    components: {
      affix
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .smsMass
    .caption
      color $cf-blue
      font-size 12px
      line-height 24px
    .title
      color $cf-gray1
      margin 20px 0 18px 0
      font-weight normal
      position relative
      .sign
        position relative
        width 12px
        height 12px
        background #7ccdd1
        display inline-block
        z-index 3
      .text
        position relative
        display inline-block
        padding 0 8px 0 10px
        background #fff
        z-index 3
      &:after
        content ""
        display inline-block
        width 100%
        left 0
        border-bottom 1px dashed #999
        position absolute
        top 12px
    .send
      .phone-num
      .cho-mo-title
        color $cf-gray1
        font-size 12px
        display block
        margin-bottom 10px
      .cho-mo-title
        margin 18px 0 10px
      .cho-mo
        width 100%
        margin-bottom 20px
      .sms-mo
      .qimo
        color $cf-gray1
        font-size 12px
        margin-bottom 6px
        padding-left 6px
      .qimo
        margin-top 10px
        padding-left 10px
      .warn-text
        line-height 2
        color $cf-gray1
        display none
        .fenzi
          color #7bcdd2
        .fenmu
          color #f08294
      .warn-text2
        line-height 1.5
        color $cf-gray1
        margin-bottom 10px
        display none
        .pagingNum
          color #1abb9c
    .ui-affix
      padding-bottom 0
    .submit
      text-align right
      margin-top 20px
      .sms-reset
      .sms-send
        display inline-block
        width 110px
        height 30px
        font-size 12px
        line-height 30px
        text-align center
        color #fff
        padding 0
        background #7ccdd1
        border 1px solid #7ccdd1
      .sms-send
        background #1abb9c
        border 1px solid #1abb9c
    .mass-attention
      padding 20px
  .sms-mass-select-option
    max-width 660px
    height auto
    word-wrap break-word
    white-space normal
</style>
