<template>
    <div class="index-vue">
        <!-- 侧边栏 -->
        <aside :class="asideClassName">
        
            <div class="logo-c">
                <span v-show="isShowAsideTitle">林科院运营后台</span>
            </div>
         
            <Menu class="menu" ref="asideMenu" theme="dark" width="100%" @on-select="gotoPage" 
            accordion :open-names="openMenus" :active-name="currentPage" @on-open-change="menuChange">
      
                <div v-for="(item, index) in menuItems" :key="index">
                    <Submenu v-if="item.children" :name="index">
                        <template slot="title">
                            <Icon :size="item.size" :type="item.type"/>
                            <span v-show="isShowAsideTitle">{{item.text}}</span>
                        </template>
                        <div v-for="(subItem, i) in item.children" :key="index + i">
                            <Submenu v-if="subItem.children" :name="index + '-' + i">
                                <template slot="title">
                                    <Icon :size="subItem.size" :type="subItem.type"/>
                                    <span v-show="isShowAsideTitle">{{subItem.text}}</span>
                                </template>
                                <MenuItem class="menu-level-3" v-for="(threeItem, k) in subItem.children" :name="threeItem.name" :key="index + i + k">
                                    <Icon :size="threeItem.size" :type="threeItem.type"/>
                                    <span v-show="isShowAsideTitle">{{threeItem.text}}</span>
                                </MenuItem>
                            </Submenu>
                            <MenuItem v-else-if="!subItem.hidden" :name="subItem.name">
                                <Icon :size="subItem.size" :type="subItem.type"/>
                                <span v-show="isShowAsideTitle">{{subItem.text}}</span>
                            </MenuItem>
                        </div>
                    </Submenu>
                    <MenuItem v-else-if="!item.hidden" :name="item.name" class="menu-item">
                        <Icon :size="item.size" :type="item.type" class="item-icon" />
                        <span v-show="isShowAsideTitle">{{item.text}}</span>
                    </MenuItem>
                </div>
            </Menu>
        </aside>

        <!-- 右侧部分 -->
        <div class="sec-right">
            <!-- 头部 -->
            <div class="top-c">
                <header class="top-header clearfix">
                    <div class="h-left">
                        <div class="pointer" @click="isShrinkAside" title="收缩/展开">
                            <Icon type="ios-apps" />
                        </div>
                    </div>
                    <div class="h-right">
                        <!-- 用户头像 -->
                        <div class="user-img-c">
                            <span>您好！{{userData.account}}</span>
                        </div>
                        <!-- 下拉菜单 -->
                       <div class="dropdown">
                            <Dropdown trigger="click" @on-click="userOperate" @on-visible-change="showArrow">
                                <div class="pointer">
                                    <Icon v-show="arrowDown" type="md-arrow-dropdown"/>
                                    <Icon v-show="arrowUp" type="md-arrow-dropup"/>
                                </div>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="1">修改密码</DropdownItem>
                                    <DropdownItem  name="2">退出登陆</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                       </div>
                    </div>
                </header>
            </div>
            <!-- 页面主体和头部之间放一个遮罩层分隔开 -->
            <!-- <div class="mask"></div> -->
            <!-- 页面主体 -->
            <div class="main-content">
                <!-- 面包屑 -->
                <bread-crumb class="breadCrumb" />

                <div class="view-c">   
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive"/>
                    </keep-alive>
                    
                    <router-view v-if="!$route.meta.keepAlive"/>

                    <div class="loading-c" v-show="showLoading">
                         <Spin fix>
                            <Icon type="ios-loading" size=30 class="demo-spin-icon-load"></Icon>
                        </Spin>
                    </div>
                </div>
            </div>
        </div>



        <!-- 修改密码模态框 -->
         <Modal v-model="isShowDialg" title="修改密码" width="480">
            <Form :model="dialogParams" label-position="top">
                <FormItem label="账号名:" class="input-wrap">
                    <Input placeholder="账号名" v-model="userData.account" readonly />
                </FormItem>
                <FormItem label="旧密码:" class="input-wrap" style="margin:30px 0">
                    <Input clearable placeholder="旧密码" v-model="dialogParams.password" type="password" />
                    <div class="error">{{passwordError}}</div>
                </FormItem>
                <FormItem label="新密码:" class="input-wrap">
                    <Input clearable placeholder="新密码" v-model="dialogParams.passwordVerify" type="password" />
                    <div class="error">{{newPasswordError}}</div>
                </FormItem>
            </Form>
            
            <div slot="footer" class="footer">
                <my-button class="saveBtn" btnText="保 存" @click.native="handleSave"></my-button>
                <my-button btnText="取 消" bg-color="#D9534F" bd-color="#D43F3A" @click.native="isShowDialg=false"></my-button>
            </div>    
        </Modal>
    </div>
</template>

<script>
import { resetTokenAndClearUser } from '../utils'
import BreadCrumb from "components/breadcrumb/BreadCrumb"
import { mapState,mapGetters } from 'vuex'
import MyButton from "components/myButton/MyButton.vue";

export default {
    name: 'index',
    components: {
        BreadCrumb,
        MyButton
    },
    data () {
        return {
            // 用于储存页面路径
            paths: {},
            // 当前显示页面
            currentPage: '',
            openMenus: [], // 要打开的菜单名字 name属性
            menuCache: [], // 缓存已经打开的菜单
            showLoading: false, // 是否显示loading
            hasNewMsg: true, // 是否有新消息
            isShowRouter: true,
            msgNum: '10', // 新消息条数
            // 标签栏         标签标题     路由名称
            // 数据格式 {text: '首页', name: 'home'}
            // 用于缓存打开的路由 在标签栏上展示
            tagsArry: [], 
            arrowUp: false, // 用户详情向上箭头
            arrowDown: true, // 用户详情向下箭头
            isShowAsideTitle: true, // 是否展示侧边栏内容
            main: null, // 页面主要内容区域
            asideClassName: 'aside-big', // 控制侧边栏宽度变化
            asideArrowIcons: [], // 缓存侧边栏箭头图标 收缩时用
            isShowDialg: false,  // 控制是否显示修改密码框
            dialogParams: {
                account: "",  // 账号名
                password: "",  // 旧密码
                passwordVerify: ""  // 新密码
            },
            passwordError: "",
            newPasswordError: "",
        }
    },
    created() {
        // this.interceptors();
        this.nativeActive()
    },
    mounted() {
        // 第一个标签
        const name = this.$route.name
        // this.currentPage = name
        
        this.tagsArry.push({
            text: this.nameToTitle[name],
            name: name
        })
        // 根据路由打开对应的菜单栏
        this.openMenus = this.getMenus(name)
        this.$nextTick(() => {
            this.$refs.asideMenu.updateOpened()
        })

        this.main = document.querySelector('.sec-right')
        this.asideArrowIcons = document.querySelectorAll('aside .ivu-icon-ios-arrow-down')

        // 监听窗口大小 自动收缩侧边栏
        this.monitorWindowSize()
    },
    watch: {
        $route(to) {
            const name = to.name
            this.currentPage = name
            this.$myStorage.set('fdp-menuActive',this.currentPage) // 将当前的激活的菜单栏存储到本地

            if (name == 'error') {
                return
            }

            if (!this.keepAliveData.includes(name)) {
                // 如果标签超过8个 则将第一个标签删除
                if (this.tagsArry.length == 8) {
                    this.tagsArry.shift()
                }
                this.tagsArry.push({name, text: this.nameToTitle[name]})
            }
        }
    },
    computed: {
        ...mapState({
            userData: state => state.login.userData
        }),
         ...mapGetters(['initMenus']),
        // 菜单栏
        menuItems() {
            console.log(this.$store.state.menuItems)
            return this.$store.state.menuItems
        },
        // 需要缓存的路由 -- 筛选出路由名称
        keepAliveData() {
            return this.tagsArry.map(item => item.name)
        },
        // 由于iView的导航菜单比较坑 只能设定一个name参数
        // 所以需要在这定义组件名称和标签栏标题的映射表 有多少个页面就有多少个映射条数
        nameToTitle() {
            const obj = {}
            for(let item of this.menuItems) {
                this.processNameToTitle(obj, item)
            }
            // this.menuItems.forEach(e => {
            //     this.processNameToTitle(obj, e)
            // })
            
            return obj
        },
    },
    methods: {
        // 初始化菜单栏
        nativeActive() {
            let local = this.$myStorage.get('fdp-menuActive')
            local = local ? local : this.initMenus
            this.currentPage = local
            this.$router.push({name: this.currentPage})
        },
        interceptors() {
            // 添加请求拦截器
            this.$axios.interceptors.request.use(config => {
                // console.log(config)
                this.showLoading = true
                // 在发送请求之前做些什么
                return config
            }, error => {
                this.showLoading = false
                // 对请求错误做些什么
                return Promise.reject(error)
            })
            // 添加响应拦截器
            this.$axios.interceptors.response.use(response => {
                this.showLoading = false
                const res = response.data
                return res
            }, error => {
                this.showLoading = false
                // 对响应错误做点什么
                return Promise.reject(error)
            })
        },
        getMenus(name) {
            let menus
            const tagTitle = this.nameToTitle[name]
            for (let i = 0, l = this.menuItems.length; i < l; i++) {
                const item = this.menuItems[i]
                menus = []
                menus[0] = i
                if (item.text == tagTitle) {
                    return menus
                }

                if (item.children) {
                    for (let j = 0, ll = item.children.length; j < ll; j++) {
                        const child = item.children[j]
                        menus[1] = i + '-' + j
                        menus.length = 2
                        if (child.text == tagTitle) {
                            return menus
                        }

                        if (child.children) {
                            for (let k = 0, lll = child.children.length; k < lll; k++) {
                                const grandson = child.children[k]
                                menus[2] = i + '-' + j + '-' + k
                                if (grandson.text == tagTitle) {
                                    return menus
                                }
                            }
                        }
                    }
                }
            }
        },

        monitorWindowSize() {
            let w = document.documentElement.clientWidth || document.body.clientWidth
            if (w < 1300) {
                this.shrinkAside()
            }

            window.onresize = () => {
                // 可视窗口宽度太小 自动收缩侧边栏
                if (w < 1300 && this.isShowAsideTitle 
                    && w > (document.documentElement.clientWidth || document.body.clientWidth)) {
                    this.shrinkAside()
                }

                w = document.documentElement.clientWidth || document.body.clientWidth
            }
        },

        // 判断当前标签页是否激活状态
        isActive(name) {
            return this.$route.name === name
        },
        // 跳转页面 路由名称和参数
        gotoPage(name, params) {
            this.currentPage = name
            this.$router.replace({name, params})

            if (!this.keepAliveData.includes(name)) {
                // 如果标签超过8个 则将第一个标签删除
                if (this.tagsArry.length == 8) {
                    this.tagsArry.shift()
                }
                this.tagsArry.push({name, text: this.nameToTitle[name]})
            }
        },
        // 用户操作
        async userOperate(name) {
            switch(name) {
                case '1':
                    // 修改密码
                    this.isShowDialg = true
                    for(let key in this.dialogParams) {
                        this.dialogParams[key] = ""
                    }
                    this.passwordError = ""
                    this.newPasswordError = ""
                    break
                case '2':
                  try {
                    const res = await this.$get('/fdp/userAccount/logout')
                    this.$Message.success({background:true,content:res})
                    resetTokenAndClearUser()
                    this.$router.replace({name: 'login'})
                    break
                  }catch(err) {
                    resetTokenAndClearUser()
                    this.$router.replace({name: 'login'})
                    break
                  }
            }
        },
        // 控制用户三角箭头显示状态
        showArrow(flag) {
            this.arrowUp = flag
            this.arrowDown = !flag
        },
        // 判断
        isShrinkAside() {
            this.isShowAsideTitle? this.shrinkAside() : this.expandAside()
        },
        // 收缩
        shrinkAside() {
            for(let item of this.asideArrowIcons) {
                item.style.display = 'none'
            }
            // this.asideArrowIcons.forEach(e => {
            //     e.style.display = 'none'
            // })

            this.isShowAsideTitle = false
            this.openMenus = []
            this.$nextTick(() => {
                this.$refs.asideMenu.updateOpened()
            })

            setTimeout(() => {
                this.asideClassName = ''
                this.main.style.width = 'calc(100% - 80px)'
            }, 0)
        },
        // 展开
        expandAside() {
            setTimeout(() => {
                this.isShowAsideTitle = true
                for(let item of this.asideArrowIcons) {
                    item.style.display = 'block'
                }
                // this.asideArrowIcons.forEach(e => {
                //     e.style.display = 'block'
                // })
                
                this.openMenus = this.menuCache
                this.$nextTick(() => {
                    this.$refs.asideMenu.updateOpened()
                })
            }, 200)
            this.asideClassName = 'aside-big'
            this.main.style.width = 'calc(100% - 250px)'
        },
        // 刷新当前标签页
        reloadPage() {
            let name = this.$route.name
            let index = this.keepAliveData.indexOf(name)
            this.$nextTick(() => {
                if (this.tagsArry.length) {
                    this.isShowRouter = false
                    this.tagsArry.splice(index, 1)
                    this.$nextTick(() => {
                        this.tagsArry.splice(index, 0, {name, text: this.nameToTitle[name]})
                        this.gotoPage(name)
                        this.isShowRouter = true
                    })
                } else {
                    this.isShowRouter = false
                    this.$nextTick(() => {
                        this.tagsArry.push({name, text: this.nameToTitle[name]})
                        this.gotoPage(name)
                        this.isShowRouter = true
                    })           
                }
            })
        },
        // 关闭单个标签
        closeTag(i) {
            let name = this.tagsArry[i].name
            this.tagsArry.splice(i, 1)
            // 解决ie兼容event.stopPropagation
            if (event.stopPropagation) {
                // 针对 Mozilla 和 Opera
                event.stopPropagation();
            } else if (window.event) {
                // 针对 IE
                window.event.cancelBubble = true;
            }
            // 如果关闭的是当前标签 则激活前一个标签
            // 如果关闭的是第一个标签 则激活后一个标签
            if (this.tagsArry.length) {
                if (this.isActive(name)) {
                    if (i != 0) {
                        this.gotoPage(this.tagsArry[i - 1].name)
                    } else {
                        this.gotoPage(this.tagsArry[i].name)
                    }
                }
            } else {
                
                // 如果没有标签则跳往首页
                if (name != 'data-manage') {
                    this.gotoPage('data-manage')
                } else {
                    this.reloadPage()
                }
            }
            
        },
        // 根据路由名称关闭页面
        closeName(name) {
            for (let i = 0, len = this.tagsArry.length; i < len; i++) {
                if (this.tagsArry[i].name == name) {
                    this.closeTag(i)
                    break
                }
            }
        },
        // 批量关闭标签
        closeTags(flag) {
            if (flag == 1) {
                // 关闭其他标签
                this.tagsArry = []
                this.gotoPage(this.$route.name)
            } else {
                // 关闭所有标签
                this.tagsArry = []
                this.gotoPage('data-manage')
                this.reloadPage()
            }
        },
        // 激活标签
        activeTag(i) {
            this.gotoPage(this.tagsArry[i].name)
        },
        // 消息通知
        info() {
            const self = this
            this.$Notice.info({
                title: `您有${this.msgNum}条消息`,
                render(h) {
                    return h('Button', {
                        attrs: {
                            type: 'info',
                            size: 'small'
                        },
                        on: {
                            click() {
                                // 点击查看跳转到消息页
                                self.gotoPage('msg')
                                self.hasNewMsg = false,
                                self.msgNum = 0
                            }
                        }
                    }, [
                        '点击查看',
                    ])
                }
            })
        },
        // 菜单栏改变事件
        menuChange(data) {
            this.menuCache = data
        },

        // nameToTitle的每个item调用此方法 让nameToTitle的obj以item的name为键,item的text为值
        processNameToTitle(obj, data, text) {
            // console.log(obj, data, text)
            if (data.name) {
                obj[data.name] = data.text
                this.paths[data.name] = text? `${text} / ${data.text}` : data.text
            }
            if (data.children) {
                for(let item of data.children) {
                    this.processNameToTitle(obj, item, text? `${text} / ${data.text}` : data.text)
                }
                // data.children.forEach(e => {
                //     this.processNameToTitle(obj, e, text? `${text} / ${data.text}` : data.text)
                // })
            }
        },

        // 点击保存
        async handleSave() {
            const {password, passwordVerify } = this.dialogParams
            // this.accountError = !account.toString().trim() ? '请输入账户名' : ''
            this.passwordError = !password.toString().trim() ? '请输入旧密码' : ''
            this.newPasswordError = !passwordVerify.toString().trim() ? '请输入新密码' : ''
            if(!this.passwordError && !this.newPasswordError) {
                this.dialogParams.account = this.userData.account

                const res = await this.$post('/fdp/userAccount/updatePassword',this.dialogParams)
                this.$Message.success({ background: true, content: res});
                this.isShowDialg = false
                alert('修改密码后需要重新登录')
                setTimeout(() => {
                    resetTokenAndClearUser()
                    this.$router.push({name: 'login'})
                },1000)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.index-vue {
    height: 100%;
    // display: inline-block;
    // display: -ms-flex; /* 兼容IE */
    // justify-content: space-between;
    color: @color-dark-grey;
    font-size: @fontsize-middle;
}
.clearfix:after{
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
}
.clearfix{
    *zoom: 1;
}
/* 侧边栏 */
aside {
    float: left;
    min-width: 80px;
    background: @asside-bgColor;
    height: 100%;
    transition: all .5s;
    overflow: auto;
}
.logo-c {
    display: flex;
    color: @color-white;
    font-size: @fontsize-large-xx;
    padding: 20px 0 20px 28px;
    font-weight: 700;
}

.aside-big {
    min-width: 250px;
}
/* 主体页面 */
.sec-right {
    float: right;
    height: 100%;
    width: calc(100% - 250px);
    // display: flex;
    // flex-direction: column;
    transition: width .5s;
    // overflow: auto;
}
/* 主体页面头部 */
.top-c {
    // position: relative;
    background: rgba(230,230,230,.5);
    width: 100%;
    border-bottom: 10px solid #eee;
}
header {
    height: 60px;
    // padding: ;
    // box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
    background: @theme-color;
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
    padding-right: 40px;
    padding-left: 10px;
    font-size: 14px;
}
.top-header {
    position: relative;
}
.top-header .h-left {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    // display: flex;
    // align-items: center;
}
.top-header .h-right {
    position: absolute;
    z-index: 1;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
}

header .ivu-icon {
    font-size: 24px;
    color: #fff;
}
.down-header {
    height: 40px;   
    border-top: 1px solid #eee;
    .ivu-icon {
        font-size:@fontsize-large-xx;
    }
}
.down-header .h-left {
    position: relative;
    margin-top: 4px;
    display: inline-block;
    width: 90%;
}
.down-header .h-right {
    position: relative;
    top: -8px;
    display: inline-block;
}

.refresh-c {
    display: inline-block;
    margin: 0 30px;
    cursor: pointer;
}

.user-img-c {
    display: inline-block;
    color: #fff;
    line-height: 34px;
    margin: 2px 20px 0;
    overflow: hidden;
}

.user-img-c img {
    width: 100%;
}
.dropdown {
    display: inline-block;
    position: relative;
    top: -8px;
}
.notice-c {
    cursor: pointer;
    position: relative;
}
.newMsg {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #FF5722;
    right: 0;
    top: 0;
}
.tag-options {
    display: inline-block;
    cursor: pointer;
}

/* 标签栏 */
.ul-c {
    height: 30px;
    // margin-top: 4px;
    background: #fff;
    // display: flex;
    // justify-content: flex-start;
    // align-items: center;
    padding: 0 10px;
    overflow: hidden;
    position: relative;
}
.ul-c li {
    float: left;
    border-radius: 3px;
    cursor: pointer;
    font-size: @fontsize-small;
    height: 24px;
    line-height: 24px;
    padding: 0 10px;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    margin: 3px 5px 2px 3px;
    border: 1px solid #e6e6e6;
}
a {
    color: #666;
    transition: none;
}
.li-a {
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.ul-c .ivu-icon {
    margin-left: 6px;
}
.active {
    background: @btn-bgColor-green;
    border: 1px solid @btn-bdColor-green;
}
.active a {
    color: #fff;
}
.active .ivu-icon {
    color: #fff;
}
/* 主要内容区域 */
.main-content {
    overflow: auto;
    height: calc(100% - 60px);
    width: 100%;
    background: #eee;
    padding: 20px 20px 55px;
}
.view-c {
    position: relative;
    overflow: auto;
    // height: 100%;
    // background: #fff;
    // padding: 28px 30px 40px;
}
.pointer {
    cursor: pointer;
}
/* loading */
.loading-c {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(255,255,255,.5);
    display: flex;
    align-items: center;
    justify-content: center;
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
}
.mask {
    position: fixed;
    background: #eee;
    width: calc(100% - 250px);;
    height: 10px;
    // width: 100%;
    top: 85px;
    z-index: 20;
}
.breadCrumb {
    margin-bottom: 10px;
}
.menu-level-3 .ivu-icon {
    font-size: @fontsize-large-x;
}
.menu-item {
    display: flex;
    align-items: center;
    color: @color-grey;
    padding: 21px 0 21px 30px;
    background: @asside-bgColor!important
}
.menu-item .item-icon {
    margin-right: 20px;
}
.ivu-menu-item-active {
    background: @theme-color!important;
    color: @color-white!important;
}
.ivu-dropdown-item {
    line-height: 35px;
    text-align: center;
    font-size: 13px!important;
}
/deep/.ivu-modal-wrap {
    .ivu-input,.ivu-input-wrapper {
        width: 100%!important;
    }
}
</style>