<template>
  <div class="data-report">
    <div class="main">
      <!-- 数据筛选  start -->
      <div class="data-filter">
        <div class="title">数据筛选</div>
        <div class="content">
          <div class="input-wrap">
            <div class="desc">检验商品/类别名：</div>
            <Input v-model="filterParam.categoryName" @input.native="handleInput" @on-clear="initTableData()" clearable placeholder="请输入" />
          </div>
          <div class="input-wrap" ref="accout">
            <div class="desc">参检人员：</div>
            <Input v-model="filterParam.account" @input.native="handleInput" @on-clear="initTableData()" clearable placeholder="请输入" />
          </div>
           <div class="input-wrap">
            <div class="desc">上传状态：</div>
            <Select v-model="filterParam.pushStatus" @on-change="initTableData()" clearable>
              <Option v-for="item in pushStatusList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </div>
          <div class="input-wrap">
            <div class="desc">生成检验结果日期：</div>
            <DatePicker @on-change="handlePicker" type="datetimerange" format="yyyy-MM-dd HH:mm" placement="bottom-end" placeholder="请选择日期" style="width:100%"></DatePicker>
          </div>
          <div class="input-wrap">
            <div class="desc">检验结果：</div>
            <Select v-model="filterParam.isQualified" @on-change="initTableData()" clearable>
              <Option v-for="item in resultList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </div>
        </div>
      </div>
      <!-- 数据筛选  end -->

      <!-- 数据管理列表  start -->
      <div class="data-list">
        <div class="title-wrap">
          <div class="title" style="display:inline-block;margin-right:60px">数据管理列表</div>
          <my-button btn-text="上 传" :loading="pushLoading" @click.native="handlePush" style="display:inline-block;"></my-button>
        </div>
        <div class="content">
          <Table :columns="columns" :data="tableData" @on-select-cancel="handleCancleSelect" @on-selection-change="handleSelectChange">
            <template slot="resultIsQualified" slot-scope="{row}">
              <span :style="{'color': row.resultIsQualified === '合格' ? '#05E100' : '#ED0000'}">{{row.resultIsQualified}}</span>
            </template>
             <template slot="account" slot-scope="{row}">
              <span>{{row.account ? row.account : '空'}}</span>
            </template>
            <template slot="pushStatus" slot-scope="{row}">
              <span :style="{'color': row.pushStatus ? '#05E100' : '#ED0000'}">{{row.pushStatusCN}}</span>
            </template>
            <template slot="operation" slot-scope="{row}">
              <span class="operation-item" @click="jumpToInspectDetail(row)" style="margin-right:15px">查看详情</span>
              <!-- <span class="operation-item">上传</span> -->
            </template>
          </Table>
        </div>
      </div>
      <!-- 数据管理列表  end -->
    </div>


    <!-- 分页  start -->
    <pagination :total="total" :current="pageNum" :page-size="pageSize" @change-pageNum="handlePageNum" @change-pageSize="handlePageSize"></pagination>
    <!-- 分页 end -->
  </div>
</template>

<script>
import Pagination from "components/pagination/Pagination.vue";
import MyButton from "components/myButton/MyButton.vue";
import { mapState } from 'vuex'

export default {
  name: "data-report",
  components: {
    Pagination,
    MyButton
  },
  data() {
    return {
      roleId: null,  // 角色id
      // 筛选的参数
      filterParam: {
        categoryName: "",  // 检验商品/类别名
        account: "",  // 参检人员
        pushStatus:'',  // 上传状态
        isQualified: "",  // 检验结果
        startTime: "", // 开始日期
        endTime: "" // 结束日期 
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      timer: null,
      // 表格的列表标题
      columns: [
        {type: 'selection',width: 60},
        {title: "检验商品/类别",key: "categoryName"},
        {title: "检验结果",slot: "resultIsQualified",width:120},
        {title: "操作参检人员",slot: "account"},
        {title: "上传状态",slot: "pushStatus",width:120},
        {title: "批次号",key: "batchNo"},
        {title: "生成检验结果时间",key: "createTime"},
        {title: "操作",slot: "operation",width: 120}
      ],
      // 表格数据
      tableData: [],
      pushStatusList: [{value: 0,label: "未上传"},{value: 1,label: "已上传"}],
      pushArr: [], // 需要上传的数据集合
      pushLoading: false, // 上传的loading
      resultList: [ {value: "合格",label: "合格"}, {value: "不合格",label: "不合格"}],
      roleId: ''  // 角色id
    };
  },
  computed: {
    ...mapState({
      userData: state => state.login.userData
    })
  },
  created() {
    this.getTableData()
  },
  mounted() {
    const {role:{roleId}} = this.userData
    this.roleId = roleId
    if(roleId != 3) {
      this.columns = this.columns.filter(v => v.title != "操作参检人员")
      this.$refs.accout.parentNode.removeChild(this.$refs.accout)  // 如果没有 则移除该元素
    }
  },
  methods: {
    // 初始化参数
    initParams(obj) {
      let params = {}
      for(let key in obj) {
        if(obj[key] !== '') {
          params[key] = obj[key]
        }
      }
      return params
    },

    initTableData() {
      this.pageNum = 1
      this.getTableData()
    },

    // 获取列表
    async getTableData() {
      let params = this.initParams(this.filterParam)
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      const res = await this.$post('/fdp/drdc/searchMergeResultList',params)
      console.log(res)
      this.tableData = res.list
      this.total = res.total
      this.tableData.map(item => {
        if(item.pushStatus) item._disabled = true
        item._checked = false;
        this.pushArr.map(v => {
          if (item.batchNo === v.batchNo) {
            item._checked = true;
          }
        });
      });
    },

    // 监听输入类别名
    handleInput(e) {
      // console.log(e)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.initTableData()
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
      this.initTableData()
    },

    // 点击查看详情
    jumpToInspectDetail(row) {
      let paramObj = {
        batchNo:row.batchNo,
        roleId: this.roleId
      }
      paramObj = JSON.stringify(paramObj)
      this.$router.push({name: "inspect-detail",params:{paramObj}})
    },

    // 选择
    handleSelectChange(selection) {
      console.log(selection)
      if(selection.length === 0) { // 则是取消全选
        // 此时的tableData是当前页的数据  遍历tableData 寻找selection id 相同的删除
        this.tableData.map(item => {
          let index = this.pushArr.findIndex(v => v.batchNo === item.batchNo)
          if(index > -1) this.pushArr.splice(index,1)
        })
      }else {
        selection.map(item => {
          let target = this.pushArr.find(v => v.batchNo === item.batchNo)
          if(!target) this.pushArr.push(item)  // 防止push重复的
        })
      }
    },

    // 取消选择
    handleCancleSelect(selection,row) {
      console.log(this.pushArr)
      let index = this.pushArr.findIndex(v => v.batchNo === row.batchNo)
      this.pushArr.splice(index,1)

      console.log(this.pushArr,"pushArr")
    },

    // 点击上传
    async handlePush() {
      if(!this.pushArr.length) return this.$Message.warning({background:true,content: '请选择要上传的检验商品'})
      this.pushLoading = true
      let batchNoArr = this.pushArr.map(v => v.batchNo)
      try {
        const res = await this.$post('/fdp/drdc/mergeDataPush',batchNoArr)
        this.pushLoading = false
        this.getTableData()
        this.$Message.success(res)
        this.pushArr = [] // 初始化
      }catch(err) {
        this.pushLoading = false
      }
    },

    // 改变页码
    handlePageNum(val) {
      this.pageNum = val
      this.getTableData()
    },

    // 改变页容量
    handlePageSize(val) {
      this.pageSize = val
      this.initTableData()
    }
  }
};
</script>

<style lang="less" scoped>
.data-report {
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
          width: 22%;
          display: inline-block;
          margin-right: 32px;
          margin-bottom: 16px;
          > .desc {
            font-weight: bold;
            margin-bottom: 6px;
          }
        }
      }
    }
    //  数据筛选  end

    // 数据管理列表  start
    .data-list {
      margin-top: 48px;
      .content {
        .operation-item {
          padding: 4px 0;
          color: @color-blue-s;
          text-decoration: underline;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    // 数据管理列表  end
  }
}
</style>
