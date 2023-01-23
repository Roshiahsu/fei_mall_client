<template>
    <div>
        <h1>顧客資料修改中心</h1>
        <!--    用戶詳情-->

        <el-descriptions title="用戶詳情" direction="vertical" :column="4" border>
            <template slot="extra">
                <el-button type="primary" size="small" @click="userUpdate()">確認修改</el-button>
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
        <!--地址詳情-->
        <el-descriptions title="地址詳情" direction="vertical" :column="4" border>
            <template slot="extra">
                <el-button type="primary" size="small" @click="userAddressUpdate()">確認修改</el-button>
            </template>
            <el-descriptions-item label="居住地">
                <el-input v-model="userInfo.city"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="鄉鎮區">
                <el-input v-model="userInfo.zone"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="郵遞區號">
                <el-input v-model="userInfo.zipCode"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="詳細地址" :span="2">
                <el-input v-model="userInfo.detailedAddress"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="備註">
                <el-tag size="small">待完成</el-tag>
            </el-descriptions-item>
        </el-descriptions>

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
                    city: '',
                    zone: '',
                    zipCode: '',
                    detailedAddress: '',
                },
                url: 'http://localhost:9080',
            };
        },
        methods: {
            //自動獲取用戶資料
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
            userAddressUpdate() {
                let url = this.url + "/user/updateAddress"
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
            open() {
                this.$alert('請先登入', '尚未登入', {
                    confirmButtonText: '確定',
                    callback: action => {
                        location.href = "/login"
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