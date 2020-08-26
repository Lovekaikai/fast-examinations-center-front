<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App',
    created() {
      this.$store.commit('initUser')  // 初始化用户信息
    }
}
</script>

<style lang="less">
@import "~assets/style/style.less";  // 引入全局样式
#app {
    height: 100%;
}

/* 美化滚动条样式 */
::-webkit-scrollbar-track {
  background: rgba(0,0,0,.1);
  border-radius: 0;
}
::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0,0,0,.25);
  transition: color .2s ease;
}
</style>
