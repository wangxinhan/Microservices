<template>
<div class="area-linkage">
  <el-select size="small" class="area-linkage-province" :disabled="disabled" v-model.trim="province" :placeholder="$t('public.pleasePick')" @change="changeProvince">
    <el-option
      v-for="item in provinces"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <el-select size="small" class="area-linkage-city" :disabled="disabled" v-model.trim="city" :placeholder="$t('public.pleasePick')" @change="changeCity">
    <el-option
      v-for="item in cities"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</div>
</template>
<script>
  export default {
    name: 'AreaLinkage',
    data () {
      return {
        provinces: [],
        province: null,
        city: null,
        initCity: false,
        provinceCache: { options: [] }
      }
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      provinceName: String,
      provinceValue: String,
      cityName: String,
      cityValue: String
    },
    computed: {
      cities () {
        let cities = []
        if (this.province) {
          for (let i = 0; i < this.provinceCache.options.length; i++) {
            if (this.provinceCache.options[i].key === this.province) {
              cities = this.provinceCache.options[i].options
              break
            }
          }
        }
        return [{ label: this.$t('public.all'), value: '' }, ...cities.map(city => ({ label: city.name, value: city.key }))]
      }
    },
    methods: {
      getOption (province, city) {
        let option
        for (let i = 0; i < this.provinceCache.options.length; i++) {
          if (this.provinceCache.options[i].key === province) {
            option = this.provinceCache.options[i]
            break
          }
        }
        if (city) {
          for (let i = 0; i < option.options.length; i++) {
            if (option.options[i].key === city) {
              option = option.options[i]
              break
            }
          }
        }
        return option
      },
      changeProvince (value) {
        this.province = value
        // 如果有初始值传递过来，beforeMount方法中改变this.province的值会触发changeProvince
        // this.initCity用于传入初始值的情况，如果city有初始值，this.initCity为true，第一次触发changeProvince不会修改this.city
        // 之后this.initCity始终为false
        if (this.province !== null && !this.initCity) {
          this.city = ''
        }
        this.initCity = false
        let obj = { value, label: '' }
        if (value) {
          let provinceOption = this.getOption(this.province)
          obj.label = provinceOption.name
        }
        this.$emit('provinceChange', obj, this.provinceName)
      },
      changeCity (value) {
        this.city = value
        let obj = { value, label: '' }
        if (value) {
          let cityOption = this.getOption(this.province, value)
          obj.label = cityOption.name
        }
        this.$emit('cityChange', obj, this.cityName)
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', { type: 'options', id: 'd7b9c68a-b50f-21d1-d5fd-41ea93f5f49c' }).then(provinceCache => {
        this.provinceCache = provinceCache
        let provinces = [{ label: this.$t('public.all'), value: '' }, ...provinceCache.options.map(province => ({ label: province.name, value: `${province.key}` }))]
        this.provinces = provinces
        if (this.provinceValue) {
          this.province = this.provinceValue
        }
        if (this.cityValue) {
          this.city = this.cityValue
          this.initCity = true
        }
      })
    },
    watch: {
      provinceValue (curr, prev) {
        if (curr === null) {
          this.province = null
        }
        if (curr === '') {
          this.province = ''
        }
      },
      cityValue (curr, prev) {
        if (curr === null) {
          this.city = null
        }
        if (curr === '') {
          this.city = ''
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .area-linkage
    display flex
    .area-linkage-province
      flex 1
      margin-right 20px
    .area-linkage-city
      flex 1
</style>
