<template>
  <div>
    <div class="" v-if="" style="height:60px;">
      {{cardList.length}}
      {{showTrue}}
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Pagination',
    data () {
      return {
      }
    },
    props: {
      cardList: Array
    },
    methods: {

    },
    computed: {
      getChecked () { // 单选获取数组
        return this.cardList.filter(item => item.checked).map(item => item._id)
      },
      showTrue () {
        let aa = this.getChecked.length
        return aa > 0
      }
    }
  }
</script>

