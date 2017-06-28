 <template>
  <div>
    <el-dropdown trigger="click" @command="calling">
      <span class="el-dropdown-link" v-if="!phone.module">
        <i :class="['iconfont', 'icon-dianhua', phoneInfos.length === 0 ? 'disable' : '']" v-if="type=='call'"></i>
        <i :class="['iconfont', 'icon-duihua', phoneInfos.length === 0 ? 'disable' : '']" v-if="type=='tlak'"></i>
      </span>
      <span class="dropdown" v-if="phone.module && phone.module === 'question'" @click="calling(phoneNum)">
        <i :class="['iconfont', 'icon-dianhua', phoneInfos.length === 0 ? 'disable' : '']" v-if="type=='call'"></i>
        <i :class="['iconfont', 'icon-duihua', phoneInfos.length === 0 ? 'disable' : '']" v-if="type=='tlak'"></i>
      </span>
      <el-dropdown-menu v-if="phoneInfos.length > 0 && !phone.module" slot="dropdown">
        <el-dropdown-item :command="phoneInfo.tel" v-for="phoneInfo in phoneInfos">
        <span v-if="isHideTel">{{hideTel(phoneInfo.tel)}}</span>
        <span v-else>{{phoneInfo.tel}}</span>
        <span v-if="phoneInfo.memo">({{phoneInfo.memo}})</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
 </template>
<script>
  import { isHideTel } from '../../../utils/customerUtils.js'
  import { checkHideTel } from '../../../utils/m7Utils'
  export default {
    name: 'Phone',
    props: {
      phone: Object
    },
    computed: {
      isHideTel () {
        return isHideTel(this.$store.state.session.user)
      },
      phoneInfos () {
        return this.phone && this.phone.tel
      },
      type () {
        return this.phone && this.phone.type
      },
      phoneNum () {
        let phoneNum = ''
        if (this.phone.tel.length > 0 && this.phone.tel[0].tel) {
          phoneNum = this.phone.tel[0].tel
        }
        return phoneNum
      }
    },
    methods: {
      hideTel (tel) {
        return checkHideTel(tel, this.$store.state.session.user)
      },
      calling (command) {
        let objReg = new RegExp(/^[0-9]*$/)
        if (!objReg.test(command)) {
          return
        }
        let data = {}
        data.phoneNum = command
        if (this.phone.ques_id) { // 当是问卷模块时 需要添加ques_id字段
          data.ques_id = this.phone.ques_id
        }
        if (this.type === 'call') {
          this.$store.dispatch('phoneDialout', data)
          if (data.ques_id) {
            window.sessionStorage.ques_phoneNum = command
            document.getElementsByClassName('dialout-button-wrap')[0].click()
          }
        } else {
          this.$store.commit('call/SET_CALL_NUM', data)
          document.getElementById('megSms').click()
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
.el-dropdown, .el-dropdown-link, .dropdown
  display block
  width 100%
  height 100%
  line-height 36px
  text-align center
  color #1abb9c
  .iconfont
    font-size 18px
  .disable
    color #d3d3d3
    cursor no-drop
</style>
