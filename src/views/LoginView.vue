<template>
  <div class="login">
    <h1 style="text-align: center">登入頁面</h1>

    <el-card class="box-card" style="width: 600px;height: 400px;
    margin: 0 auto;background-color: rgba(255,255,255,0.3)">
      <img
              style="width: 100px; height: 100px;margin:auto;display:block"
              src="/au.png">
<!--      標籤頁開始-->
      <template>
        <el-tabs v-model="activeName">
          <el-tab-pane label="用戶登入" name="login">用戶登入</el-tab-pane>
          <el-tab-pane label="快速註冊" name="reg">快速註冊</el-tab-pane>
        </el-tabs>
      </template>
      <!--      標籤頁結束-->
<!--      用戶登入表單開始-->
      <div v-if="activeName==='login'">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用戶名稱" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="用戶密碼" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>

          <el-button style="float:left;position: relative;left:225px" type="primary" @click="submitLogin('ruleForm')">登入</el-button>
          <el-button style="float:left;position: relative;left:225px" @click="resetForm('ruleForm')">重置</el-button>
        </el-form>
      </div>
      <!--      用戶登入表單結束-->
      <!--      用戶註冊表單開始-->
      <div v-if="activeName==='reg'">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用戶名稱" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="用戶密碼" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-button style="float:left;position: relative;left:225px" type="primary" @click="submitReg('ruleForm')">快速註冊</el-button>
          <el-button style="float:left;position: relative;left:225px" @click="resetForm('ruleForm')">重置</el-button>
        </el-form>
      </div>
      <!--      用戶登入表單結束-->


    </el-card>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        activeName: 'login',
        ruleForm: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            { required: true, message: '請輸入用戶名', trigger: 'blur' },
            { min: 2, max: 15, message: '長度在 4 到 15 個字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '請輸入密碼', trigger: 'blur' },
            { min: 4, max: 15, message: '長度在 4 到 15 個字符', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      //發送登入請求
      submitLogin(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url="http://localhost:9080/user/login";

            let formData={
                username:this.ruleForm.username,
                password:this.ruleForm.password
            }
            this.axios.post(url,formData).then((response)=>{
              console.log(response.data)
              if(response.data.serviceCode===20000){
                let jwt = response.data.data;
                console.log("jwt:",jwt)
                localStorage.setItem('jwt',jwt)
                //點擊確定後跳轉
                this.$alert('準備跳轉', '登入成功', {
                  confirmButtonText: '確定',
                  callback: action => {
                    location.href = "/index"
                  }
                });
              }else{
                this.$message.error("登入失敗,用戶名或密碼錯誤")
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitReg(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url="http://localhost:9080/user/reg";

            let formData={
              username:this.ruleForm.username,
              password:this.ruleForm.password
            }
            this.axios.post(url,formData).then((response)=>{
              let json = response.data
              console.log(json.data)
              if(json.serviceCode===20000){
                //點擊確定後跳轉
                this.$alert('請重新登入', '註冊成功', {
                  confirmButtonText: '確定',
                  callback: action => {
                    location.href = ""
                  }
                });
              }else{
                this.$message.error(json.message)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }
  }
</script>