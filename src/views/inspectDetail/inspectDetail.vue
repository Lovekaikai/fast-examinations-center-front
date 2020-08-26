<template>
  <div class="inspect-detail">
    <div class="main">
      <!-- 详情前提  start-->
      <div class="inspect-premise">
        <div class="premise-item">
          <div class="item-title">生成检验结果时间:</div>
          <div class="item-desc">{{detail.createTime}}</div>
        </div>
        <div class="premise-item" ref="account">
          <div class="item-title">检验人员:</div>
          <div class="item-desc">{{detail.account || '暂无'}}</div>
        </div>
        <!-- <div class="premise-item">
          <div class="item-title">管理点(实验室):</div>
          <div class="item-desc">{{detail.site}}</div>
        </div> -->
        <div class="premise-item">
          <div class="item-title">检验结果:</div>
          <div class="item-desc">
            <span :style="{color: detail.isQualified === '合格' ? '#10E800' : '#E60000' }">
              {{detail.isQualified}}
            </span>
          </div>
        </div>
      </div>
      <!-- 详情前提  end-->

      <!-- 检验明细  start-->
      <div class="inspect-list">
        <div class="title">检验明细</div>
        <div class="content">
          <div class="header">
            <div class="goodName">参检商品:<span>{{detail.categoryName}}</span></div>
            <div class="condition">
              <span v-if="!detail.preCondition">无前提条件</span>
              <span v-else>前提条件： {{detail.preCondition}}</span>
            </div>
            <!-- <my-button btn-text="视频链接"></my-button> -->
          </div>
          <div style="color:#1CC09F;font-weight:bold;margin-bottom:10px">检验标准： <span>{{detail.standardName}}</span></div>
          <div class="tatble">
            <Table :columns="columns" :data="tableData">
              <template slot="isQualified" slot-scope="{row}">
                <span :style="{color: row.isQualified === '合格' ? '#05E600' : '#ED0000'}">
                  {{row.isQualified}}
                </span>
              </template>
            </Table>
          </div>
        </div>
      </div>
      <!-- 检验明细  end-->
    </div>
  </div>
</template>

<script>
import MyButton from "components/myButton/MyButton.vue"
export default {
  name: "inspect-detail",
  components: {
    MyButton
  },
  data() {
    return {
      // 表格的列表标题
      columns: [
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center"
        },
        {
          title: "检验项目",
          key: "projectName"
        },
        {
          title: "限量值",
          key: "restrictValue"
        },
        {
          title: "实际测出数值",
          key: "realityValue"
        },
        {
          title: "检验方法",
          key: "methodName"
        },
        {
          title: "是否合格",
          slot: "isQualified",
          width: 120
        }
      ],
      detail: {},  // 详情数据
      // 检验明细数据
      tableData: []
    };
  },
  mounted() {
    console.log(this.$route);
     let { paramObj } = this.$route.params
     if(paramObj) {
      paramObj = JSON.parse(paramObj)
      this.getMergeDetail(paramObj.batchNo)
      if(paramObj.roleId != 3) {
        this.$refs.account.parentNode.removeChild(this.$refs.account) // 如果没有 则移除该元素
      }
    }else {
      this.$router.push({name: 'data-report'})
    }
  },
  methods: {
    // 获取合并明细
    async getMergeDetail(batchNo) {
      const res = await this.$post('/fdp/drdc/getMergeDetail',{batchNo})
      this.detail = res
      this.tableData = res.cirVoList
      console.log(res)
    }
  }
};
</script>

<style lang="less" scoped>
.inspect-detail {
  .main {
    background: @color-white;
    padding: 28px 25px 40px;
    margin-bottom: 30px;

    // 详情前提  start
    .inspect-premise {
      .premise-item {
        display: inline-block;
        width: 25%;
        padding-right: 10px;
        .item-title {
          font-weight: bold;
          margin-bottom: 16px;
        }
        .item-desc {
          font-size: @fontsize-small-s;
          color: @color-grey-s;
        }
      }
    }
    // 详情前提  end

    // 检验明细  start
    .inspect-list {
      margin-top: 80px;
      .title {
        font-size: @fontsize-large;
        font-weight: bold;
        margin-bottom: 25px;
        letter-spacing: 1px;
      }
      .content {
        .header {
          margin-bottom: 30px;
          .goodName,
          .condition {
            display: inline-block;
            font-weight: bold;
          }
          .goodName > span {
            margin-left: 18px;
          }
          .condition {
            margin: 0 66px;
          }
        }
      }
    }
    // 检验明细  end
  }
}
</style>
<style lang="less" scoped>
/deep/.ivu-table {
  font-size: @fontsize-small-s !important;
}
</style>