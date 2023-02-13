<template>
    <div class="login">
        <h1 style="text-align: center">登入頁面</h1>

        <el-card class="box-card" style="width: 600px;height: 430px;
    margin: 0 auto;background-color: rgba(255,255,255,0.3)">
            <img
                    style="width: 100px; height: 100px;margin:auto;display:block"
                    src="/au.png">
            <!--      標籤頁開始-->
            <template>
                <el-tabs v-model="activeName">
                    <el-tab-pane label="用戶登入" name="login">用戶登入</el-tab-pane>
                    <el-tab-pane label="快速註冊" name="reg">快速註冊</el-tab-pane>
                    <el-tab-pane label="忘記密碼" name="initPassword">忘記密碼</el-tab-pane>
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
                        <el-input :type="isActive?'text':'password'" v-model="ruleForm.password"></el-input>
                        <el-checkbox label="顯示密碼" name="type" v-model="isActive"></el-checkbox>

                    </el-form-item>

                    <el-button style="float:left;position: relative;left:225px" type="primary"
                               @click="submitLogin('ruleForm')">登入
                    </el-button>
                    <el-button style="float:left;position: relative;left:225px" @click="resetForm('ruleForm')">重置
                    </el-button>
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
                        <el-input :type="isActive?'text':'password'" v-model="ruleForm.password"></el-input>
                        <el-checkbox label="顯示密碼" name="type" v-model="isActive"></el-checkbox>
                    </el-form-item>
                    <el-button style="float:left;position: relative;left:225px" type="primary"
                               @click="submitReg('ruleForm')">快速註冊
                    </el-button>
                    <el-button style="float:left;position: relative;left:225px" @click="resetForm('ruleForm')">重置
                    </el-button>
                </el-form>
            </div>
            <!--      用戶登入表單結束-->
            <!--      用戶重置密碼開始-->
            <div v-if="activeName==='initPassword'">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="用戶名稱" prop="username">
                        <el-input v-model="ruleForm.username"></el-input>
                    </el-form-item>
                    <el-button style="float:left;position: relative;left:225px" type="primary"
                               @click="initPassword('ruleForm')" v-loading.fullscreen.lock="fullscreenLoading">重置密碼
                    </el-button>
                    <el-button style="float:left;position: relative;left:225px" @click="resetForm()">重置
                    </el-button>
                </el-form>
            </div>
            <!--      用戶重置密碼結束-->


        </el-card>
    </div>
</template>


<script>
    // js-cookie
    import {setSupport, getSupport, setCookie, getCookie} from '@/utils/support';
    import {getRequest, postRequest} from '@/utils/api'
    const userDTO = {
        username: null,
        password: null,
    };
    export default {

        data() {
            return {
                isActive: false,
                activeName: 'login',
                fullscreenLoading: false,
                ruleForm: Object.assign({}, userDTO),
                rules: {
                    username: [
                        {required: true, message: '請輸入用戶名', trigger: 'blur'},
                        {min: 2, max: 15, message: '長度在 4 到 15 個字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '請輸入密碼', trigger: 'blur'},
                        {min: 4, max: 15, message: '長度在 4 到 15 個字符', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            //發送登入請求
            submitLogin(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = "/user/login";
                        postRequest(url, this.ruleForm).then(response => {
                            console.log("/user/login", response)
                            if (response.serviceCode === 59999) {
                                this.$message.error("登入失敗,用戶名或密碼錯誤")
                            } else {
                                console.log("response", response.data)
                                let jwt = response.data
                                localStorage.setItem('jwt', jwt)
                                setCookie("jwt",jwt)
                                this.checkToConfirm('準備跳轉', '登入成功','/index')
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //發送註冊請求
            submitReg(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = "/user/reg";
                        postRequest(url, this.ruleForm).then(response => {
                            if (response.serviceCode === 20000) {
                                //點擊確定後跳轉
                                this.checkToConfirm('請重新登入', '註冊成功','/')
                            } else {
                                this.$message.error(response.message)
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //重置密碼
            initPassword(formName) {
                this.openFullScreen()
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let username = this.ruleForm.username;
                        let url = "/password/reset";
                        postRequest(url, {username: username}).then(response => {
                            if (response.serviceCode === 20000) {
                                //點擊確定後跳轉
                                this.checkToConfirm('準備跳轉', '登入成功','/index')
                            } else {
                                this.$message.error(response.message)
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //清空表格
            resetForm() {
                this.ruleForm=Object.assign({}, userDTO)
            },
            //loading
            openFullScreen() {
                this.fullscreenLoading = true;
                setTimeout(() => {
                    this.fullscreenLoading = false;
                }, 2000);
            },
            checkToConfirm(confirmMessage,title,path){
                this.$alert(confirmMessage, title, {
                    confirmButtonText: '確定',
                    callback: action => {
                        // location.href = "/index"
                        this.$router.push({path: path})
                    }
                });
            }
        }
    }
</script>