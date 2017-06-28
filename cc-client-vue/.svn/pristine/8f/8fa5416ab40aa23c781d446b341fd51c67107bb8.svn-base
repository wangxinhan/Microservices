## 点击通知跳转详情
###以在线客服为例
因为左侧栏的tab切换并无路由变换,因此左侧模块无法监测路由的变化

思路:
****右侧详情页(WebchatSummary.vue)监测到路由变化,向父组件(index.vue)传递事件, routeChange事件

详情组件中
fetchData () {
...
this.$emit('routeChange', this.tabType)
...
}

父组件中
<router-view @routeChange="routeChange">
</router-view>

****在routeChange方法里,将当前的tabType传递给列表组件
<CardGroup :currentTabType="currentTabType"></CardGroup>
    methods: {
      routeChange (tabType) {
        this.tabType = tabType
      }
    },
    computed: {
      currentTabType () {
        return this.tabType
      }
    }

****列表组件(WebchatCardGroup)监控currentTabType的变化,并一有变化就赋值给activeName,用来维持左侧tab的切换
    props: {
      currentTabType: String
    },
    watch: {
      currentTabType: 'changeTabType'
    }
    methods:
    {
    ...
    changeTabType () {
       this.activeName = this.currentTabType
    },
    ...
    }


####注意事项,当在别的地方刷新时,点击notify跳转到对应模块的详情时,首先要确认该模块是否存在,数据是否已初始化,没有初始化的时候应该先初始化一遍列表的数据

如webchat,再动态处理列表这块,都需要加上这样的判断
if (state.webchatList.webchat_todo.init) {
        webchatTodoItemAdd({commit, state}, obj) //往列表动态添加一个卡片,或者是在详情页追加消息
} else {
// 先初始化列表页
        let data = {submenu: 'webchat_todo'}
        dispatch('queryWebchatList', data) // commit列表的时候会对state.webchatList.webchat_todo.init的值进行赋值
}