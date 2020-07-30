<template>
  <div>
    <van-tabs>
      <van-tab title="登录">
        <van-cell-group>
          <van-field label="用户名" required clearable placeholder="请输入用户名" v-model="loginUsername"></van-field>
          <van-field
            label="密码"
            type="password"
            required
            clearable
            placeholder="请输入密码"
            v-model="loginPassword"
          ></van-field>
        </van-cell-group>
        <div>
          <van-button @click="loginHandler" type="primary" size="large">登录</van-button>
        </div>
      </van-tab>
      <van-tab title="注册">
        <van-cell-group>
          <van-field label="用户名" required clearable placeholder="请输入用户名" v-model="registUsername"></van-field>
          <van-field
            label="密码"
            type="password"
            required
            clearable
            placeholder="请输入密码"
            v-model="registPassword"
          ></van-field>
        </van-cell-group>
        <div>
          <van-button @click="registHandler" type="primary" size="large">注册</van-button>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      loginUsername: "",
      loginPassword: "",
      registUsername: "",
      registPassword: ""
    };
  },
  methods: {
    ...mapActions(["loginAction"]),
    // 注册的处理方法
    registHandler() {
      this.$post(this.$API.registUser, {
        phone:  this.registUsername,
        password: this.registPassword
      }).then((data) => {
        this.$toast.success('注册成功！');
      });
    },
    // 登录的处理方法
    loginHandler() {
      this.$post(this.$API.loginUser, {
        phone: this.loginUsername,
        password:this.loginPassword
      }).then((res) => {
        console.log(res, 111);
        this.$toast.success("登录成功");
        // 保存登录状态
        this.loginAction(res.userInfo);
        this.$router.go(-1);
      });
    }
  }
};
</script>

<style lang="scss">
</style>

