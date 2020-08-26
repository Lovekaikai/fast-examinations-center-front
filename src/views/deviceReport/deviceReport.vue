<template>
    <div class="device-report">
        <div class="main">
            <!-- 设备管理列表   -->
            <div class="data-list">
                <div class="title">设备管理列表</div>
                <div class="content">
                    <Table :columns="columns" :data="tableData">
                      <template slot="inspector" slot-scope="{row}">
                        {{!row.inspector ? '空' : row.inspector}}
                      </template>

                      <template slot="deviceStatus" slot-scope="{row}">
                        <span v-if="!row.inspector && row.deviceStatus === 1" @click="openDialog(row)" style="color:#0072F2;text-decoration:underline;cursor: pointer">
                          选中
                        </span>
                        <span v-else :style="{color: row.deviceStatus === 2 || row.deviceStatus === 3 ? '#00F21C' : '#E60000'}">{{row.deviceStatus | formatDeviceStatus}}</span>
                      </template>
                    </Table>
                </div>

            </div>
        </div>
        <!-- 分页  start -->
        <pagination :total="total" :current="pageNum" :page-size="pageSize" @change-pageNum="handlePageNum" @change-pageSize="handlePageSize"></pagination>
        <!-- 分页 end -->

         <!-- 选中 绑定 弹窗 -->
        <Modal v-model="showDialog" width="400" class="resetDialog" :styles="{top: '20vh'}">
            <div class="content">
              <div class="title-wrap">
                <Icon type="md-information-circle" class="notice-icon" size="30" color="#FFC600" />
                <span>绑定该设备提示</span>
              </div>
              <div class="desc">
                <span style="color:#E60000">此操作将绑定该设备</span> ,
                <span>是否继续 ?</span>
              </div>
            </div>
            <div slot="footer" style="text-align:center">
              <my-button style="margin-right:40px" btn-text="继 续" @click.native="handleNext"></my-button>
              <my-button btnText="取 消" bg-color="#D9534F" bd-color="#D43F3A" @click.native="showDialog=false"></my-button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Pagination from "components/pagination/Pagination.vue";
import MyButton from "components/myButton/MyButton.vue";
export default {
  name: "device-report",
  components: {
    Pagination,
    MyButton
  },
  data() {
    return {
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
          title: "操作",
          slot: "deviceStatus",
          width: 140
        }
      ],
      // 表格数据
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      showDialog: false,  // 控制选中绑定 弹窗
      deviceId: null  // 设备id
    };
  },
  created() {
    this.getTableData()
  },
  filters: {
    formatDeviceStatus(val) {
      let arr = ['使用中','维护中','已报废']
      return arr[val-2]
    }
  },
  methods: {
    // 获取设备列表
    async getTableData() {
      let params = {}
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      const res = await this.$post('/fdp/detectionDevice/view',params)
      console.log(res)
      this.tableData = res.records
      this.total = res.total
    },

    // 点击选中
    async openDialog(row) {
      this.deviceId = row.id
      this.showDialog = true
    },

    // 点击选中 窗口继续
    async handleNext() {
      const res = await this.$get(`/fdp/detectionDeviceLog/bounds?deviceId=${this.deviceId}`)
      this.$Message.success({background: true, content: res})
      this.showDialog = false
      this.getTableData()
    },
    
    // 改变页码
    handlePageNum(val) {
      this.pageNum = val
      this.getTableData()
    },

    // 改变页容量
    handlePageSize(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getTableData()
    }
  }
};
</script>

<style lang="less" scoped>
.device-report {
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

    .data-list {
      .content {
        .operation-item {
          margin-right: 20px;
          color: @color-blue-s;
          text-decoration: underline;
          &:hover {
            cursor: pointer;
          }
        }
        .useing {
          color: #00F21C;
        }
        .empty {
          color: #0072F2;
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