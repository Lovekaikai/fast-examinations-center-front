<template>
    <div class="standard-inspec">
        <div class="main">
            <!-- 数据筛选 -->
            <div class="data-filter">
                <div class="title">数据筛选</div>
                <div class="content">
                    <div class="input-wrap">
                      <div class="desc">检验标准名：</div>
                      <Input v-model="filterParam.standard" @input.native="handleInput" @on-clear="initStandardList()" clearable placeholder="请输入" />
                    </div>
                    <div class="input-wrap">
                      <div class="desc">日期：</div>
                      <DatePicker @on-change="handlePicker" type="datetimerange" format="yyyy-MM-dd HH:mm" placement="bottom-end" placeholder="请选择日期" style="width:100%"></DatePicker>
                    </div>
                </div>
            </div>
            <!-- 检验标准列表   -->
            <div class="data-list">
                <div class="title-wrap">
                  <div class="title" style="display:inline-block;margin-right:60px">检验标准列表</div>
                  <my-button btn-text="同 步" style="display:inline-block" @click.native="dataSynch" :loading="isDataSynchLoading"></my-button>
                </div>
                <div class="content">
                    <Table :columns="columns" :data="tableData">
                        <template slot="operation" slot-scope="{row}">
                          <span class="operation-item" @click="jumpToCategoryList(row)">查看品类</span>
                        </template>
                    </Table>
                </div>
            </div>
        </div>

        <!-- 分页  start -->
        <pagination :total="total" :current="pageNum" :page-size="pageSize" @change-pageNum="handlePageNum" @change-pageSize="handlePageSize"></pagination>
        <!-- 分页 end -->
    </div>
</template>

<script>
import MyButton from "components/myButton/MyButton.vue";
import Pagination from "components/pagination/Pagination.vue";
export default {
  name: "standard-inspec",
  components: {
    MyButton,
    Pagination
  },
  data() {
    return {
      // 筛选的参数
      filterParam: {
        standard: "",  // 检验标准名
        startTime: "", // 开始日期
        endTime: "" // 结束日期 
      },
      pageNum: 1,
      pageSize: 10,
      total: 0, // 数据总条数
      // 表格的列表标题
      columns: [
        {
          title: "检验标准",
          key: "standard"
        },
        {
          title: "名称",
          key: "description"
        },
        {
          title: "最后修改时间",
          key: "updateTime"
        },
        {
          title: "操作",
          slot: "operation",
          width: 140
        }
      ],
      // 表格数据
      tableData: [],
      timer: null,
      isDataSynchLoading: false
    };
  },
  created() {
    this.getStandardList()
  },

  methods: {
     // 初始参数
    initParams (obj) {
      let params = {};
      for (let key in obj) {
        if (obj[key]) {
          params[key] = obj[key];
        }
      }
      return params;
    },

    // 初始化列表
    initStandardList() {
      this.pageNum = 1
      this.getStandardList()
    },

    async getStandardList() {
      let params = this.initParams(this.filterParam)
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      const res = await this.$get('/fdp/detectionStandard/list',params)
      this.tableData = res.records
      this.total = res.total
    }, 

    // 监听输入标准名
    handleInput() {
      clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        this.initStandardList()
      },300)
    },

    // 选择日期
    handlePicker(date) {
      for(let item of date) {
        if(!item) {
          this.filterParam.startTime = item
          this.filterParam.endTime = item
        }else {
          this.filterParam.startTime = date[0]
          this.filterParam.endTime = date[1]
        }
      }
      this.initStandardList()
    },

    // 点击同步
    async dataSynch() {
      this.isDataSynchLoading = true
      try {
        const res = await this.$get('/fdp/detectionStandard/dataSynch')
        this.getStandardList()
        this.isDataSynchLoading = false
        this.$Message.success(res)
      }catch(err) {
        this.isDataSynchLoading = false
      }
    },

    // 点击查看品类
    jumpToCategoryList(row) {
      console.log(row)
      let paramObj = {id:row.id,description:row.description}
      paramObj = JSON.stringify(paramObj)
      this.$router.push({name: 'category-list',params:{paramObj}})
    },

    // 改变页码
    handlePageNum(val) {
      console.log(val);
      this.pageNum = val
      this.getStandardList()
    },

    // 改变页容量
    handlePageSize(val) {
      console.log(val);
      this.pageSize = val
      this.initStandardList()
    }
  }
};
</script>

<style lang="less" scoped>
.standard-inspec {
  .main {
    background: @color-white;
    padding: 28px 25px 40px;
    margin-bottom: 30px;
    .title {
      font-size: @fontsize-large;
      font-weight: bold;
      margin-bottom: 25px;
      letter-spacing: 1px;
    }
    //  数据筛选  start
    .data-filter {
      .content {
        width: 100%;
        .input-wrap {
          display: inline-block;
          width: 30%;
          margin-right: 60px;
          > .desc {
            font-weight: bold;
            margin-bottom: 6px;
          }
        }
      }
    }
    //  数据筛选  end

    .data-list {
      margin-top: 48px;
      .content {
        .operation-item {
          color: @color-blue-s;
          text-decoration: underline;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
