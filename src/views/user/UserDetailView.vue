<template>
    <div>
        <!--增加上下邊距-->
        <h1 style="margin: 20px 0;">顧客中心</h1>
        <!--    用戶詳情-->

        <el-descriptions title="用戶詳情" direction="vertical" :column="4" border>
            <template slot="extra">
                <el-button type="primary" size="small">操作</el-button>
            </template>
            <el-descriptions-item label="用戶名">{{userInfo.username}}</el-descriptions-item>
            <el-descriptions-item label="暱稱">{{userInfo.nickname}}</el-descriptions-item>
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
            <el-descriptions-item label="備註">
                <el-tag size="small">待完成</el-tag>
            </el-descriptions-item>
        </el-descriptions>

        <el-divider></el-divider>
        <!--地址詳情-->
        <el-descriptions title="地址詳情" direction="vertical" :column="4" border>
            <el-descriptions-item label="居住地">{{userInfo.city}}</el-descriptions-item>
            <el-descriptions-item label="鄉鎮區">{{userInfo.zone}}</el-descriptions-item>
            <el-descriptions-item label="郵遞區號">{{userInfo.zipCode}}</el-descriptions-item>
            <el-descriptions-item label="詳細地址" :span="2">{{userInfo.detailedAddress}}</el-descriptions-item>
            <el-descriptions-item label="備註">
                <el-tag size="small">待完成</el-tag>
            </el-descriptions-item>
        </el-descriptions>


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
                    <!--                待完成-->
                    <a href="/index">
                        <el-button type="info" size="mini">訂單詳情</el-button>
                    </a>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>


<script>
    export default {
        data() {
            return {
                userInfo: {},
                orderList: []
            };
        },
        methods: {
            handleEdit(id) {
                console.log(id)
                //更改數據ByID
            },

            //自動獲取用戶資料
            loadUserInfo() {
                let url = "http://localhost:9080/user/userInfo"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .get(url).then((response) => {
                    let json = response.data
                    if (json.serviceCode === 20000) {
                        this.userInfo = json.data;
                    } else {
                        this.$message.error(json.message)
                    }
                    console.log("userInfo", this.userInfo)
                })
            },
            loadOrderList() {
                let url = "http://localhost:9080/order/list"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .get(url).then((response) => {
                    let json = response.data
                    if (json.serviceCode === 20000) {
                        this.orderList = json.data;
                    } else {
                        this.$message.error(json.message)
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
        },
        created() {

        },
        mounted() {
            this.jwt = localStorage.getItem("jwt")
            this.loadUserInfo();
            this.loadOrderList();
        }
    }
</script>