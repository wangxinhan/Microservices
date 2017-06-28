<template>
  <div class="table">
    <el-table
      :id="random"
      :data="data"
      style="width: 100%"
      stripe
      :show-header="true"
      >
      <el-table-column
        v-for="item in config"
        v-if="item.show === true && item.name !== 'agent_name' && item.name !== 'Province'"
        :prop="item.name"
        :label="item.displayname"
        sortable
        >
        <template scope="scope">{{scope.row[item.name]}}</template>
      </el-table-column>
      <el-table-column
        v-else-if="item.show === true && item.name === 'Province'"
        :prop="item.name"
        :label="item.displayname"
        sortable
        :formatter="htmlFormatter"
        show-overflow-tooltip = "true"
        >
          <template scope="scope">
            <span class="drill" @click=proName(scope.row.Province)>{{scope.row.Province}}</span>
          </template>
      </el-table-column>
      <el-table-column
        v-else-if="item.show === true && item.name === 'agent_name'"
        :prop="item.name"
        :label="item.displayname"
        sortable
        :formatter="htmlFormatter"
        show-overflow-tooltip = "true"
        >
          <template scope="scope">
            <span class="drill" @click="agentName(data[scope.$index].AgentID, data[scope.$index].agent_name)">{{scope.row.agent_name}}</span>
          </template>
      </el-table-column>
    </el-table>
    <el-table
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
      proName (name) {
        this.$emit('proName', name)
      },
      agentName (id, name) {
        this.$emit('agentName', id, name)
      },
      appendTfoot () {
        this.$nextTick(function () {
          if (this.data.length) {
//            window.alert(1)
            let target = document.getElementById(this.random)
            let heji = document.getElementById(this.random + '_sum')
            let tr = heji.getElementsByTagName('tr')
            if (tr[0]) {
              let tfoot = document.createElement('tfoot')
              tfoot.appendChild(tr[0])
              target.getElementsByTagName('table')[1].appendChild(tfoot)
            }
          } else {
            this.sum = []
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
  @import "../../../../assets/common.styl"
  .table
    padding-bottom: 20px
  .drill
    color $c-main
    cursor pointer
</style>
