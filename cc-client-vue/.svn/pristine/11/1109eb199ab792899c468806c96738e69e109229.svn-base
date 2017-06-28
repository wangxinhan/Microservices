<template>
<div class="c-add">
<edit-cust
:isMerge="false"
:isBlight="false"
:labelValue="3"
:currentBusinessObj="currentBusinessObj"
@addCustomer="addCust"
>
</edit-cust>
</div>
</template>
<script>
  import editCust from './AddCustomer.vue'
  import {deepClone} from '../../../utils/m7Utils.js'
  export default {
    name: 'AddCustomers',
    data () {
      return {
        currentBusinessObj: {
          type: 'customer',
          tabType: 'customer_my',
          labelValue: 3
        }
      }
    },
    components: {
      editCust
    },
    methods: {
      addCust (form) {
        let cur = deepClone(form)
        this.$store.dispatch('addCustomer', form).then((val) => {
          // 自定义操作
          let currentCustomer = val.data
          let _id = currentCustomer._id
          if (_id) {
            this.$router.push(`/index/${cur.type}/${cur.tabType}/${_id}`)
          } else {
            this.$message.error(this.$t('customer.addCustomerFailed'))
          }
        })
      }
    }
  }
</script>
