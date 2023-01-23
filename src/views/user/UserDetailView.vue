<template>
    <div>
        <h1>顧客中心</h1>
        <!--    用戶詳情-->

        <el-descriptions title="用戶詳情" direction="vertical" :column="4" border>
            <template slot="extra">
                <a href="/user/update">
                    <el-button type="primary" size="small">修改詳情</el-button>
                </a>
            </template>
            <el-descriptions-item label="用戶名">{{userInfo.username}}</el-descriptions-item>
            <el-descriptions-item label="暱稱">{{userInfo.nickname}}</el-descriptions-item>
            <el-descriptions-item label="生日">{{userInfo.bod}}</el-descriptions-item>
            <el-descriptions-item label="紅利積分">{{userInfo.rewardPoint}}</el-descriptions-item>
            <el-descriptions-item label="電話" :span="2">{{userInfo.phone}}</el-descriptions-item>
            <el-descriptions-item label="mail" :span="2">{{userInfo.email}}</el-descriptions-item>
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

        <div >
            <el-descriptions title="地址詳情" direction="vertical"
                             :column="4" border
                             v-for="add in addressList"
                             style="margin-top: 10px"
            >
                <template slot="extra">
                    <a href="/user/update">
                        <el-button type="primary" size="small">修改地址</el-button>
                    </a>
                </template>
                <el-descriptions-item label="居住地" :content-class-name="add.isDefault===1?'my-content':null">{{add.city}}</el-descriptions-item>
                <el-descriptions-item label="鄉鎮區" :content-class-name="add.isDefault===1?'my-content':null">{{add.zone}}</el-descriptions-item>
                <el-descriptions-item label="郵遞區號" :content-class-name="add.isDefault===1?'my-content':null">{{add.zipCode}}</el-descriptions-item>
                <el-descriptions-item label="詳細地址" :span="2" :content-class-name="add.isDefault===1?'my-content':null">{{add.detailedAddress}}</el-descriptions-item>
                <el-descriptions-item label="備註">
                    <el-tag size="small">待完成</el-tag>
                </el-descriptions-item>
            </el-descriptions>

        </div>



        <el-divider></el-divider>
        <!--訂單列表-->
        <el-table
                :data="orderList"
                style="width: 100%"
        >
            <el-table-column
                    type="index"
                    width="50"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="sn"
                    label="訂單編號"
                    width="180"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="gmtCreate"
                    label="訂購日期"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="statusName"
                    label="訂單狀態"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="amountOfActualPay"
                    label="實際支付金額"
                    align="center">
            </el-table-column>
            <el-table-column
                    label="訂單詳情"
                    align="center"
            >
                <template slot-scope="scope">
                        <el-button type="info" size="mini" @click="getOrderDetail(scope.row.id)">訂單詳情</el-button>
                </template>
            </el-table-column>
        </el-table>

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
                orderList: [],
                addressList:[
                    {
                        city:'',
                        zone:'',
                        zipCode:'',
                        detailedAddress:'',
                    }
                ],
                url:"http://localhost:9080"
            };
        },
        methods: {
            getOrderDetail(id) {
                location.href = "/orderDetailInfo?id="+id
            },

            //自動獲取用戶資料
            loadUserInfo() {
                let url = this.url+"/user/userInfo"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .get(url).then((response) => {
                    let json = response.data
                    if (json.serviceCode === 20000) {
                        this.userInfo = json.data;
                    } else if (json.serviceCode === 40001 || json.serviceCode === 40002){
                        localStorage.clear()
                        this.open()
                    } else {
                        // this.$message.error(json.message)
                    }
                    console.log("userInfo", this.userInfo)
                })
            },
            loadAddressList() {
                let url = this.url+"/address/addressList"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .get(url).then((response) => {
                    let json = response.data
                    if (json.serviceCode === 20000) {
                        this.addressList = json.data;
                    } else if (json.serviceCode === 40001 || json.serviceCode === 40002){
                        localStorage.clear()
                        this.open()
                    } else {
                        // this.$message.error(json.message)
                    }
                    console.log("addressList", this.addressList)
                })
            },
            loadOrderList() {
                let url = this.url+"/order/list"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .get(url).then((response) => {
                    let json = response.data
                    if (json.serviceCode === 20000) {
                        this.orderList = json.data;
                    } else if (json.serviceCode === 40004){
                        this.open()
                    } else {
                        // this.$message.error(json.message)
                    }
                    console.log("orderList", this.orderList)
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
            haveJwt(){
                if(this.jwt ===null){
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
            this.loadOrderList();
            this.loadAddressList()
        }
    }
</script>
<style>
    .my-content {
        background: #FDE2E2;
    }
</style>