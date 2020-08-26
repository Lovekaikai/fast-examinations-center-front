<template>
    <div class="device-manage">
        <div class="main">
            <!-- 数据筛选 -->
            <div class="data-filter">
                <div class="title">数据筛选</div>
                <div class="content">
                    <div class="input-wrap">
                      <div class="desc">设备号:</div>
                      <Input v-model="filterParam.deviceNo" clearable placeholder="请输入"  @input.native="handleInput" @on-clear="initDeviceList()" />
                    </div>
                    <div class="input-wrap">
                      <div class="desc">检测员名字:</div>
                      <Input v-model="filterParam.inspector" clearable placeholder="请输入" @input.native="handleInput" @on-clear="initDeviceList()" />
                    </div>
                    <my-button @click.native="openCreateDialog"></my-button>
                </div>
            </div>
            <!-- 设备管理列表   -->
            <div class="data-list">
                <div class="title">设备管理列表</div>
                <div class="content">
                    <Table :columns="columns" :data="tableData">
                      <template slot="inspector" slot-scope="{row}">
                        {{!row.inspector ? '空' : row.inspector}}
                      </template>
                      <template slot="deviceStatus" slot-scope="{row}">
                        {{row.deviceStatus | formatStatus}}
                      </template>

                        <template slot="operation" slot-scope="{row}">
                          <span v-if="row.deviceStatus !== 4" class="operation-item" @click="openResetDialog(row,'scrap')">报废</span>
                          <span v-if="row.deviceStatus === 2" class="operation-item" @click="openResetDialog(row,'reset')">重置</span>
                        </template>
                    </Table>
                </div>

            </div>
        </div>
        <!-- 新建设备 -->
        <Modal v-model="createDialog" width="400" title="新建设备" :styles="{top: '20vh'}">
            <Form :model="createDialogParam" label-position="top">
              <FormItem label="设备号: ">
                <Input v-model="createDialogParam.deviceCode" placeholder="请输入设备号" />
                <div class="error">{{createDialogError.deviceCodeError}}</div>
              </FormItem>
            </Form>

            <div slot="footer" style="text-align:center">
              <my-button style="margin-right:40px" btn-text="保 存" @click.native="handleSave"></my-button>
              <my-button btnText="取 消" bg-color="#D9534F" bd-color="#D43F3A" @click.native="createDialog=false"></my-button>
            </div>
        </Modal>

        <!-- 报废 / 重置弹窗提醒 -->
        <Modal v-model="resetDialog" width="400" class="resetDialog" :styles="{top: '20vh'}">
            <div class="content">
              <div class="title-wrap">
                <Icon type="md-information-circle" class="notice-icon" size="30" color="#FFC600" />
                <span>{{resetDialogDesc.title}}</span>
              </div>
              <div class="desc">
                <span style="color:#E60000">{{resetDialogDesc.desc_1}}</span> ,
                <span>{{resetDialogDesc.desc_2}} ?</span>
              </div>
            </div>
            <div slot="footer" style="text-align:center">
              <my-button style="margin-right:40px" btn-text="继 续" @click.native="handleNext"></my-button>
              <my-button btnText="取 消" bg-color="#D9534F" bd-color="#D43F3A" @click.native="resetDialog=false"></my-button>
            </div>
        </Modal>

        <!-- 分页  start -->
        <pagination :total="total" :current="pageNum" :page-size="pageSize" @change-pageNum="handlePageNum" @change-pageSize="handlePageSize"></pagination>
        <!-- 分页 end -->
    </div>
</template>

<script>
import MyButton from "components/myButton/MyButton.vue";
import Pagination from "components/pagination/Pagination.vue";
export default {
  name: "device-manage",
  components: {
    MyButton,
    Pagination
  },
  data() {
    return {
      // 筛选的参数
      filterParam: {
        deviceNo: "",  // 设备号
        inspector: ""  // 检测员名字
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      timer: null,
      // 表格的列表标题
      columns: [
        {
          title: "设备号",
          key: "deviceNo"
        },
        {
          title: "检测员名字",
          slot: "inspector"
        },
        {
          title: "状态",
          slot: "deviceStatus"
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
      createDialog: false,  // 控制新建设备窗口
      createDialogParam: {  // 新建窗口参数
        deviceCode: ""
      },
      createDialogError: {  // 新建窗口参数错误提示
        deviceCodeError: ""
      },
      resetDialog: false,  // 控制重置弹窗显示
      resetDialogDesc: {
        type: '',
        title: '',
        desc_1: '',
        desc_2: ''
      },
      modifyParam: {
        deviceId: "",  // 设备id
        status: ""  // 修改状态
      }
    };
  },
  filters: {
    formatStatus(val) {
      let statusArr = ['未启用','已启用','已绑定','维护中','已报废']
      return statusArr[val]
    }
  },
 
  created() {
    this.getDeviceList()
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

    // 获取设备列表
    async getDeviceList() {
      let params = this.initParams(this.filterParam)
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      const res = await this.$post('/fdp/detectionDevice/view',params)
      console.log(res)
      this.tableData = res.records
      this.total = res.total
    },


    // 初始化列表
    initDeviceList() {
      this.pageNum = 1
      this.getDeviceList()
    },

    // 监听输入设备号
    handleInput() {
      //清除上一次的定时
      clearTimeout(this.timer)

      //设置延时发送请求
      this.timer = setTimeout(() =>{
        this.initDeviceList()
      },300) 
    },

     // 监听输入检测员名字
    handleInputInspector() {
      //清除上一次的定时
      clearTimeout(this.timer)

      //设置延时发送请求
      this.timer = setTimeout(() =>{
        this.initDeviceList()
      },300) 
    },

    // 点击新建
    openCreateDialog() {
      // 初始化
      for(let key in this.createDialogParam) {
        this.createDialogParam[key] = ""
      }
       for(let key in this.createDialogError) {
        this.createDialogError[key] = ""
      }
      this.createDialog = true
    },
 
    // 点击新建窗口保存
    async handleSave() {
      const { deviceCode } = this.createDialogParam
      if(!deviceCode.toString().trim()) {
        this.createDialogError.deviceCodeError = '请输入设备编号'
      }else {
        // 检测是否含有中文
        if (/[\u4E00-\u9FA5]/g.test(deviceCode)) {
          this.createDialogError.deviceCodeError = '设备编号不能含有中文'
        }else {
          this.createDialogError.deviceCodeError = ''
        }
      }
      
      if(!this.createDialogError.deviceCodeError) {
       try {
        const res = await this.$get('/fdp/detectionDevice/create',this.createDialogParam)
        console.log(res)
        this.createDialog = false
        this.$Modal.success({title: res});
        this.initDeviceList()
       }catch(err) {
          this.$Modal.error({title: '设备号已被使用'});
       }
      }
    },

    // 点击报废/重置打开弹窗
    openResetDialog(row,type) {
      let dialogDesc;
      if(type === 'reset') { // 重置
        dialogDesc = {
          type: 'reset',
          title: '重置该设备为空闲',
          desc_1: '重置后该设备不绑定检验员',
          desc_2: '你还要继续吗'
        }
        this.modifyParam.status = 1 // 重置 status传1
      }else if(type === 'scrap') {  // 报废
        dialogDesc = {
          type: 'scrap',
          title: '报废提醒',
          desc_1: '此操作将会报废该设备',
          desc_2: '是否继续'
        }
        this.modifyParam.status = 4 // 报废 status传4
      } 
      this.resetDialogDesc = {...dialogDesc}
      this.modifyParam.deviceId = row.id
      this.resetDialog = true
    },

    // 点击报废
    handleScrap() {
      let dialogDesc = {
        type: 'scrap',
        title: '报废提醒',
        desc_1: '此操作将会报废该设备',
        desc_2: '是否继续'
      }
      this.resetDialogDesc = {...dialogDesc}
      this.resetDialog = true
      console.log('点击了报废')
    },

    // 点击报废/重置窗口继续
    async handleNext() {
      const res = await this.$get('/fdp/detectionDevice/modify',this.modifyParam)
      this.$Message.success({backgroud: true,content: res})
      this.resetDialog = false
      this.getDeviceList()
    },

    // 改变页码
    handlePageNum(val) {
      this.pageNum = val
      this.getDeviceList()
    },

    // 改变页容量
    handlePageSize(val) {
      this.pageSize = val
      this.initDeviceList()
    }
  }
};
</script>

<style lang="less" scoped>
.device-manage {
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
          margin-right: 20px;
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
<style lang="less" scoped>
.resetDialog {
  .ivu-modal {
    .ivu-modal-body {
      .content {
        color: #333;
        .title-wrap {
          text-align: center;
          padding-top: 20px;
          .notice-icon {
            vertical-align: middle;
            position: relative;
            top: -2px;
            margin-right: 14px;
          }
          >span {
            font-weight: bold;
            letter-spacing: 2px;
            font-size: @fontsize-large;
          }
        }
        .desc {
          text-align: center;
          padding-top: 40px;
          letter-spacing: 1px;
        }
      }
    }
  }
}
</style>