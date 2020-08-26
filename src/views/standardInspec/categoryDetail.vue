<template>
  <div class="category-detail">
    <div class="main">
      <!-- 上部分 -->
      <div class="top-wrap">
        <!-- 蔬菜类<span style="margin:0 10px">—</span>土豆 -->
        <div class="name-info">{{classifyInfo.classifyName}}</div>
        <div class="image-wrap">
          <img v-for="(item,index) in classifyInfo.classifyImg" :key="index" :src="item" alt="" @click="previewImage(item)">
        </div>
        <div class="standard-info">
          <div class="group description">
            <div class="title">检验标准：</div>
            <div class="desc">{{classifyInfo.standardCode}}</div>
          </div>
          <div class="group standard">
            <div class="title">名称：</div>
            <div class="desc">{{classifyInfo.goodName}}</div>
          </div>
          <!-- <div class="group config">
            <div class="title">检验前提条件：</div>
            <div class="desc">ph<==5.5ph<==5.5ph<==5.5ph<==5.5ph<==5.5</div>
          </div> -->
        </div>
      </div>


      <!-- 下部分 -->
      <div class="down-wrap">
        <div class="config-group" v-for="(item,index) in classifyInfo.standardItems" :key="index">
          <div class="config-title" v-if="item.preCondition">检验前提条件： {{item.preCondition}}</div>
          <Table :columns="columns" :data="item.preDetectionItems"></Table>
        </div>
      </div>
    </div>

    <!-- 预览的弹窗 -->
    <el-dialog :visible.sync="previewModal">
      <div style="margin:-60px -20px -37px">
        <img style="width:100%" :src="previewUrl" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'category-detail',
  data() {
    return {
      columns: [{
        type: 'index',
        title: '序号',
        width: 150,
      },{
        title: '检验项目',
        key: 'detectionItemName'
      },{
        title: '限量值',
        key: 'limitValue'
      },{
        title: '检验方法',
        key: 'detectionMethod'
      }],
      tableData: [],
      classifyInfo:{},
      routerParam: {},  // 存储路由信息
      requestParams:{
        classifyId:'',
        standardId:''
      },
      previewModal: false,  // 控制预览图的显现
      previewUrl: ""   // 预览图片路径
    }
  },
  created(){
    // this.getCategoryDetail()
    console.log(this.$route)
    let { paramObj } = this.$route.params
     if(paramObj) {
      paramObj = JSON.parse(paramObj)
      this.requestParams.classifyId = paramObj.classifyId
      this.requestParams.standardId = paramObj.standardId
      this.getCategoryDetail()
    }else {
      this.$router.push({name: 'standard-inspec'})
    }
  },
  methods:{
    async getCategoryDetail(){
     const res = await this.$get('/fdp/detectionStandard/getClassifyDetail',this.requestParams)
     console.log(res)
     this.classifyInfo = res
    },

    // 点击预览
    previewImage(url) {
      this.previewModal = true
      this.previewUrl = url
    }
  }
}
</script>

<style lang="less" scoped>
.category-detail {
  .main {
    background: @color-white;
    padding: 28px 30px 40px;
    margin-bottom: 30px;
    height: 100%;
    color: @color-dark-grey;
    .top-wrap {
      margin-bottom: 35px;
      .name-info {
        font-size: @fontsize-middle;
        margin-bottom: 23px;
        font-weight: bold;
      }
      .image-wrap {
        display: flex;
        flex-wrap: wrap;
        >img {
          width: 132px;
          height: 132px;
          margin:0 20px 20px 0;
          &:hover { 
            cursor: pointer;
          }
        }
      }
      .standard-info {
        display: flex;
        width: 80%;
        margin-top: 10px;
        .group {
          flex: 1;
          margin-right: 30px;
          .title {
            font-weight: bold;
            margin-bottom: 18px;
          }
          .desc {
            color: @color-grey-s;
            font-size: @fontsize-small-s;
          }
        }
      }
    }

    .down-wrap {
      .config-group {
        margin-bottom: 55px;
        .config-title {
          font-size: @fontsize-middle;
          color: @theme-color;
          font-weight: bold;
          margin-bottom: 16px;
          letter-spacing: 1px;
        }
      }
    }
  }
}
</style>