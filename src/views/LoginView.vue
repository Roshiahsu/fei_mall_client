<template>
  <div class="login">
    <h1 style="text-align: center">登入頁面</h1>
    <el-card class="box-card" style="width: 600px;height: 300px;
    margin: 0 auto;background-color: rgba(255,255,255,0.3)">
      <img
              style="width: 100px; height: 100px;margin:auto;display:block"
              src="/au.png">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用戶名稱" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="用戶密碼" prop="password">
        <el-input v-model="ruleForm.password"></el-input>
      </el-form-item>

        <el-button style="float:left;position: relative;left:225px" type="primary" @click="submitForm('ruleForm')">登入</el-button>
        <el-button style="float:left;position: relative;left:225px" @click="resetForm('ruleForm')">重置</el-button>

      </el-form>
    </el-card>
  </div>
</template>


<script>
  export default {
    data() {
      return {
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
            let url="http://localhost:9080/user/login";

            //將this.ruleForm裡面的username & password 包裝在formData
            let formData={
                username:this.ruleForm.username,
                password:this.ruleForm.password
            }
            this.axios.post(url,formData).then((response)=>{
              console.log(response.data)
              if(response.data.serviceCode===20000){
                this.$message.success("登錄成功")
                let jwt = response.data.data;
                console.log("jwt:",jwt)
                localStorage.setItem('jwt',jwt)
                location.href="http://localhost:8080/index"
              }else{
                this.$message.error("登錄失敗,用戶名或密碼錯誤")
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
      }
    }
  }
</script>