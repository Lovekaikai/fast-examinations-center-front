<template>
  <div class="login">
    <div class="container">
      <p class="title">检测检验数据区块链集成系统</p>
      <p class="desc">检测范围涵盖各行业</p>

      <!-- 登录框 -->
      <div class="login-wrap">
        <div class="input-wrap" style="margin-bottom:36px">
          <Input v-model="loginForm.account" prefix="ios-contact" placeholder="输入您的账号" clearable />
          <!-- 错误提示 -->
          <div class="error">{{accountError}}</div>
        </div>

        <div class="input-wrap">
          <Input type="password" prefix="md-lock" v-model="loginForm.password" 
          placeholder="输入您的密码" clearable />
          <!-- 错误提示 -->
          <p class="error">{{pwdError}}</p>
        </div>

        <!-- 下次自动登录 -->
        <div class="auto-login">
          <Checkbox size="small" v-model="isAuto" @click="isAuto=!isAuto">下次自动登录</Checkbox>
        </div>

        <Button style="margin-top:50px" :loading="isShowLoading" class="submit" type="primary" @click="handleLogin" >登 录</Button>
      </div>
    </div>

    <div class="copyRight">
      <p>广东省林业科学研究院</p>
      <p>中追溯源(北京)科技股份有限公司</p>
    </div>
    <!-- <Button :loading="isShowLoading" class="submit" type="primary" @click="submit">登陆</Button>
    <p class="account"><span @click="register">注册账号</span> | <span @click="forgetPwd">忘记密码</span></p>-->
  </div>
</template>

<script>
import {mapGetters } from 'vuex'
export default {
  name: "login",
  data () {
    return {
      loginForm: {
        account: "",  // 账户名
        password: ""  // 密码 
      },
      accountError: "",
      pwdError: "",
      isShowLoading: false,
      isAuto: false  // 是否下次自动登录
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['initMenus'])
  },
  methods: {
    verify () {
      const { account, password } = this.loginForm
      this.accountError = !account.toString().trim() ? "请输入账户名" : ""
      this.pwdError = !password.toString().trim() ? "请输入密码" : ""
    },
    register () {
      console.log("注册账号");
    },
    forgetPwd () {
      console.log("忘记密码");
    },

    async handleLogin () {
     try {
        this.verify()
        if (!this.accountError && !this.pwdError) {
          this.isShowLoading = true;
          const res = await this.$post('/fdp/userAccount/login', this.loginForm)
          console.log(res)
          let userData = {
            account: res.account,  // 用户账户名
            accountStatus: res.accountStatus,  // 用户账号状态
            role: res.role  // 用户角色
          }
          this.$store.commit('setUserData', userData)
          console.log(this.initMenus)
          this.isAuto ? this.$cookies.set('fdp-token', res.token, "7d") : this.$cookies.set('fdp-token', res.token, "1d")
          this.$router.push({ name: this.initMenus })
        }
     }catch(err) {
       this.isShowLoading = false
     }
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  position: relative;
  height: 100%;
  color: @color-white;
  background: url('~assets/imgs/login-bg.png');
  background-size: 100% 100%;

  .container {
    position: absolute;
    top: 12%;
    left: 10%;
    .title {
      font-size: 42px;
      font-weight: bold;
      letter-spacing: 2px;
      margin-bottom: 25px;
    }
    .desc {
      font-size: @fontsize-large-xx;
      letter-spacing: 2px;
    }
    .login-wrap {
      margin-top: 70px;
      .auto-login {
        margin-top: 10px;
        padding-left: 10px;
      }
      .submit {
        width: 184px;
        height: 58px;
        border-radius: 29px;
        background: #5856ba;
        font-size: @fontsize-large-xx;
      }
    }
  }

  .copyRight {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: @color-whiteFC;
    letter-spacing: 4px;
    p {
      &:first-child {
        margin-bottom: 5px;
      }
    }
  }
}

.login ::-webkit-input-placeholder {
  color: @color-whiteFC;
}
.login :-moz-placeholder {
  color: @color-whiteFC;
}
.login ::-moz-placeholder {
  color: @color-whiteFC;
}
.login :-ms-input-placeholder {
  color: @color-whiteFC;
}

.login .error {
  color: red;
  text-align: left;
  margin: 5px auto;
  font-size: 12px;
  padding-left: 30px;
  height: 20px;
}
</style>

<style lang="less" scoped>
.login-wrap {
  /deep/.ivu-input-wrapper {
    width: 340px;
    line-height: 60px !important;
    height: 60px;
    /deep/.ivu-icon-ios-contact,
    /deep/.ivu-icon-md-lock {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.8);
      padding-left: 15px;
    }
  }
  /deep/.ivu-input {
    width: 340px !important;
    height: 60px;
    border-radius: 30px;
    background-color: transparent !important;
    color: @color-white;
    outline: @color-white;
    border: 1.5px solid @color-white;
    font-size: 13px;
    text-align: center;
    padding-right: 30px;
    margin-bottom: 10px;
  }
  /deep/.ivu-btn {
    border-color: #5856ba;
  }
  /deep/.ivu-input-icon-clear {
    line-height: 60px;
  }

  .auto-login {
    /deep/.ivu-checkbox-wrapper {
      font-size: 12px;
    }
    /deep/.ivu-checkbox {
      margin-right: 4px;
    }
    /deep/.ivu-checkbox-checked .ivu-checkbox-inner {
      border-color: #fff !important;
      background: #fff !important;
    }
    /deep/.ivu-checkbox-checked .ivu-checkbox-inner:after {
      border-color: #333;
    }
  }
}
</style>


