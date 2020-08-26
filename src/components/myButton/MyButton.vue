<template>
  <Button
    type="primary"
    class="btn"
    :loading="loading"
    :style="{'background':bgColor,'borderColor':bdColor,'color':textColor,'fontSize':textSize}"
  >{{btnText}}</Button>
</template>

<script>
export default {
  props: {
    // 按钮文字
    btnText: {
      type: String,
      default: "新 建"
    },

    // 按钮背景颜色
    bgColor: {
      type: String,
      default: "#1CC09F"
    },

    // 按钮边框颜色
    bdColor: {
      type: String,
      default: "#0FB190"
    },

    // 按钮字体颜色
    textColor: {
      type: String,
      default: "#fff"
    },

    // 按钮字体大小
    textSize: {
      type: String,
      default: "13px"
    },

    // 控制loading
    loading: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="less" scoped>
.btn {
  min-width: 84px;
  height: 36px;
  font-size: @fontsize-middle;
}
</style>