<template>
    <div>
        <h1>顧客資料修改中心</h1>
        <!--    用戶詳情-->

        <el-descriptions title="用戶詳情" direction="vertical" :column="4" border>
            <template slot="extra">
                <el-button type="primary" size="small" @click="userUpdate()" style="position: relative;right:20px">確認修改</el-button>
            </template>
            <el-descriptions-item label="用戶名">
                <el-input v-model="userInfo.username" disabled></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="暱稱">
                <el-input v-model="userInfo.nickname"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="生日">
                <el-date-picker
                        align="center"
                        v-model="userInfo.bod"
                        type="date"
                        placeholder="選擇日期"
                >
                </el-date-picker>
            </el-descriptions-item>
            <el-descriptions-item label="紅利積分">
                <el-input v-model="userInfo.rewardPoint" disabled></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="電話" :span="2">
                <el-input v-model="userInfo.phone"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="mail" :span="2">
                <el-input v-model="userInfo.email"></el-input>
            </el-descriptions-item>
            <!--            <el-descriptions-item label="是否啟用" :span="2">-->
            <!--                <template>-->
            <!--                    <el-switch v-model="userInfo.isEnable"-->
            <!--                               :active-value="1"-->
            <!--                               :inactive-value="0"-->
            <!--                               active-color="#13ce66"-->
            <!--                               inactive-color="#999"-->
            <!--                               disabled>-->
            <!--                    </el-switch>-->
            <!--                </template>-->
            <!--            </el-descriptions-item>-->

        </el-descriptions>
        <el-divider></el-divider>

            <el-card class="filter-container" shadow="never" style="width: 400px;margin: 0 auto">
                <div>
                    <i class="el-icon-edit-outline"></i>
                    <span>修改密碼</span>

                </div>

                <div style="margin-top: 15px">
                    <el-form :inline="true" :model="passwordDTO" :rules="rules" ref="passwordDTO" size="small" label-width="140px" class="demo-ruleForm">
                        <el-form-item label="原始密碼：" prop="oldPassword">
                            <el-input class="password-input" v-model="passwordDTO.oldPassword" placeholder="請輸入原始密碼" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="新密碼：" prop="newPassword">
                            <el-input class="password-input" v-model="passwordDTO.newPassword"  placeholder="請輸入密碼(大小寫有分別)" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="密碼再確認：" prop="checkPassword">
                            <el-input class="password-input" v-model="passwordDTO.checkPassword"  placeholder="請再輸入一次新密碼" clearable></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <el-button
                        style="margin: 0 auto;display: block"
                        type="primary"
                        size="small"
                        @click="matchesPassword('passwordDTO')">
                    修改密碼
                </el-button>
            </el-card>


    </div>
</template>


<script>
    import {haveJwt} from '@/utils/Utils';
    import {getRequest,postRequest} from "@/utils/api";

    export default {
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === this.passwordDTO.oldPassword) {
                    callback(new Error('不能跟舊密碼相同！'));
                } else {
                    if (this.passwordDTO.checkPassword !== '') {
                        this.$refs.passwordDTO.validateField('checkPassword');
                    }
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('請再次輸入密碼'));
                } else if (value !== this.passwordDTO.newPassword) {
                    callback(new Error('兩次輸入密碼不一致!'));
                } else {
                    callback();
                }
            };
            return {
                userInfo: {
                    username: '',
                    nickname: '',
                    bod: '',
                    rewardPoint: '',
                    phone: '',
                    email: '',
                },
                passwordDTO:{
                    oldPassword:'',
                    newPassword:'',
                    checkPassword:'',
                },
                rules: {
                    oldPassword: [
                        { required: true, message: '請輸入舊密碼', trigger: 'blur' },
                    ],
                    newPassword: [
                        { required: true, message: '請輸入新密碼', trigger: 'blur' },
                        { min: 4, max: 15, message: '長度在 4 到 15 個字符', trigger: 'blur' },
                        { type:"string" ,validator: validatePass, trigger: 'blur' }
                    ],
                    checkPassword: [
                        { required: true, message: '請確認新密碼', trigger: 'blur' },
                        { min: 4, max: 15, message: '長度在 4 到 15 個字符', trigger: 'blur' },
                        { type:"string",validator: validatePass2, trigger: 'blur' }
                    ],
                }
            };
        },
        methods: {
            //獲取用戶資料
            loadUserInfo() {
                let url = "/user/userInfo"
                getRequest(url).then(response=>{
                    if (response.serviceCode === 20000) {
                        this.userInfo = response.data;
                    } else {
                        this.$message.error(response.message)
                    }
                })
            },
            //用戶更新
            userUpdate() {
                let url = "/user/update"
                postRequest(url,this.userInfo).then(response=>{
                    if (response.serviceCode === 20000) {
                        this.$message.success("修改完成")
                    } else {
                        this.$message.error(response.message)
                    }
                })
            },
            //驗證密碼&更新密碼
            matchesPassword(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = "/password/matches"
                        postRequest(url,this.passwordDTO).then(response=>{
                            if (response.serviceCode === 20000) {
                                this.$message.success("修改完成")
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
        },
        created() {

        },
        mounted() {
            haveJwt(localStorage.getItem('jwt'));
            this.loadUserInfo();
        }
    }
</script>
<style>
    .password-input{
        width: 200px;
    }
</style>