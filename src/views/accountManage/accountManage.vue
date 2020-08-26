<template>
  <div class="account-manage">
    <div class="main">
      <!-- 数据筛选  start -->
      <div class="data-filter">
        <div class="title">数据筛选</div>
        <div class="content">
          <div class="input-wrap">
            <div class="desc">姓名:</div>
            <Input clearable placeholder="请输入" @input.native="handleInput" v-model="filterParam.realName" @on-clear="initAcccoutList()" />
          </div>
          <div class="input-wrap">
            <div class="desc">手机号码:</div>
            <Input clearable placeholder="请输入" @input.native="handleInput" v-model="filterParam.mobile" @on-clear="initAcccoutList()" />
          </div>
          <div class="input-wrap">
            <div class="desc">日期:</div>
            <DatePicker @on-change="handlePicker" type="datetimerange" format="yyyy-MM-dd HH:mm" placement="bottom-end" placeholder="请选择日期" style="width:100%"></DatePicker>
          </div>
          <my-button @click.native="openDialog(false)"></my-button>
        </div>
      </div>
      <!-- 数据筛选  end -->

      <!-- 账号管理列表  start -->
      <div class="account-list">
        <div class="title">账号管理列表</div>
        <div class="content">
          <Table :columns="columns" :data="tableData">
            <template slot="accountStatus" slot-scope="{row}">
              <span :style="{color: !row.accountStatus ? '#ED0000' : '#10E800'}">{{!row.accountStatus ? '无效' : '有效'}}</span>
            </template>
            <template slot="operation" slot-scope="{row}">
              <i-switch v-model="row.accountStatus" @on-change="handleSwitch(row)"
               true-color="#1CC09F" false-color="#ccc" size="large" :true-value="1" :false-value="0">
                  <span slot="open">正常</span>
                  <span slot="close">禁用</span>
              </i-switch>
              <span class="operation-item" @click="openDialog(row)">编辑</span>
            </template>
          </Table>
        </div>
      </div>
      <!-- 员工账号列表  end -->
    </div>

    <!-- 新建/编辑的对话框 -->
    <Modal :title="dialogTitle" v-model="isShowDialog" width="400" class-name="vertical-center-modal" class="modal">
      <Form :model="dialogParam" label-position="top">
        <FormItem label="姓名: ">
          <Input v-model="dialogParam.realName" placeholder="请输入" />
          <div class="error">{{dialogParamError.realNameError}}</div>
        </FormItem>
        <FormItem label="手机号码: " style="margin:30px 0">
          <Input v-model="dialogParam.mobile" placeholder="请输入" />
          <div class="error">{{dialogParamError.mobileError}}</div>
        </FormItem>
         <FormItem label="账号名: ">
          <Input v-model="dialogParam.account" :disabled="dialogTitle === '编辑账号'" placeholder="请输入" />
          <div class="error">{{dialogParamError.accountError}}</div>
        </FormItem>
      </Form>
      <div slot="footer" class="footer">
        <my-button class="saveBtn" btnText="保 存" :loading="loading" @click.native="handleSave"></my-button>
        <my-button btnText="取 消" bgColor="#D9534F" bdColor="#D43F3A" @click.native="isShowDialog=false"></my-button>
      </div>
    </Modal>

    <!-- 分页  start -->
    <pagination :total="total" :current="pageNum" :page-size="pageSize" @change-pageNum="handlePageNum" @change-pageSize="handlePageSize"></pagination>
    <!-- 分页 end -->
  </div>
</template>

<script>
import MyButton from "components/myButton/MyButton.vue";
import MySwitch from 'components/mySwitch/MySwitch.vue';
import Pagination from "components/pagination/Pagination.vue";
export default {
  name: "account-manage",
  components: {
    MyButton,
    MySwitch,
    Pagination
  },
  data() {
    return {
      // 筛选的参数
      filterParam: {
        realName: "",  // 用户姓名
        mobile: "",  // 用户手机号码
        startDate: "", // 开始日期
        endDate: "" // 结束日期 
      },
      pageNum: 1,
      pageSize: 10,
      total: 0, // 数据总条数
      loading: false,
      // 表格的列表标题
      columns: [
        {
          title: "姓名",
          key: "realName"
        },
        {
          title: "账号名称",
          key: "account"
        },
        {
          title: "手机号码",
          key: "mobile"
        },
        {
          title: "状态",
          slot: "accountStatus"
        },
        {
          title: "创建日期",
          key: "createTime"
        },
        {
          title: "操作",
          slot: "operation"
        }
      ],
      tableData: [],
      isShowDialog: false, // 控制是否弹出禁止弹窗
      dialogTitle: "新建账号",
      dialogParam: {  // 弹窗参数 
        realName: "",  // 用户姓名
        mobile: "", // 用户手机号码
        account	: ""  // 用户账号名称
      },
      accountId: null,  // 账号id
      dialogParamError: { // 弹窗参数校验提示
        realNameError: "",
        mobileError: "",
        accountError: "",
      },
      timer: null
    };
  },
  created() {
    this.getAcccoutList()
  },
  methods: {
    // 初始化参数
    initParams(obj) {
      let params = {};
			for (let key in obj) {
				if (obj[key]) {
					params[key] = obj[key];
				}
			}
			return params;
    },

    // 初始化列表
    initAcccoutList() {
      this.pageNum = 1
      this.getAcccoutList()
    },

    // 获取账号列表
    async getAcccoutList(){
      let params = this.initParams(this.filterParam)
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      const res = await this.$post('/fdp/userAccount/list',params)
      this.tableData = res.records
      this.total = res.total
    },

    // 监听输入姓名/手机号码
    handleInput() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.initAcccoutList()
      },300)
    },

    // 选择日期
    handlePicker(date) {
      for(let item of date) {
        if(!item) {
          this.filterParam.startDate = item
          this.filterParam.endDate = item
        }else {
          this.filterParam.startDate = date[0]
          this.filterParam.endDate = date[1]
        }
      }
      this.initAcccoutList()
    },

    // 打开对话窗
    openDialog(row) {
      this.isShowDialog = true;
      this.dialogTitle = !row ? "新建账号" : "编辑账号"
      for(let key in this.dialogParamError) {
        this.dialogParamError[key] = ""
      }
      for(let key in this.dialogParam) {
        this.dialogParam[key] = ""
      }
      if(row) { // 编辑赋值
        this.dialogParam.realName = row.realName
        this.dialogParam.mobile = row.mobile
        this.dialogParam.account = row.account
        this.dialogParam.accountId = row.accountId
      }
    },

    // 切换开关
    async handleSwitch(row) {
      console.log(row);
      let param = {
        accountStatus: row.accountStatus,
        id: row.accountId
      }
      let type;
      const res = await this.$post('/fdp/userAccount/updateStatus',param)
      type = res === '账号禁止' ? 'error' : 'success'
      this.$Message[type]({ background: true, content: res});
      this.getAcccoutList()
    },


    // 验证表单
    validForm() {
      const { realName, mobile, account } = this.dialogParam
      let { realNameError, mobileError, accountError } = this.dialogParamError
      realNameError = !realName.toString().trim() ? '请输入姓名' : ''
      
      // 手机验证
      if (mobile.toString().trim()) {
        if (/^([0-9]{3,4})?[0-9]{7,8}$|^([0-9]{3,4}-)?[0-9]{7,8}$/.test(mobile)) {
          mobileError = ''
        } else {
          mobileError = '请输入正确的手机号码'
        }
      }else {
        mobileError = '请输入手机号码'
      }
      
      // 账号验证
      if (account.toString().trim()) {
        if (/[\u4E00-\u9FA5]/g.test(account)) {
          accountError = '账号名不能含有中文'
        } else {
          accountError = ''
        }
      } else {
        accountError = '请输入账号名'
      }
      this.dialogParamError = {realNameError,mobileError,accountError} // 重新赋值
      return !realNameError && !mobileError && !accountError
    },

    // 点击保存
    async handleSave() {
      let result = this.validForm()
      let requestUrl = '/fdp/userAccount/'
      if(result) {
        let params = this.initParams(this.dialogParam)
        requestUrl = this.dialogTitle === '新建账号' ? `${requestUrl}addAccount` : `${requestUrl}updateAccount`
        this.loading = true
        if(this.dialogTitle === '编辑账号') {
          delete params.account
        }
        try {
          const res = await this.$post(requestUrl,params)
          this.loading = false
          this.$Message.success({ background: true, content: res})
          this.isShowDialog = false
          if(this.dialogTitle === '编辑账号') {
            this.getAcccoutList()
          }else {
            this.initAcccoutList()  // 重新加载数据
          }
        }catch(err) {
          this.loading = false
        }
      }
    },

    // 改变页码
    handlePageNum(val) {
      console.log(val);
      this.pageNum = val
      this.getAcccoutList()
    },

    // 改变页容量
    handlePageSize(val) {
      this.pageSize = val
      this.initAcccoutList()
    }
  }
};
</script>

<style lang="less" scoped>
.account-manage {
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
        .input-wrap {
          display: inline-block;
          margin-right: 40px;
          width: 25%;
          > .desc {
            font-weight: bold;
            margin-bottom: 6px;
          }
        }
      }
    }
    //  数据筛选  end

    // 账号列表  start
    .account-list {
      margin-top: 48px;
      .content {
        .operation-item {
          color: @color-blue-s;
          text-decoration: underline;
          margin-left: 40px;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    // 账号列表  end
  }
}
</style>

<style lang="less" scoped>
</style>