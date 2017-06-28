<template>
    <li class="m7-select-dropdown-item" :class="{selected: itemSelected}" @click.stop="selectOptionClick">
      <slot>
        <span>{{ currentLabel }}</span>
      </slot>
    </li>
</template>

<script>
  export default {
    name: 'm7-option',
    componentName: 'm7-option',
    props: {
      value: {
        require: true
      },
      label: [String, Number],
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      currentLabel () {
        return this.label || ((typeof this.value === 'string' || typeof this.value === 'number') ? this.value : '')
      },

      currentValue () {
        return this.value || this.label || ''
      },
      parent () {
        let result = this.$parent
        while (!result.isSelect) {
          result = result.$parent
        }
        return result
      },
      itemSelected () {
        return this.value === this.parent.value
      }
    },
    methods: {
      selectOptionClick () {
        this.parent.optionClick({
          label: this.label,
          value: this.value
        })
      }
    },
    created () {
      this.parent.newOptions.push({
        label: this.label,
        value: this.value
      })
    }
  }
</script>

<style scoped lang="stylus">
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
