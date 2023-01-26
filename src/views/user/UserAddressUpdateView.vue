<template>
    <div>
        <h1>顧客地址修改中心</h1>
        <!--地址詳情開始-->
        <div >

            <el-descriptions title="地址詳情" direction="vertical"
                             :column="4"
                             style="margin-top: 10px"
                             border
            >
                <template slot="extra">
                    <el-button type="primary" size="small" @click="userAddressUpdate()">確認修改</el-button>
                </template>
                <el-descriptions-item label="居住地" span="1" >
                    <el-input v-model="addressInfo.city"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="鄉鎮區" span="1">
                    <el-input v-model="addressInfo.zone"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="郵遞區號" span="1">
                    <el-input v-model="addressInfo.zipCode"></el-input>
                </el-descriptions-item>
                            <el-descriptions-item label="是否設定為預設" >
                                <template>
                                    <el-switch v-model="addressInfo.isDefault"
                                               :active-value="1"
                                               :inactive-value="0"
                                               active-color="#13ce66"
                                               inactive-color="#999"
                                    >
                                    </el-switch>
                                </template>
                            </el-descriptions-item>
                <el-descriptions-item label="標籤">
                    <el-input v-model="addressInfo.tag"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="詳細地址" >
                    <el-input v-model="addressInfo.detailedAddress"></el-input>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <!--地址詳情結束-->

    </div>
</template>


<script>
    export default {
        data() {
            return {
                addressInfo:
                    {
                        city:'',
                        zone:'',
                        zipCode:'',
                        detailedAddress:'',
                        isDefault:'',
                        tag:''
                    },
                url: 'http://localhost:9080',
            };
        },
        methods: {
            //獲取地址詳情
            loadAddressInfo(id) {
                let url = this.url + "/address/addressInfo?id="+id
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .get(url).then((response) => {
                    let json = response.data
                    console.log("地址詳情json", json)
                    if (json.serviceCode === 20000) {
                        this.addressInfo = json.data;
                    } else if (json.serviceCode === 40001 || json.serviceCode === 40002) {
                        this.open()
                    } else {
                        // this.$message.error(json.message)
                    }
                    console.log("addressInfo", this.addressInfo)
                })
            },
            userAddressUpdate() {
                let url = this.url + "/address/updateAddress"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .post(url, this.addressInfo).then((response) => {
                    let json = response.data
                    console.log(json)
                    if (json.serviceCode === 20000) {
                        this.$message.success("修改完成")
                        setTimeout(() => {
                            // location.href="/customerCenter"
                            this.$router.push({path: '/customerCenter'})
                        }, 500);
                    } else if (json.serviceCode === 40002) {
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
            let id =location.search.split("=")[1]
            this.haveJwt();
            this.loadAddressInfo(id)
        }
    }
</script>
<style>


</style>