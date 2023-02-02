<template>
    <div>
        <h1>管理員訂單列表管理</h1>
        <div  style="width: 150px;margin: 0 auto">
        <span v-for=" i in pages" :key="i">
            <a href="javascript:void(0)" @click="loadOrderList(i)">{{i}}</a><el-divider direction="vertical"></el-divider>
        </span>
        </div>
        <!--地址詳情結束-->
        <el-divider></el-divider>
        <div id="download">
            <!--訂單列表-->
            <el-table
                    :data="orderList"
                    style="width: 100%"
                    border
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column
                        label="編號"
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
    </div>
</template>


<script>
    export default {
        data() {
            return {
                multipleSelection:[],
                pages:"",
                orderList: [
                    {
                        amountOfActualPay:"", //實際支付金額
                        gmtCreate:"",//訂單生成時間
                        id:"",//訂單id
                        sn:"",//訂單編號
                        statusName:"",//訂單狀態
                    }
                ],
                url: "http://localhost:9080",
            };
        },
        methods: {
            //跳轉到訂單詳情
            getOrderDetail(id) {
                location.href = "/orderDetailInfo?id=" + id
            },
            //獲取訂單列表
            loadOrderList(pageNum) {
                let url = this.url +"/order/"+pageNum+"/admin/list"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .get(url).then((response) => {
                    let json = response.data
                    console.log(json)
                    if (json.serviceCode === 20000) {
                        this.orderList = json.data.list;
                        this.pages = json.data.totalPage
                    } else if (json.serviceCode === 40004 ||json.serviceCode === 40002) {
                        this.open()
                    } else {
                        this.$message.error(json.message)
                    }
                    console.log("orderList", this.orderList)
                })
            },
            handleEdit(id){
                location.href = "/user/addressUpdate?id="+id
            },
            //商品刪除確認
            openDeleteConfirm(id) {
                this.$confirm('確認移除設定?', '提示', {
                    confirmButtonText: '繼續', //點確認走then
                    cancelButtonText: '取消', //點取消走catch
                    type: 'warning'
                }).then(() => {
                    this.handleDelete(id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //根據id刪除地址
            handleDelete(id){
                console.log(id)
                let url=this.url+"/address/"+id+"/delete"
                this.axios
                    .create({headers:{'Authorization':localStorage.getItem("jwt")}})
                    .get(url).then((response)=>{
                    let json = response.data;
                    if(json.serviceCode===20000){
                        this.$message.success("刪除成功")
                    }else{
                        let message = response.data.message
                        this.$message.error(message);
                    }
                    setTimeout(() => {
                        location.href=''
                        // this.$router.push({path: '/customerCenter'})
                    }, 500);

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
            },
            //批量待完成
            handleSelectionChange(val){
                this.multipleSelection = val;
                console.log(this.multipleSelection)
            },
        },

        created() {

        },
        mounted() {
            this.jwt = localStorage.getItem("jwt")
            this.loadOrderList(1);
            this.haveJwt();

        }
    }

</script>
<style>

</style>