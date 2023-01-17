<template>
    <div>
        <h1>訂單詳情</h1>
        <el-descriptions title="" direction="vertical" :column="6" border>
            <el-descriptions-item label="訂單編號" :span="2">{{orderInfo.sn}}</el-descriptions-item>
            <el-descriptions-item label="訂單金額" :span="2">{{orderInfo.amountOfActualPay}}</el-descriptions-item>
            <el-descriptions-item label="訂單日期" :span="1">{{orderInfo.gmtCreate}}</el-descriptions-item>
            <el-descriptions-item label="訂單狀態" :span="1">{{orderInfo.statusName}}</el-descriptions-item>
            <el-descriptions-item label="收件人姓名" >{{orderInfo.recipientName}}</el-descriptions-item>
            <el-descriptions-item label="收件人電話" >{{orderInfo.recipientPhone}}</el-descriptions-item>
            <el-descriptions-item label="收件人地址" >{{orderInfo.recipientAddress}}</el-descriptions-item>
        </el-descriptions>
        <el-divider></el-divider>
        <h1>購物清單</h1>
        <el-table
                :data="orderItemList"
                style="width: 100%"
                border="true">
            <el-table-column
                    align="center"
                    type="index"
                    label="編號"
                    width="180">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="productName"
                    label="商品名稱"
                    width="180">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="quantity"
                    label="購買數量">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="subtotal"
                    label="小計">
            </el-table-column>
        </el-table>
    </div>
</template>



<script>
    export default {
        data() {
            return {
                orderInfo:{},
                orderItemList:[],
                jwt:"",
                url:'http://localhost:9080',
            };
        },
        methods: {
            //獲取訂單詳情
            loadOrderDetail(){
                let id=location.search.split("=")[1]
                let url=this.url+"/order/"+id+"/orderDetail"
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .get(url).then((response)=>{
                    let json=response.data
                    if(json.serviceCode===20000){
                        this.orderInfo=json.data;
                        this.loadOrderItemList(json.data.sn)
                    } else if (json.serviceCode === 40004){
                        this.open()
                    }else{
                        this.$message.error(json.message)
                    }
                })
            },
            loadOrderItemList(sn){
                let url=this.url+"/order/"+sn+"/orderItemList"
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .get(url).then((response)=>{
                    let json=response.data
                    if(json.serviceCode===20000){
                        this.orderItemList=json.data;
                    } else if (json.serviceCode === 40004){
                        this.open()
                    }else{
                        this.$message.error(json.message)
                    }
                    console.log("orderItemList",this.orderItemList)
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
            //判斷是否有包含jwt，如果沒有則跳到登入頁
            haveJwt(){
                if(this.jwt ===null){
                    this.open()
                    return
                }
            },
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            this.jwt = localStorage.getItem("jwt")
            this.haveJwt()
            this.loadOrderDetail()

        }
    }
</script>

<style>

</style>