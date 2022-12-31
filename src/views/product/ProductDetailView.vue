<template>
<div>
    <h1 style="margin: 20px 0;">{{product.productName}}</h1>
        <!--行間距-->
        <el-row :gutter="20">
            <!--:span 佈局-->
            <el-col :span="12">
                <el-card :body-style="{ padding: '0px' }">
                    <img
                            :src="'/productImg/' + url "
                            class="image">
                    <div style="padding: 14px;">
                        <span>{{product.productName}}</span>
                        <div class="bottom clearfix">
                            <el-button type="text" class="button" @click="addNewCart()">加入購物車</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <p >
                    <span style="font-size:25px">價錢：{{product.price}}NT</span>
                </p>
                <template>
                    <span style="font-size:20px">購買數量：</span>
                    <el-select v-model="quantity" placeholder="購買數量" size="small">
                        <el-option  :value=o v-for="o in 9"></el-option>
                    </el-select>
                </template>
                <p >
                    <span style="font-size:20px" >剩餘數量：{{product.stock}}</span>
                    <el-button style="float: right; font-size: 20px" type="text" @click="addNewCart()">加入購物車</el-button>
                </p>


                <!--分割線-->
                <el-divider></el-divider>
                <p style="font-size: 25px;font-weight: bold">
                    <span style="color: #999;font-size: 15px">
                            {{product.description}}
                        </span>
                </p>
            </el-col>
        </el-row>
</div>
</template>



<script>
    export default {
        data() {
            return {
                product:[],
                url:'',
                jwt:'',
                id:'',
                quantity:'',
            };
        },
        methods: {
            loadBrands(){
                //自動獲取
                let url = "http://localhost:9080/product/"+this.id+"/details"
                this.axios
                .get(url).then((response)=>{
                    let json=response.data
                    console.log("JSON",json)
                    if(json.serviceCode===20000){
                        this.product=json.data
                        this.url = json.data.picture
                    }else {
                        this.$message.error(json.message)
                    }
                })
            },
            addNewCart(){
                let productAddNewDTO={
                    spuId:this.id,
                    price:this.product.price,
                    quantity:this.quantity
                }

                console.log(productAddNewDTO)
                let url = "http://localhost:9080/cart/insert"
                this.axios
                .post(url,productAddNewDTO).then((response)=>{
                    let json=response.data
                    console.log("JSON",json)
                    if(json.serviceCode===20000){
                        this.$message.success("新增成功")
                    }else {
                        this.$message.error(json.message)
                    }
                })
            }
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            this.id = location.search.split("=")[1];
            this.loadBrands();
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

    .el-form-item__label{
        font-size: 20px;
        text-align: left;
    }

    /*card*/
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }


</style>