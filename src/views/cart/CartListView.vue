<template>
<div>
    <h1>購物車</h1>
    <div style="width: 150px;margin: 0 auto">
        <span v-for=" i in pages" :key="i">
            <a :href="'/cart/list?page=' + i ">{{i}}</a><el-divider direction="vertical"></el-divider>
        </span>
    </div>
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
                    <el-input-number size="mini" :min="1" :max="10" @change="handleChange(scope.row)"  v-model="scope.row.quantity" ></el-input-number>
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
                @click="productDetails(item.id)">前往結賬</el-button>
</div>
</template>



<script>
    export default {
        data() {
            return {
                cartArr:[],
                jwt:"",
                url:"http://localhost:9080/cart/",
                subtotal:"",
                pages:'',
                totalPrice:'',
            };
        },
        methods: {
            handleDelete(id){
                console.log(id)
                //待完成
                let url=this.url+id+"/delete"
                this.axios.create({
                    headers:{'Authorization':this.jwt}
                }).
                post(url).then((response)=>{
                    let json = response.data;
                    if(json.serviceCode===20000){
                        this.$message.success("刪除成功")
                    }else{
                        let message = response.data.message
                        this.$message.error(message);
                    }
                    this.loadBrands()
                })
            },
            loadCarts(pageNum){
                //自動獲取

                let url=this.url+"list?pageNum="+pageNum+"&pageSize=8"
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .get(url).then((response)=>{
                    let json=response.data
                    console.log("JSON",json)
                    if(json.serviceCode===20000){
                        this.cartArr=json.data.list
                        this.pages = json.data.pages
                        this.total()
                    }else {
                        this.$message.error(json.message)
                    }
                })
            },
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
            //計算更改商品數量金額
            handleChange(spu) {
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
            }
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            this.jwt = localStorage.getItem("jwt")
            let pageNum = location.search.split("&")[0].split("=")[1];
            // let pageSize = location.search.split("&")[1].split("=")[1];
            this.loadCarts(pageNum);

        }
    }
</script>

<style>
    body{
        font: 18px "Microsoft YaHei UI";
        margin: 0;
    }
    header a{
        text-decoration: none;
        color: #6c6c6c;
    }
    header a:hover{
        color: #0aa1ed;
    }



</style>