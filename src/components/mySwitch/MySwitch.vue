<template>
  <i-switch size="large" :true-color="activeColor" :false-color="inactiveColor" @on-change="handleSwitch">
    <span slot="open">{{activeText}}</span>
    <span slot="close">{{inactiveText}}</span>
  </i-switch>
</template>

<script>
export default {
  props: {
    // 开启时的背景颜色
    activeColor: {
      type: String,
      default: '#1CC09F'
    },

    // 关闭时的背景颜色
    inactiveColor: {
      type: String,
      default: '#ccc'
    },

    // 开启时文字
    activeText: {
      type: String,
      default: '正常'
    },

    // 关闭时的文字
    inactiveText: {
      type: String,
      default: '禁用'
    }
  },
  methods: {
    // 开关变化
    handleSwitch(val) {
      this.$emit('change-switch',val)
    }
  }
};
</script>

<style lang="less" scoped>
</style>