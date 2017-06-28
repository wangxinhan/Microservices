<template>
  <ul class="face_con">
    <li class="" v-for="(emojiFace, index) in emojiFaces.faces" :title="emojiFace.name" @click="editEmojiFace(emojiFace.name, index)">
      <span :title="emojiFace.name" class="emoji-face" :style="'background-position: ' + (-(25 * (parseInt(index%4)))) + 'px ' + (-(25 * (parseInt(index/4)))) + 'px;'"></span>
    </li>
  </ul>
</template>
<script type="text/javascript">
  export default {
    name: 'EmojiFace',
    data () {
      return {
        emojiFaces: {
          faces: [{name: 'smile'}, {name: 'smiley'}, {name: 'laughing'}, {name: 'blush'},
            {name: 'heart_eyes'}, {name: 'smirk'}, {name: 'flushed'}, {name: 'kissing_heart'},
            {name: 'grin'}, {name: 'wink'}, {name: 'stuck_out_tongue_winking_eye'}, {name: 'stuck_out_tongue_closed eyes'},
            {name: 'sleeping'}, {name: 'worried'}, {name: 'expressionless'}, {name: 'sweat_smile'},
            {name: 'joy'}, {name: 'cold_sweat'}, {name: 'sob'}, {name: 'angry'},
            {name: 'mask'}, {name: 'scream'}, {name: 'sunglasses'}, {name: 'heart'},
            {name: 'broken_heart'}, {name: 'star'}, {name: 'anger'}, {name: 'exclamation'},
            {name: 'question'}, {name: 'zzz'}, {name: 'thumbsup'}, {name: 'thumbsdown'},
            {name: 'ok_hand'}, {name: 'punch'}, {name: 'yeah'}, {name: 'clap'},
            {name: 'muscle'}, {name: 'pray'}, {name: 'skull'}, {name: 'trollface'}
          ]
        }
      }
    },
    methods: {
      editEmojiFace (value, index) {
        let con = ':' + value + ':'
        let date = {
          index: index,
          value: con
        }
        this.$emit('setEmojiFace', date)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .face_con li
    float left
</style>
