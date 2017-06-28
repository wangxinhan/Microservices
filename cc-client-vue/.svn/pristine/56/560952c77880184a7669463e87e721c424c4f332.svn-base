<template>
  <div>
    <ul class="ivr-ul">
      <time-line v-if="ivrData" v-for="(item, index) in ivrData">
        <span class="date">{{item.TIMESTAMP}}</span>
        <span class="node-type" v-if="item.LOCATION_NAME === 'Ringing' || item.LOCATION_NAME === 'Link'">{{$t('public.agent')}}:<agent v-if ='item.LOCATION_ID':id="item.LOCATION_ID"></agent></span>
        <span class="node-type" v-else>{{$t(locationName(item.LOCATION))}}</span>
        <span v-if="LOCATION=== 'QUEUE'"><queues :id="item.LOCATION_ID"></queues></span>
        <span v-else>{{$t(locationName(item.LOCATION_NAME))}}</span>
      </time-line>
    </ul>
  </div>
</template>
<script>
  import TimeLine from 'components/ui-modules/timeLine/TimeLine'
  import Agent from 'components/public-modules/cache/Agent'
  import Queues from 'components/public-modules/cache/Queues'
  import { getChannelLocationName } from '../../../utils/m7Utils.js'
  export default {
    name: 'Contrail',
    data () {
      return {

      }
    },
    props: {
      ivrData: Array
    },
    components: {
      TimeLine,
      Agent,
      Queues
    },
    methods: {
      locationName (name) {
        return getChannelLocationName(name)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .node-type
    color #00c7d1
    margin 0 10px
    display inline-block
    width 120px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    vertical-align bottom
  .date
    margin 0 12px
    color $cf-gray4
</style>
