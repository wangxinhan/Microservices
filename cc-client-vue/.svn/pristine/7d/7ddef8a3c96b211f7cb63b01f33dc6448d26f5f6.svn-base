<template>
  <div class='m7-select'>
    <div class='mn-input' @click='mnInputClick'>
      <i class='mn-input-icon' :class='{disable:disable}'>
        <span v-bind:class="{' triangle-down':!dropdown,'triangle-up':dropdown}"></span>
      </i>
      <input type='text' readonly='readonly' autocomplete='off' class='mn-input-inner' :value='currentLabel'
             :disabled='disabled' :class='{disable:disable}'/>

    </div>
    <transition name="el-zoom-in-top">
      <div class='m7-select-dropdown' v-show='dropdown' style="position: absolute;margin-top: 2px">
        <ul class='m7-select-dropdown-list'>
          <slot></slot>
          <li v-for='item in options' :value='item.value' class='m7-select-dropdown-item' @click.stop='optionClick(item)'
              :class='{selected:value == item.value}'>
            <span>{{item.label}}</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
  module.exports = {
    name: 'm7-select',
    data () {
      return {
        isSelect: true,
        disable: this.disabled,
        dropdown: false,
        newOptions: []
      }
    },
    props: {
      value: {
        default: ''
      },
      options: {
        type: Array,
        default: []
      },
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: String
    },
    computed: {
      currentLabel () {
        let label
        this.newOptions.concat(this.options).forEach((item) => {
          if (item.value === this.value) {
            label = item.label
          }
        })
        if (this.value === undefined) {
          label = this.placeholder
        }
        return label
      }
    },
    methods: {
      mnInputClick () {
        if (!this.disable) {
          this.dropdown = !this.dropdown
        }
      },
      optionClick (item) {
        let vm = this
        this.value = item.value
        this.$emit('input', this.value)
        this.$emit('change')
        window.setTimeout(function () {
          vm.dropdown = false
        }, 100)
      },
      //  按键盘上的Esc键时  下拉框隐藏
      domKeydown (event) {
        if (!this.disable) {
          const keyCode = event.keyCode
          if (keyCode === 27) {
            event.preventDefault()
            this.dropdown = false
          }
        }
      },
      //  点击空白处 下拉框隐藏
      domClick: function (event) {
        if (!this.$el.contains(event.target)) {
          this.dropdown = false
        }
      }
    },
    mounted () {
      document.addEventListener('keydown', this.domKeydown)
      document.addEventListener('click', this.domClick)
    }
  }
</script>

<style scoped lang="stylus">
  .mn-input .disable {
    background-color: rgb(238, 246, 246);
    border-color: rgb(209, 229, 227);
    color: #999;
    cursor: not-allowed;
  }

  .m7-select {
    position: relative;
    display: inline-block
  }

  .mn-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%
  }

  .mn-input-inner {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #999;
    display: block;
    font-size: inherit;
    height: 30px;
    line-height: 1;
    outline: none;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%
  }
  .mn-input-inner:hover{
    border:1px solid rgb(131, 165, 163);
  }
  .mn-input input {
    cursor: pointer
  }

  .mn-input-icon {
    position: absolute;
    width: 35px;
    height: 100%;
    right: 0;
    top: 0;
    text-align: center;
    color: #bfcbd9;
    transition: all .3s;
  }

  .triangle-down, .triangle-up {
    width: 0;
    height: 0;
    position: absolute;
    top: 50%;
    right: 50%;
    border-radius: 3px;
    transition: transform .3s;

  }

  .triangle-down {
    margin: -4px -10px 0 0;
    border: 7px solid transparent;
    border-top-color: #bfcbd9;
  }

  .triangle-up {
    margin: -4px -10px 0 0;
    border: 7px solid transparent;
    border-top-color: #bfcbd9
    transform: translateY(-55%) rotateZ(180deg);
  }

  .m7-select-dropdown {
    position: absolute;
    z-index: 1001;
    border: 1px solid #d1dbe5;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    box-sizing: border-box;
    margin: 0
    width: 100%;
    max-height: 274px;
    overflow: auto;
  }

  .m7-select-dropdown-list {
    list-style: none
    padding: 6px 0
    margin: 0
    box-sizing: border-box
    width: 100%
  }

  .m7-select-dropdown-item {
    font-size: 12px
    padding: 0 10px
    position: relative
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    color: #48576a
    height: 32px
    line-height: 32px
    box-sizing: border-box
    cursor: pointer
  }

  .m7-select-dropdown-item:hover {
    background-color: #e4e8f1
  }

  .m7-select-dropdown-item.selected {
    color: #fff
    background-color: #1ebc9b
  }
</style>
