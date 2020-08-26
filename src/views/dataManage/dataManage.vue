<template>
  <div class="data-manage">
    <div class="main">
      <!-- 数据筛选  start -->
      <div class="data-filter">
        <div class="title">数据筛选</div>
        <div class="content">
          <div class="input-wrap">
            <div class="desc">样品名称：</div>
            <Input @input.native="handleInput" @on-clear="initTableData()" v-model="filterParam.sampleName" clearable placeholder="请输入" />
          </div>
          <!-- <div class="input-wrap">
            <div class="desc">设备号：</div>
            <Input v-model="filterParam.deviceNo" clearable placeholder="请输入" />
          </div>-->
          <div class="input-wrap">
            <div class="desc">样品编号：</div>
            <Input @input.native="handleInput" @on-clear="initTableData()" v-model="filterParam.sampleNumber" clearable placeholder="请输入" />
          </div>
          <div class="input-wrap">
            <div class="desc">检验项目：</div>
            <Input @input.native="handleInput" @on-clear="initTableData()" v-model="filterParam.projectName" clearable placeholder="请输入" />
          </div>
          <div class="input-wrap">
            <div class="desc">检验日期：</div>
            <DatePicker @on-change="handlePicker" type="datetimerange" format="yyyy-MM-dd HH:mm" placement="bottom-end" placeholder="请选择日期" style="width:100%" ></DatePicker>
          </div>
        </div>
      </div>
      <!-- 数据筛选  end -->

      <!-- 数据管理列表  start -->
      <div class="data-list">
        <div class="title">数据管理列表</div>
        <my-button class="saveBtn" btn-text="合成检验结果" @click.native="openCreateDialog" style="margin-bottom:20px"></my-button>
        <div class="content">
          <Table :columns="columns" :data="tableData" @on-select-cancel="handleCancleSelect" @on-selection-change="handleSelectChange">
            <template slot="sampleName" slot-scope="{row}">
              <span :style="{color: !row.sampleName ? '#ED0000' : ''}">{{row.sampleName||'暂无'}}</span>
            </template>
            <template slot="sampleNumber" slot-scope="{row}">
              <span :style="{color: !row.sampleNumber	 ? '#ED0000' : ''}">{{row.sampleNumber ||'暂无'}}</span>
            </template>
            <template slot="receiveTime" slot-scope="{row}">
              <span>{{row.receiveTime || '空'}}</span>
            </template>
            <template slot="operation" slot-scope="{row}">
              <span class="operation-item" @click="openEditDialog(row)">编辑</span>
              <!-- <div class="operation-item" @click="handleCheckDetail(row)">查看详情</div>
              <div class="operation-item" @click="openModal3(row)">检验方法</div>-->
            </template>
          </Table>
        </div>
      </div>
      <!-- 数据管理列表  end -->
    </div>

    <!-- 编辑记录弹窗 -->
    <Modal v-model="editDialog" width="400" title="编辑记录">
      <Form :model="editDialogParam" label-position="top">
        <FormItem label="样品名称: " style="margin-bottom:30px">
          <Input v-model="editDialogParam.sampleName" placeholder="请输入" />
        </FormItem>

        <FormItem label="样品编号: ">
          <Input v-model="editDialogParam.sampleNumber" placeholder="请输入" />
        </FormItem>
      </Form>

      <div slot="footer" style="text-align:center">
        <my-button class="saveBtn" style="margin-right:40px" btn-text="保 存" @click.native="handleEditSave"></my-button>
        <my-button btn-text="取 消" bg-color="#D9534F" bd-color="#D43F3A" @click.native="editDialog=false"></my-button>
      </div>
    </Modal>

    <!-- 合成检验结果弹窗 -->
    <Modal v-model="createDialog" width="40%" title="合成检验结果" class="createDialog">
      <Form label-position="top" style="position:relative">
        <Spin fix v-show="spinLoading">
          <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
        </Spin>
        <FormItem label="检验标准：">
          <Select v-model="createDialogParam.standard" clearable filterable @on-change="changeStandard">
            <Option v-for="item in standardList" :value="item.id" :key="item.id">{{item.description}}</Option>
          </Select>
        </FormItem>

        <FormItem label="检验类目选择：" style="margin:26px 0">
          <div style="font-size:12px;color:#999" v-if="!categoryList">无设置检验类目</div>
          <Select v-else v-model="createDialogParam.category" clearable filterable @on-change="changeCategory">
            <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>

        <FormItem label="检验前提：">
          <div style="font-size:12px;color:#999" v-if="!preConditionList">无设置前提条件</div>
          <Select v-model="compoundParam.standardCategoryPreConditionId" clearable filterable v-else>
            <Option v-for="item in preConditionList" :value="item.pre_condition_id" :key="item.pre_condition_id">{{item.pre_condition_item}}</Option>
          </Select>
        </FormItem>

        <!-- 检验方法 -->
        <div style="font-size:12px;color:#999;margin-top:20px" v-if="!itemInfoList">无设置检验方法</div>
        <div class="methods-list" v-else>
          <div class="methods-item" v-for="item in itemInfoList" :key="item.standardItemId">
            <div class="left-wrap">{{item.standardItemName}}</div>
            <div class="right-wrap">
              <div class="title">检验方法：</div>
              <div class="checkbox">
                <CheckboxGroup v-model="item.itemParam.standardCategoryItemMethodIds" @on-change="handleCheck(item)">
                  <Checkbox style="width:46%;margin-right:10px" v-for="(checkItem,checkIndex) in item.smiVoList"
                    :key="checkIndex" :label="checkItem.standardMethodId" v-model="checkItem.isChecked">{{checkItem.methodName}}</Checkbox>
                </CheckboxGroup>
              </div>
            </div>
          </div>
        </div>
      </Form>

      <div slot="footer" style="text-align:center">
        <my-button :loading="compoundLoading" class="saveBtn" style="margin-right:40px" btnText="保 存" @click.native="compoundResult"></my-button>
        <my-button btnText="取 消" bg-color="#D9534F" bd-color="#D43F3A" @click.native="createDialog=false"></my-button>
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
  name: "data-manage",
  components: {
    MyButton,
    Pagination
  },
  data() {
    return {
      // 筛选的参数
      filterParam: {
        sampleName: "", // 样品名称
        sampleNumber: "", // 样品编号
        projectName: "", // 检测项目
        startTime: "", // 检验开始时间
        endTime: "" // 检验结束时间
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      timer: null,
      compoundLoading: false,
      spinLoading: false,
      // 表格的列表标题
      columns: [
        {
          title: "全选",
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "样品名称",
          slot: "sampleName"
        },
        {
          title: "样品编号",
          slot: "sampleNumber"
        },
        {
          title: "检测项目",
          key: "projectName"
        },
        {
          title: "实际值",
          key: "testValue",
          width: 120
        },
        {
          title: "检验时间",
          key: "testTime"
        },
        {
          title: "上传时间",
          slot: "receiveTime"
        },
        {
          title: "操作",
          slot: "operation",
          width: 120
        }
      ],
      // 表格数据
      tableData: [],
      createDialog: false, // 控制合成检验结果弹窗
      standardList: [], // 检验标准数据
      categoryList: [], // 检验类目数据
      preConditionList: [], // 检验前提条件
      itemInfoList: [], // 检验项目数据
      editDialog: false, // 控制编辑记录窗口
      editDialogParam: {
        // 编辑窗口的参数
        id: "", // 检测原数据id
        sampleName: "", // 样品名称
        sampleNumber: "" // 样品编号
      },
      createDialogParam: {
        standard: "",
        category: ""
      },
      compoundParam: {
        resultDataIds: [], // 检测结果原数据的id数组
        standardCategoryPreConditionId: "", // 前提条件id
        standardCategoryItemParam: []
      },
      selection: []
    };
  },
  created() {
    this.getTableData();
    this.getStandardList();
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

    // 初始化数据列表
    initTableData() {
      this.pageNum = 1;
      this.getTableData();
    },

    // 初始化需要合成检验结果的参数
    initCompoundParam() {
      this.compoundParam.standardCategoryPreConditionId = ""
      this.compoundParam.standardCategoryItemParam = []
    },

    // 获取表格数据
    async getTableData() {
      let params = this.initParams(this.filterParam);
      params.pageNum = this.pageNum;
      params.pageSize = this.pageSize;
      const res = await this.$post("/fdp/drd/backstragePageBycheckPerson",params);
      this.tableData = res.list
      this.tableData.map(item => {
        item._checked = false;
        this.compoundParam.resultDataIds.map(v => {
          if (item.id === v) {
            item._checked = true;
          }
        });
      });
      this.total = res.total;
    },

    // 获取检验标准
    async getStandardList() {
      const res = await this.$get("/fdp/detectionStandard/list?pageNum=1&pageSize=9999");
      console.log(res);
      this.standardList = res.records;
    },

    // 监听输入样品名称/样品编号/检验项目
    handleInput() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.initTableData();
      }, 300);
    },

    // 选择日期
    handlePicker(date) {
      for (let item of date) {
        if (!item) {
          this.filterParam.startTime = item;
          this.filterParam.endTime = item;
        } else {
          this.filterParam.startTime = date[0];
          this.filterParam.endTime = date[1];
        }
      }
      this.initTableData();
    },

    //取消选中某一项时触发
    handleCancleSelect(selection,row){
      let index = this.selection.findIndex(v => v.id === row.id)
      this.selection.splice(index,1)
      console.log(this.selection)
    },


    // 只要选中项发生变化时就会触发
    handleSelectChange(selection) {
      if(selection.length === 0){ // 则代表当页取消全选
      // 此时的tabledata是当页的数据 遍历tableData 寻找 selection id相同的元素 删除
        this.tableData.map(e => {
          let index = this.selection.findIndex(v => v.id === e.id)
          if(index > -1) this.selection.splice(index,1)
        })
      }else {
        selection.map(e => {
          let target = this.selection.find(v => v.id === e.id);  // 防止push重复的数据
          // find 方法如果没有找到符合的元素 返回undefined
          if(!target) this.selection.push(e)
        })
      }
      this.compoundParam.resultDataIds = this.selection.map(item => item.id) 
      console.log(this.compoundParam.resultDataIds)
    },

    // 点击合成检验结果
    openCreateDialog() {
      // 判断是否选择了样品 要做校验
      if (this.compoundParam.resultDataIds.length === 0) return this.$Message.warning({background: true,content: "请选择要合成检验结果的样品"});
      this.createDialog = true;
      // 初始化信息
      for (let key in this.createDialogParam) {
        this.createDialogParam[key] = "";
      }
      this.spinLoading = false;
      this.initCompoundParam();
      this.categoryList = [];
      this.preConditionList = [];
      this.itemInfoList = [];
    },

    // 点击编辑
    openEditDialog(row) {
      this.editDialogParam.id = row.id;
      this.editDialogParam.sampleName = row.sampleName;
      this.editDialogParam.sampleNumber = row.sampleNumber;
      this.editDialog = true;
    },

    // 点击编辑保存
    async handleEditSave() {
      let params = this.initParams(this.editDialogParam);
      const res = await this.$post("/fdp/drd/modify", params);
      this.$Message.success({ background: true, content: res });
      this.getTableData(); // 重新加载数据
      this.editDialog = false;
    },

    //选择检验标准
    async changeStandard(id) {
      if (!this.createDialogParam.standard) return; // 如果不校验则会报错
      this.spinLoading = true;
      try {
        const res = await this.$get(`/fdp/dsc/categorysByStandardId/${id}`);
        this.categoryList = res;
        this.spinLoading = false;
        if (this.categoryList.length === 0) {
          this.categoryList = "";
          this.preConditionList = "";
        } else {
          this.preConditionList = [];
        }

        // 还要初始化以下的条件
        this.createDialogParam.category = "";
        this.itemInfoList = [];
        this.initCompoundParam();
      } catch (err) {
        this.spinLoading = false;
      }
    },

    // 获取检验前提 和 检验项目
    async changeCategory(id) {
      if (!this.createDialogParam.category) return; // 如果不校验则会报错
      this.spinLoading = true;
      try {
        const res = await this.$get(`/fdp/dsi/standardItemInfoByStandardCategoryId/${id}`);
        this.spinLoading = false;
        this.preConditionList = res.preConditionList;
        if (this.preConditionList[0] == "" || this.preConditionList.length === 0)
        this.preConditionList = "";
        this.itemInfoList = res.itemInfoList;
        if (this.itemInfoList.length === 0 || this.itemInfoList[0] == "") {
          this.itemInfoList = "";
        } else {
          this.itemInfoList.map(item => {
            item.itemParam = {
              standardCategoryItemId: item.standardItemId,
              standardCategoryItemMethodIds: []
            };
            item.smiVoList.map(v => {
              v.isChecked = false;
            });
          });
        }

        // 要初始化以下的条件
        this.initCompoundParam();

        console.log(this.itemInfoList);
      } catch (err) {
        this.spinLoading = false;
      }
    },

    // 选择检测类别下检测项下检测方法
    handleCheck(item) {
      console.log(item);
      item.itemParam.standardCategoryItemMethodIds = item.smiVoList.filter(v => v.isChecked).map(v => v.standardMethodId);
      // this.compoundParam.standardCategoryItemParam.standardCategoryItemId = item.standardItemId
      // this.compoundParam.standardCategoryItemParam.standardCategoryItemMethodIds = item.smiVoList.filter(v => v.isChecked).map(v => v.standardMethodId)
    },

    // 合成检验结果
    async compoundResult() {
      // 需要做校验
      if (!this.categoryList || !this.itemInfoList) return this.$Message.warning({background: true,content: "请选择完善的检验标准"});
      this.compoundParam.standardCategoryItemParam = [];
      this.itemInfoList.map(item => {
        this.compoundParam.standardCategoryItemParam.push(item.itemParam);
      });
      const { standard, category } = this.createDialogParam;
      const { standardCategoryPreConditionId } = this.compoundParam;
      if (!standard) return this.$Message.warning({background: true,content: "请选择检验标准"});
      if (!category) return this.$Message.warning({background: true,content: "请选择检验类目"});
      if (this.preConditionList && !standardCategoryPreConditionId) return this.$Message.warning({background: true,content: "请选择检验前提"});
      let flag = this.compoundParam.standardCategoryItemParam.some(item => item.standardCategoryItemMethodIds.length === 0);
      if (flag) return this.$Message.warning({background: true,content: "请每个项目至少选择一种检验方法"});

      // console.log(this.compoundParam);
      let params = this.initParams(this.compoundParam);
      this.compoundLoading = true;
      try {
        const res = await this.$post("/fdp/drdc/compoundResult", params);
        this.compoundLoading = false;
        this.createDialog = false;
        this.getTableData();
        this.selection = [] // 初始化数据
        this.compoundParam.resultDataIds = []  // 初始化数据
        this.$Message.success({ background: true, content: res });
      } catch (err) {
        this.compoundLoading = false;
      }
    },

    // 改变页码
    handlePageNum(val) {
      this.pageNum = val;
      this.getTableData();
    },

    // 改变页容量
    handlePageSize(val) {
      this.pageSize = val;
      this.initTableData();
    }
  }
};
</script>

<style lang="less" scoped>
.data-manage {
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

<style lang="less" scoped>
.ivu-modal {
  .ivu-modal-content {
    //  合成检验结果
    .methods-list {
      margin-top: 30px;
      .methods-item {
        font-size: @fontsize-small-s;
        margin-bottom: 20px;
        line-height: 30px;
        color: @color-dark-grey;
        vertical-align: middle;
        .left-wrap {
          display: inline-block;
          width: 10%;
          margin-right: 10px;
          color: @theme-color;
          font-weight: bold;
          font-size: @fontsize-middle;
        }
        .right-wrap {
          display: inline-block;
          width: 88%;
          .title {
            display: inline-block;
            width: 18%;
          }
          .checkbox {
            display: inline-block;
            width: 82%;
            vertical-align: middle;
          }
        }
      }
    }
  }
}

// 复选框的样式
.ivu-checkbox-wrapper {
  font-size: @fontsize-small-s;
  color: @color-dark-grey;
}
</style>