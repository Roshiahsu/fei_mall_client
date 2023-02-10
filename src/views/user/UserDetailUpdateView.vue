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
                    <el-form :inline="true" :model="passwordDTO" size="small" label-width="140px">
                        <el-form-item label="原始密碼：">
                            <el-input class="password-input" v-model="passwordDTO.oldPassword" placeholder="請輸入原始密碼" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="新密碼：">
                            <el-input class="password-input" v-model="passwordDTO.newPassword"  placeholder="請輸入密碼(大小寫有分別)" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="密碼再確認：">
                            <el-input class="password-input" v-model="passwordDTO.checkPassword"  placeholder="請再輸入一次新密碼" clearable></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <el-button
                        style="margin: 0 auto;display: block"
                        type="primary"
                        size="small"
                        @click="matchesPassword()">
                    修改密碼
                </el-button>
            </el-card>


    </div>
</template>


<script>
    export default {
        data() {
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
                url: 'http://localhost:9080',
            };
        },
        methods: {
            //獲取用戶資料
            loadUserInfo() {
                let url = this.url + "/user/userInfo"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .get(url).then((response) => {
                    let json = response.data
                    console.log("json", json)
                    if (json.serviceCode === 20000) {
                        this.userInfo = json.data;
                    } else if (json.serviceCode === 40001 || json.serviceCode === 40002) {
                        this.open()
                    } else {
                        // this.$message.error(json.message)
                    }
                    console.log("userInfo", this.userInfo)
                })
            },
            //用戶更新
            userUpdate() {
                let url = this.url + "/user/update"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .post(url, this.userInfo).then((response) => {
                    let json = response.data
                    console.log(json)
                    if (json.serviceCode === 20000) {
                        this.$message.success("修改完成")
                    } else if (json.serviceCode === 40004) {
                        this.open()
                    } else if (json.serviceCode === 40003) {
                        this.$message.warning(json.message)
                    } else {
                        // this.$message.error(json.message)
                    }
                })
            },
            //驗證密碼&更新密碼
            matchesPassword() {
                let url = this.url + "/password/matches"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .post(url, this.passwordDTO).then((response) => {
                    let json = response.data
                    console.log(json)
                    if (json.serviceCode === 20000) {
                        console.log("驗證完成")
                    } else if (json.serviceCode === 40004) {
                        this.open()
                    } else if (json.serviceCode === 40003) {
                        this.$message.warning(json.message)
                    } else {
                        // this.$message.error(json.message)
                    }
                })
            },
            open() {
                this.$alert('請先登入', '尚未登入', {
                    confirmButtonText: '確定',
                    callback: action => {
                        // location.href = "/login"
                        this.$router.push({path: '/login'})
                    }
                });
            },
            haveJwt() {
                if (this.jwt === null) {
                    this.open()
                    return
                }
            }
        },
        created() {

        },
        mounted() {
            this.jwt = localStorage.getItem("jwt")
            this.haveJwt();
            this.loadUserInfo();
        }
    }
</script>
<style>
    .password-input{
        width: 200px;
    }
</style>