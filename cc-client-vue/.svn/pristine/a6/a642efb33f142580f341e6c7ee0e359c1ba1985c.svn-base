<template>
  <div ref="editor" :style="{height:height}"><slot></slot></div>
</template>
<script>
const WangEditor = require('wangeditor')
export default {
  props: {
    value: String,
    height: {
      type: String,
      default: '14rem'
    }
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    const editor = new WangEditor(this.$refs.editor)
    editor.config.menus = [
      'bold',
      'underline',
      'italic',
      'strikethrough',
      'eraser',
      'forecolor',
      'bgcolor',
      '|',
      'quote',
      'fontfamily',
      'fontsize',
      'head',
      'unorderlist',
      'orderlist',
      'alignleft',
      'aligncenter',
      'alignright',
      '|',
      'link',
      'unlink',
      'table',
      '|',
      'img',
      'video',
      '|',
      'undo',
      'redo',
      'fullscreen'
    ]
    editor.onchange = () => {
      window.alert(editor.$txt.html())
      this.$emit('input', editor.$txt.html())
    }
    if (!this.$slots.default && this.value) {
      editor.txt.$txt.html(this.value)
    }
    editor.create()
    this.editor = editor
  },
  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>
