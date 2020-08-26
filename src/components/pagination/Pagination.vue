<template>
  <div class="pagination">
    <Page :total="total" 
    :current="current"
    :page-size="pageSize"
    show-sizer show-total class="page" 
    :page-size-opts="pageSizeOpts" 
    @on-change="handleChange"
    @on-page-size-change="handlePageSizeChange"
     />
  </div>
</template>

<script>
export default {
  props: {
    // 数据总数
    total: {
      type: Number,
      default: 0
    },
    
    // 每页条数切换的配置
    pageSizeOpts: {
      type: Array,
      default() {
        return [10, 20, 30, 40]
      }
    },

    // 当前的页数
    current: {
      type: Number,
      default: 1
    },

    // 当前页容量
    pageSize: {
      type: Number,
      default: 10
    }
  },
  methods: {
    // 点击改变页码
    handleChange(val) {
      this.$emit('change-pageNum',val)
    },


    //  点击改变页容量
    handlePageSizeChange(val) {
      this.$emit('change-pageSize',val)
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.ivu-page {
  text-align: right;
}
/deep/.ivu-page-total {
  font-size: @fontsize-small;
}
/deep/.ivu-page-next,
/deep/.ivu-page-prev {
  border-radius: 0px;
  border-color: @bdColor-grey-ss;
}

/deep/.ivu-page-item,
/deep/.ivu-select-selection {
  border-radius: 0px;
  border-color: @bdColor-grey-ss;
  a,
  span {
    color: @color-green-s;
    font-size: @fontsize-small-s;
  }
}
/deep/.ivu-page-item-active a,
/deep/.ivu-page-item-active:hover a,
/deep/.ivu-page-next:hover a,
/deep/.ivu-page-prev:hover a {
  color: @color-white;
}
/deep/.ivu-page-item:hover a {
  color: @color-white;
}
/deep/.ivu-page-item-active,
/deep/.ivu-page-item:hover,
/deep/.ivu-page-next:hover,
/deep/.ivu-page-prev:hover {
  background: @btn-bgColor-green;
  border-color: @btn-bdColor-green;
  color: @color-whiteFC;
}
/deep/.ivu-select-item,/deep/.ivu-select-selected-value {
  font-size: @fontsize-small-s!important;
}
/deep/.ivu-select-item-selected,
/deep/.ivu-select-item-selected:hover {
  font-size: @fontsize-small-s;
  color: @color-green-s;
}
</style>