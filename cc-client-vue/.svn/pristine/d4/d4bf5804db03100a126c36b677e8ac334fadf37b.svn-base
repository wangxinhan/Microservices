<template>
  <li>
    <div
      class="chec"
      >
      <div @click.stop="toggle"
           @dblclick="changeType">
        <span v-if="isFolder" class="open"><i :class="open ? 'el-icon-minus' : 'el-icon-plus'"></i></span>
        <span>{{model.value}}</span>
        <el-tooltip class="item" effect="dark" placement="right" v-if="model.fatalValue">
          <div slot="content">
            非致命项,个数大于等于{{model.Non_Fatal}}则致命
          </div>
          <i class="iconfont icon-tixingweizhi"></i>
        </el-tooltip>
      </div>
      <p
        v-if="!isFolder">
        <el-radio-group
          v-model.trim="form[model.name]"
          @change= "change">
          <el-radio size="small" label="yes">通过</el-radio>
          <el-radio size="small" label="no">不通过</el-radio>
          <el-radio size="small" label="dont">不涉及</el-radio>
        </el-radio-group>
      </p>
      <p v-else>
        <input type="hidden" v-model="form[model.name]"/>
        <span class="parent-result" :class="[form[model.name]==='yes'? 'active':'','abc']">通过</span>
        <span class="parent-result" :class="[form[model.name]==='no'? 'active':'','']">不通过</span>
        <span class="parent-result" :class="[form[model.name]==='dont'? 'active':'','']">不涉及</span>
      </p>
      </div>
      <ul v-show="open" v-if="isFolder">
        <item
        class="item"
        v-for="one in model.child"
        :parent="model"
        :form="form"
        :model="one">
      </item>
    </ul>
  </li>
</template>
<script>
  export default {
    name: 'item',
    data () {
      return {
        open: true,
        fatal: ''
      }
    },
    props: {
      model: Object,
      form: Object,
      parent: Object
    },
    computed: {
      isFolder: function () {
        return this.model.child &&
          this.model.child.length
      }
    },
    methods: {
      change () {
      },
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      changeType: function () {
        if (!this.isFolder) {
          this.open = true
        } else {
        }
      }
    },
    watch: {
      form: {
        deep: true,
        handler: function (newV) {
          var flog = true
          let arrFatal = []
          let arrNormal = []
          let nonFatalNum = 0
          if (!this.parent || !this.parent.child) {
            return
          }
          for (var i = 0; i < this.parent.child.length; i++) {
            let item = this.parent.child[i]
            if (!this.form[item.name]) {
              flog = false
              break
            }
            if (item.fatalValue && item.fatalValue === true) {
              nonFatalNum = parseInt(item.Non_Fatal, 10)
              arrFatal.push(this.form[item.name])
            } else {
              arrNormal.push(this.form[item.name])
            }
          }
          if (flog) {
            if (arrFatal.length !== 0) {
              let yes = 0
              let no = 0
              arrFatal.forEach(item => {
                if (item === 'yes') {
                  yes++
                } else if (item === 'no') {
                  no++
                } else {
                }
              })
              if (no >= nonFatalNum) {
                arrNormal.push('no')
              } else if (yes !== 0) {
                arrNormal.push('yes')
              } else {
                arrNormal.push('dont')
              }
            }
            let yes = 0
            let no = 0
            arrNormal.forEach(item => {
              if (item === 'yes') {
                yes++
              } else if (item === 'no') {
                no++
              } else {
              }
            })
            if (no === 0) {
              if (yes !== 0) {
                this.form[this.parent.name] = 'yes'
              } else {
                this.form[this.parent.name] = 'dont'
              }
            } else {
              this.form[this.parent.name] = 'no'
            }
          }
        }
      }
    }
  }
</script>
<style lang="stylus" scope>
  .chec
    font-size 14px
    color #989898
    margin-top 18px
    .open
      margin-left -22px
      cursor pointer
    p
      font-size 12px
      margin-top 10px
      .el-radio
        color #989898
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
  .active
    color #1ebc9b
</style>
