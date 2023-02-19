<template>
<div>
    <h1>購物清單</h1>

    <el-steps :active="1" simple>
        <el-step title="購物清單" ></el-step>
        <el-step title="訂單確認與送出" ></el-step>
        <el-step title="訂單完成" ></el-step>
    </el-steps>

    <el-divider></el-divider>
    <el-card class="box-card" style="width: 1000px;margin: 0 auto" >
        <el-table
                :data="cartArr"
                border
                style="width: 100%">
            <el-table-column type="index" label="ID" width="70" align="center"></el-table-column>
            <el-table-column prop="productName" label="商品名稱" width="300" align="center"></el-table-column>
            <el-table-column prop="price" label="單價" width="100"  align="center"></el-table-column>
            <el-table-column prop="quantity" label="購買數量" align="center" >
                <template slot-scope="scope">
                    <el-input-number size="mini" :min="0" :max="scope.row.stock" @change="handleChange(scope.row)"  v-model="scope.row.quantity" ></el-input-number>
                </template>
            </el-table-column>
            <el-table-column prop="subtotal" label="小計" width="150" align="center"></el-table-column>
            <el-table-column
                    label="操作"
                    align="center"
                    >
                <template slot-scope="scope">
                    <el-button @click="openDeleteConfirm(scope.row.id)" type="info" icon="el-icon-delete" size="mini" >取消</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <h3 style="color: #55acb8;margin-top: 20px">
        總計：{{totalPrice}}
    </h3>
    <el-button  style="display: block;margin: 0 auto"
                icon="el-icon-shopping-cart-2"
                type="danger"
                class="button"
                @click="updateCart"
                >前往結賬</el-button>
    <br>
    <div>
        <span>Paypal測試帳號：sb-66yhi15332170@business.example.com</span>
        <br>
        <span>Paypal測試密碼：12345678</span>
    </div>

</div>
</template>



<script>
    import {getRequest, postRequest} from '@/utils/api'
    import {haveJwt} from "@/utils/Utils";
    export default {
        data() {
            return {
                cartArr:[],
                jwt:"",
                subtotal:"",
                pages:'',
                totalPrice:'',
            };
        },
        methods: {
            //刪除購物車內商品
            openDeleteConfirm(id) {
                console.log(id)
                this.$confirm('確認移除商品?', '提示', {
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
            //根據id刪除購物車商品
            handleDelete(id){
                console.log(id)
                let url="/cart/"+id+"/delete"
                getRequest(url).then(response=>{
                    if(response.serviceCode===20000){
                        this.$message.success("刪除成功")
                    } else{
                        let message = response.message
                        this.$message.error(message);
                    }
                    this.loadCarts()
                })
            },
            //獲取購物車列表
            loadCarts(){
                let url="/cart/list"
                getRequest(url).then(response=>{
                    console.log("CartJSON",response)
                    if(response.serviceCode===20000){
                        this.cartArr=response.data
                        this.total()
                    }else {
                        this.$message.error(response.message)
                    }
                })
            },
            //計算更改商品數量金額
            handleChange(spu) {
                spu.isUpdate = 1
                spu.subtotal = spu.quantity * spu.price
                this.total()
            },
            //計算總金額
            total(){
                let totalPrice =0
                for (let i = 0; i < this.cartArr.length ; i++) {
                    totalPrice = totalPrice+this.cartArr[i].subtotal
                }
                this.totalPrice = totalPrice
            },
            //修改購物車購買數量
            updateCart(){
                //判斷購物車中有無商品
                if(this.cartArr.length === 0){
                    this.$message.error("沒有商品")
                    return
                }
                let url ='/cart/update'
                postRequest(url,this.cartArr).then(response=>{
                    console.log("UpdateJSON", response)
                    if (response.serviceCode === 20000) {
                        //跳轉到付款頁面
                        // location.href = this.url
                        // location.href="/order/list"
                        this.$router.push({path: '/order/list'})
                    } else{
                        this.$message.error(response.message)
                    }
                })
            },
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            this.jwt = localStorage.getItem("jwt")
            haveJwt(this.jwt)
            let pageNum = location.search.split("&")[0].split("=")[1];
            // let pageSize = location.search.split("&")[1].split("=")[1];
            this.loadCarts(pageNum);

        }
    }
</script>

<style>

</style>