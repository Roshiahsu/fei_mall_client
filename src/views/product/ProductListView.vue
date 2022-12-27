<template>
<div>
    <h1 style="margin: 20px 0;">商品介紹</h1>
    <el-row :gutter="10">
        <el-col :span="6" v-for="item in brandArr"style="margin-top:10px" >
            <el-card :body-style="{ padding: '0px' }">
                <img swidth="230" height="230"
                     :src="'/productImg/'+ item.picture"
                     class="image"
                     @click="productDetails(item.id)">
                <div style="padding: 14px;">
                    <span>{{item.productName}}</span>
                    <div class="bottom clearfix">
                        <el-button type="text" class="button" @click="productDetails(item.id)">商品詳情</el-button>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
</div>
</template>



<script>
    const allProduct =1
    export default {
        data() {
            return {
                brandArr:[],
                jwt:''
            };
        },
        methods: {
            productDetails(id){
                location.href = "http://localhost:8080/product/details?="+id
            },
            loadBrands(){
                //自動獲取
                let url = "http://localhost:9080/product/"+allProduct+"/listProduct"
                this.axios
                .get(url).then((response)=>{
                    let json=response.data
                    console.log("JSON",json)
                    if(json.serviceCode===20000){
                        this.brandArr=json.data
                    }else {
                        this.$message.error(json.message)
                    }
                })
            },
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            this.loadBrands();
        }
    }
</script>

<style>
    header a{
        text-decoration: none;
        color: #6c6c6c;
    }
    header a:hover{
        color: #0aa1ed;
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