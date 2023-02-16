<template>
    <div>
        <h1>訂單確認與送出</h1>
        <!--        步驟條開始-->
        <el-steps :active="2" simple>
            <el-step title="購物清單"></el-step>
            <el-step title="訂單確認與送出"></el-step>
            <el-step title="訂單完成"></el-step>
        </el-steps>
        <!--        步驟條結束-->
        <el-divider></el-divider>
        <!--        購物清單開始-->
        <el-card class="box-card" style="width: 1000px;margin: 0 auto">
            <el-table
                    :data="cartArr"
                    border
                    style="width: 100%">
                <el-table-column type="index" label="ID" width="70" align="center"></el-table-column>
                <el-table-column prop="productName" label="商品名稱" width="300" align="center"></el-table-column>
                <el-table-column prop="price" label="單價" width="100" align="center"></el-table-column>
                <el-table-column prop="quantity" label="購買數量" align="center">
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
        <el-form :model="userInfo" :rules="rules" ref="ruleForm" label-width="20px" class="demo-ruleForm">
            <el-descriptions title="收件人訊息" direction="vertical" :column="4" border>
                <el-descriptions-item label="收件人姓名">
                    <el-form-item label=" " prop="username">
                        <el-input v-model="userInfo.username" style="size: 10ch"></el-input>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="收件人電話">
                    <el-form-item label=" " prop="phone">
                        <el-input v-model="userInfo.phone"></el-input>
                    </el-form-item>
                </el-descriptions-item>

                <el-descriptions-item label="收件地址">
                    <el-form-item label=" " prop="detailedAddress">
                    <el-checkbox label="使用預設：" name="type" v-model="isActive" v-if="addressArr.length>0"></el-checkbox>
                    <el-input style="width: 300px" v-if="!isActive" v-model="userInfo.detailedAddress"
                              placeholder="請選擇配送地址"></el-input>
                    <el-select v-else v-model="userInfo.detailedAddress" placeholder="請選擇配送地址" style="width: 300px">
                        <el-option v-for="c in addressArr" v-bind:key="c.id" :label="c.detailedAddress"
                                   :value="c.detailedAddress">
                        </el-option>
                    </el-select>
                    </el-form-item>
                </el-descriptions-item>
            </el-descriptions>
        </el-form>
        <!--            描述列表：收件人訊息結束-->


        <br>
        <!--    paypal-->
        <form method="post" action="http://localhost:9080/paypal/pay">
            <input type="hidden" name="AmountOfActualPay" v-model="totalPrice">
            <input type="hidden" name="amountOfOriginalPrice" v-model="totalPrice">
            <input type="hidden" name="recipientName" v-model="userInfo.username">
            <input type="hidden" name="recipientPhone" v-model="userInfo.phone">
            <input type="hidden" name="recipientAddress" v-model="userInfo.detailedAddress">
            <input type="hidden" name="userId" v-model="userInfo.id">
            <button type="submit" style="display: block;margin: 0 auto">
                <!-- PayPal Logo -->
                <table border="0" cellpadding="10" cellspacing="0" align="center">
                    <tr>
                        <td align="center"></td>
                    </tr>
                    <tr>
                        <td align="center">
                            <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_200x51.png"
                                 alt="使用 PayPal 立即購"/></td>
                    </tr>
                </table><!-- PayPal Logo -->
            </button>
        </form>

        <!--        改成Paypal已後無作用-->
        <!--        <el-button  style="display: block;margin: 0 auto"-->
        <!--                    icon="el-icon-shopping-cart-2"-->
        <!--                    type="danger"-->
        <!--                    class="button"-->
        <!--                    @click="createOrder"-->
        <!--        >前往結賬</el-button>-->

    </div>
</template>


<script>
    import {haveJwt} from '@/utils/Utils';
    import {getRequest, postRequest} from "@/utils/api";

    export default {
        data() {
            return {
                inputAddress: '',
                isActive: false,
                cartArr: [],
                userInfo: {},
                addressArr: [],
                jwt: "",
                subtotal: "",
                pages: '',
                totalPrice: '',
                rules: {
                    username: [
                        {required: true, message: '請輸入收件人姓名', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: '請輸入收件人電話', trigger: 'blur'},
                        {pattern:/^09[0-9]{8}$/ ,message: '請輸入正確電話',trigger: 'blur'}
                    ],
                    detailedAddress: [
                        {required: true, message: '請輸入地址', trigger: 'blur'},
                    ],
                },
            };
        },
        methods: {
            //獲取購物車
            loadCarts() {
                let url = "/cart/list"
                getRequest(url).then(response => {
                    console.log("cartArrJSON", response)
                    if (response.serviceCode === 20000) {
                        this.cartArr = response.data
                        this.total()
                    } else {
                        this.$message.error(response.message)
                    }
                })
            },
            //獲取地址列表
            loadAddressList() {
                let url = "/address/addressList"
                getRequest(url).then(response => {
                    console.log("地址列表", response)
                    if (response.serviceCode === 20000) {
                        this.addressArr = response.data
                    } else {
                        this.$message.error(response.message)
                    }
                })
            },
            //計算總金額
            total() {
                let totalPrice = 0
                for (let i = 0; i < this.cartArr.length; i++) {
                    totalPrice = totalPrice + this.cartArr[i].subtotal
                }
                this.totalPrice = totalPrice
            },
            //建立訂單
            //使用Paypal後無作用
            createOrder() {
                if (this.cartArr.length == 0) {
                    this.$message.error("沒有商品")
                    return
                }

                let OrderAddNerDTO = {
                    amountOfActualPay: '',
                    amountOfDiscount: '',
                    amountOfFreight: '',
                    amountOfOriginalPrice: this.totalPrice,
                    orderItems: this.cartArr,
                    rewardPoint: 100,
                    recipientName: this.userInfo.username,
                    recipientPhone: this.userInfo.phone,
                    recipientAddress: this.userInfo.detailedAddress
                }
                let url = this.url + '/order/insert'
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .post(url, OrderAddNerDTO).then((response) => {
                    let json = response.data
                    console.log("JSON", json)
                    if (json.serviceCode === 20000) {
                        let id = json.data.id
                        this.$alert('新增成功', '訂單建立成功', {
                            confirmButtonText: '確定',
                            callback: action => {
                                location.href = "/order/success/orderDetailInfo?id=" + id
                            }
                        });
                    } else if (json.serviceCode === 40004) {
                        this.open()
                    } else {
                        this.$message.error(json.message)
                    }
                })
            },
            //獲取用戶資料
            loadUserInfo() {
                let url = "/user/userInfo"
                getRequest(url).then(response => {
                    if (response.serviceCode === 20000) {
                        this.userInfo = response.data;
                        if(this.userInfo.detailedAddress){
                            console.log("沒有地址")
                            this.userInfo.detailedAddress=""
                        }
                    } else {
                        this.$message.error(response.message)
                    }
                    console.log("userInfo", this.userInfo)
                })
            },
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            this.jwt = localStorage.getItem("jwt")
            haveJwt(this.jwt)
            // let pageSize = location.search.split("&")[1].split("=")[1];
            this.loadCarts();
            this.loadUserInfo();
            this.loadAddressList();
        },
    }
</script>

<style>
    .el-form-item {
        margin: 0;
    }

</style>