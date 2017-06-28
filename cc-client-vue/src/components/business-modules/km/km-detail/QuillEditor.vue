<template>
  <div class="quill-editor-example">
    <!-- quill-editor -->
    <quill-editor ref="myTextEditor"
                  v-model.trim="content"
                  :config="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
                  @change="onChange($event)">
    </quill-editor>
  </div>
</template>
<script>
  export default {
    props: {
      editdata: Array
    },
    data () {
      return {
        name: 'base-example',
        content: '',
        editorOption: {
          placeholder: '',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike', {'list': 'ordered'}, {'list': 'bullet'}, {'header': [1, 2, 3, 4, 5, 6, false]}, {'color': []}, {'background': []}, {'font': []}, {'align': []}, 'link', 'kmUpLoadFile', 'clean']
            ]
          }
        }
      }
    },
    methods: {
      onEditorBlur (editor) {
        console.log('editor blur!', editor)
      },
      onEditorFocus (editor) {
        console.log('editor focus!', editor)
      },
      onEditorReady (editor) {
        console.log('editor ready!', editor)
      },
      onChange (editor) {
        this.$emit('submitContent', editor.html)
      }
    },
    computed: {
      editor () {
        return this.$refs.myTextEditor.quillEditor
      }
    },
    mounted () {
      console.log('this is my editor', this.editor)
      setTimeout(() => {
        this.content = this.editdata.content
      }, 1800)
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/common.styl";
  .ql-container
    height 15em
    .ql-editor
      min-height 15em
      padding-bottom 1em
      max-height 25em
      height 15em
      color $cf-gray1
  .icon-tupianicon
    color #444
    font-size 14px
</style>
