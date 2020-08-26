<template>
    <div class="category-list">
        <div class="main">
            <!-- 数据筛选 -->
            <div class="data-filter">
                <div class="title">数据筛选</div>
                <div class="content">
                    <div class="input-wrap">
                      <div class="desc">商品名称：</div>
                      <Input v-model="filterParam.goodsName" @input.native="handleInput" @on-clear="initClassifyList()" clearable placeholder="请输入" />
                    </div>
                    <div class="input-wrap">
                      <div class="desc">类别名：</div>
                      <Input v-model="filterParam.category" @input.native="handleInput" @on-clear="initClassifyList()" clearable placeholder="请输入" />
                    </div>
                    <div class="input-wrap">
                      <div class="desc">日期：</div>
                      <DatePicker @on-change="handlePicker" type="datetimerange" format="yyyy-MM-dd HH:mm" placement="bottom-end" placeholder="请选择日期" style="width:100%"></DatePicker>
                    </div>
                </div>
            </div>
            <!-- 检验标准列表   -->
            <div class="data-list">
                <div class="current-description">检验标准：{{routeParams.description}}</div>
                <div class="content">
                    <Table :columns="columns" :data="tableData">
                        <template slot="operation" slot-scope="{row}">
                          <span class="operation-item" @click="jumpToCategoryDetail(row)">查看详情</span>
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
  name: "category-list",
  components: {
    MyButton,
    Pagination
  },
  data() {
    return {
      // 筛选的参数
      filterParam: {
        standardId: "",  // 检测标准id
        goodsName: "",  // 商品名称
        category: "", // 类别名
        startTime: "", // 开始日期
        endTime: "" // 结束日期 
      },
      pageNum: 1,
      pageSize: 10,
      total: 0, // 数据总条数
      // 表格的列表标题
      columns: [
        {
          title: "商品名称",
          key: "goodsName"
        },
        {
          title: "所属类别",
          key: "category"
        },
        {
          title: "创建时间",
          key: "createTime"
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
      routeParams: {}  // 存储路由信息
    };
  },
  created() {
    console.log(this.$route)
    let { paramObj } = this.$route.params
    if(paramObj) {
      this.routeParams = JSON.parse(paramObj)
      this.filterParam.standardId = this.routeParams.id
      this.getClassifyList()
    }else {
      this.$router.push({name: 'standard-inspec'})
    }
    console.log(this.routeParams)
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
    initClassifyList() {
      this.pageNum = 1
      this.getClassifyList()
    },

    // 获取品类列表数据
    async getClassifyList() {
      let params = this.initParams(this.filterParam)
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      const res = await this.$get('/fdp/detectionStandard/listClassify',params)
      this.tableData = res.records
      this.total = res.total
    },

    // 监听商品名称 / 类别名输入
    handleInput() {
      clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        this.initClassifyList()
      },300)
    },

    // 选择日期
    handlePicker(date) {
      console.log(date);
      for(let item of date) {
        if(!item) {
          this.filterParam.startTime = item
          this.filterParam.endTime = item
        }else {
          this.filterParam.startTime = date[0]
          this.filterParam.endTime = date[1]
        }
      }
      this.initClassifyList()
    },

    // 点击查看详情
    jumpToCategoryDetail(row) {
      let paramObj = {classifyId: row.classifyId,standardId:this.routeParams.id}
      paramObj = JSON.stringify(paramObj)
      this.$router.push({name: 'category-detail',params:{paramObj}})
    },

    // 改变页码
    handlePageNum(val) {
      this.pageNum = val
      this.getClassifyList()
    },

    // 改变页容量
    handlePageSize(val) {
      this.pageSize = val
      this.initClassifyList()
    }
  }
};
</script>

<style lang="less" scoped>
.category-list {
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
          width: 26%;
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
      .current-description {
        font-size: @fontsize-middle;
        color: @theme-color;
        font-weight: bold;
        margin-bottom: 22px;
      }
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
