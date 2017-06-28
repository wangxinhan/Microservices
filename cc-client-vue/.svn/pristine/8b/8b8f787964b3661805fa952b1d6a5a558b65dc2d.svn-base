<template>
  <div class="table">
    <el-table v-if="data"
      :id="random"
      :data="data"
      style="width: 100%"
      stripe
      :show-header="true"
      >
      <el-table-column
        v-for="item in config"
        v-if="item.show === true && item.name !== 'fromUrl'"
        :prop="item.name"
        :label="item.displayname"
        sortable
        ></el-table-column>
      <el-table-column v-else-if="item.name === 'fromUrl'"
        :prop="item.name"
        :label="item.displayname"
        sortable
        :formatter="htmlFormatter"
        show-overflow-tooltip = "true"
        >
        <template scope="scope">
          <span v-html="scope.row.fromUrl"></span>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="data && sum"
      :id="random + '_sum'"
      :data="sum"
      style="display: none;width: 100%"
      :show-header="false"
      >
      <el-table-column
        v-for="item in config"
        v-if="item.show === true"
        :prop="item.name"
        :label="item.displayname"
        ></el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: 'sum',
    data () {
      return {
        a: true,
        random: Math.random()
      }
    },
    props: {
      data: {type: Array, default: []},
      sum: {type: Array, default: []},
      config: {type: Array, default: []}
    },
    methods: {
      appendTfoot () {
        this.$nextTick(function () {
          if (this.data.length !== 0) {
            if (this.sum && this.sum.length !== 0) {
              // setTimeout(() => {
              let target = document.getElementById(this.random)
              let heji = document.getElementById(this.random + '_sum')
              let tr = heji.getElementsByTagName('tr')
              if (tr[0]) {
                let tfoot = document.createElement('tfoot')
                tfoot.appendChild(tr[0])
                target.getElementsByTagName('table')[1].appendChild(tfoot)
              }
              // }, 1000)
            } else {
              this.sum = null
            }
          }
        })
      }
    },
    watch: {
      'data': 'appendTfoot'
    }
  }
</script>
<style lang="stylus" scoped>
  .table
    padding-bottom: 20px
</style>
