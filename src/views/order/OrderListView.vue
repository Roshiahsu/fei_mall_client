<template>
    <div>
        <h1>訂單確認與送出</h1>
        <!--        步驟條開始-->
        <el-steps :active="2" simple>
            <el-step title="購物清單" ></el-step>
            <el-step title="訂單確認與送出" ></el-step>
            <el-step title="訂單完成" ></el-step>
        </el-steps>
        <!--        步驟條結束-->
        <el-divider></el-divider>
        <!--        購物清單開始-->
        <el-card class="box-card" style="width: 1000px;margin: 0 auto" >
            <el-table
                    :data="cartArr"
                    border
                    style="width: 100%">
                <el-table-column type="index" label="ID" width="70" align="center"></el-table-column>
                <el-table-column prop="productName" label="商品名稱" width="300" align="center"></el-table-column>
                <el-table-column prop="price" label="單價" width="100"  align="center"></el-table-column>
                <el-table-column prop="quantity" label="購買數量" align="center" >
                </el-table-column>
                <el-table-column prop="subtotal" label="小計" width="150" align="center"></el-table-column>
            </el-table>
        </el-card>
        <h3 style="color: #55acb8;margin-top: 20px">
            總計：{{totalPrice}}
        </h3>
        <!--        購物清單結束-->
        <el-divider></el-divider>

        <!--    描述列表：收件人訊息開始-->
        <el-descriptions title="收件人訊息" direction="vertical" :column="4" border>
            <el-descriptions-item label="收件人姓名" >
                <el-input v-model="userInfo.username" style="size: 10ch"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="收件人電話" >
                <el-input v-model="userInfo.phone"></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="收件地址" >
                <el-select v-model="userInfo.detailedAddress" placeholder="請選擇配送地址" style="width: 300px">
                    <el-option v-for="c in addressArr" v-bind:key="c.id" :label="c.detailedAddress"
                               :value="c.detailedAddress">
                    </el-option>
                </el-select>

<!--                <el-input v-model="userInfo.detailedAddress"></el-input>-->
            </el-descriptions-item>
<!--            <el-descriptions-item label="備註"  >-->
<!--                <el-tag size="small" >待完成</el-tag>-->
<!--            </el-descriptions-item>-->
        </el-descriptions>
<!--            描述列表：收件人訊息結束-->


        <br>

        <el-button  style="display: block;margin: 0 auto"
                    icon="el-icon-shopping-cart-2"
                    type="danger"
                    class="button"
                    @click="createOrder"
        >前往結賬</el-button>

    </div>
</template>



<script>
    export default {
        data() {
            return {
                cartArr:[],
                userInfo:{},
                addressArr:[],
                jwt:"",
                url:"http://localhost:9080",
                subtotal:"",
                pages:'',
                totalPrice:'',
            };
        },
        methods: {
            //獲取購物車
            loadCarts(){
                let url=this.url+"/cart/list"
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .get(url).then((response)=>{
                    let json=response.data
                    console.log("JSON",json)
                    if(json.serviceCode===20000){
                        this.cartArr=json.data
                        this.total()
                    }else {
                        this.$message.error(json.message)
                    }
                })
            },
            //獲取地址列表
            loadAddressList(){
                let url=this.url+"/address/addressList"
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .get(url).then((response)=>{
                    let json=response.data
                    console.log("地址列表",json)
                    if(json.serviceCode===20000){
                        this.addressArr=json.data
                    }else {
                        this.$message.error(json.message)
                    }
                })
            },
            //計算總金額
            total(){
                let totalPrice =0
                for (let i = 0; i < this.cartArr.length ; i++) {
                    totalPrice = totalPrice+this.cartArr[i].subtotal
                }
                this.totalPrice = totalPrice
            },
            //建立訂單
            createOrder(){
                if(this.cartArr.length == 0){
                    this.$message.error("沒有商品")
                    return
                }

                let OrderAddNerDTO={
                    amountOfActualPay :'',
                    amountOfDiscount: '',
                    amountOfFreight: '',
                    amountOfOriginalPrice:this.totalPrice,
                    orderItems:this.cartArr,
                    rewardPoint: 100,
                    recipientName:this.userInfo.username,
                    recipientPhone:this.userInfo.phone,
                    recipientAddress:this.userInfo.detailedAddress
                }
                let url =this.url+'/order/insert'
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .post(url,OrderAddNerDTO).then((response)=>{
                    let json = response.data
                    console.log("JSON", json)
                    if (json.serviceCode === 20000) {
                        let id = json.data.id
                        this.$alert('新增成功', '訂單建立成功', {
                            confirmButtonText: '確定',
                            callback: action => {
                                location.href="/order/success/orderDetailInfo?id="+id
                            }
                        });
                    } else if (json.serviceCode === 40004){
                        this.open()
                    }else{
                        this.$message.error(json.message)
                    }
                })
            },
            //自動獲取用戶資料
            loadUserInfo(){
                let url=this.url+"/user/userInfo"
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .get(url).then((response)=>{
                    let json=response.data
                    if(json.serviceCode===20000){
                        this.userInfo=json.data;
                    }else{
                        this.$message.error(json.message)
                    }
                    console.log("userInfo",this.userInfo)
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
            // let pageSize = location.search.split("&")[1].split("=")[1];
            this.loadCarts();
            this.loadUserInfo();
            this.loadAddressList();

        }
    }
</script>

<style>


</style>