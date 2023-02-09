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
                    <el-input-number size="mini" :min="0" :max="scope.row.quantity+10" @change="handleChange(scope.row)"  v-model="scope.row.quantity" ></el-input-number>
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

</div>
</template>



<script>
    import Cookies from 'js-cookie'
    export default {
        data() {
            return {
                cartArr:[],
                jwt:"",
                url:"http://localhost:9080",
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
                let url=this.url+"/cart/"+id+"/delete"
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .get(url).then((response)=>{
                    let json = response.data;
                    if(json.serviceCode===20000){
                        this.$message.success("刪除成功")
                    } else if (json.serviceCode === 40002) {
                        this.open()
                    }else{
                        let message = response.data.message
                        this.$message.error(message);
                    }
                    this.loadCarts()
                })
            },
            //獲取購物車列表
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
                console.log("updataCart")
                let url =this.url+'/cart/update'
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .post(url,this.cartArr).then((response)=>{
                    let json = response.data
                    console.log("JSON", json)
                    if (json.serviceCode === 20000) {
                        //跳轉到付款頁面
                        // location.href = this.url
                        // location.href="/order/list"
                        this.$router.push({path: '/order/list'})
                    } else if (json.serviceCode === 40004 ||json.serviceCode === 40001 ||json.serviceCode === 40002){
                        this.open()
                    }else{
                        this.$message.error(json.message)
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
            let pageNum = location.search.split("&")[0].split("=")[1];
            // let pageSize = location.search.split("&")[1].split("=")[1];
            this.loadCarts(pageNum);

        }
    }
</script>

<style>

</style>