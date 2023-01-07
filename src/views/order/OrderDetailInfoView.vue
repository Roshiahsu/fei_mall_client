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

    </div>
</template>



<script>
    export default {
        data() {
            return {
                orderInfo:{},
                jwt:"",
            };
        },
        methods: {
            //獲取訂單詳情
            loadOrderDetail(){
                let id=location.search.split("&")[0].split("=")[1]
                let url="http://localhost:9080/order/"+id+"/orderDetail"
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .get(url).then((response)=>{
                    let json=response.data
                    if(json.serviceCode===20000){
                        this.orderInfo=json.data;
                    }else{
                        this.$message.error(json.message)
                    }
                    console.log("orderInfo",this.orderInfo)
                })
            },
            open() {
                this.$alert('請先登入', '尚未登入', {
                    confirmButtonText: '確定',
                    callback: action => {
                        location.href = "/login"
                    }
                });
            }
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            this.jwt = localStorage.getItem("jwt")
            this.loadOrderDetail()
        }
    }
</script>

<style>


</style>