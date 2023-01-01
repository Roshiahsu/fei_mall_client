<template>
<div>
    <h1 style="margin: 20px 0;">商品介紹</h1>
    <div  style="width: 150px;margin: 0 auto">
        <span v-for=" i in pages" :key="i">
            <a :href="'/product/list?page=' + i">{{i}}</a><el-divider direction="vertical"></el-divider>
        </span>
    </div>
    <el-divider></el-divider>

    <el-row :gutter="10">
        <el-col :span="6" v-for="item in brandArr" style="margin-top:10px" >
            <el-card :body-style="{ padding: '0px' }">
                <img :width=imgWidth :height=imgHeight
                     :src="require('@/assets/productImg/'+ item.picture)"
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
                jwt:'',
                url:"http://localhost:9080/product/",
                imgWidth:250,
                imgHeight:250,

            };
        },
        methods: {
            productDetails(id){
                location.href = "/product/details?="+id
            },
            loadBrands(pageNum){
                //自動獲取
                let url = this.url+allProduct+"/listProduct?pageNum="+pageNum+"&pageSize=8"
                this.axios
                .get(url).then((response)=>{
                    let json=response.data
                    console.log("JSON",json)
                    if(json.serviceCode===20000){
                        this.brandArr=json.data.list
                        this.pages = json.data.pages
                    }else {
                        this.$message.error(json.message)
                    }
                })
            },
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            let pageNum = location.search.split("&")[0].split("=")[1];
            // let pageSize = location.search.split("&")[1].split("=")[1];
            this.loadBrands(pageNum);
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
/*card*/
    .bottom {
        margin-top: 10px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
        font-size: 20px;
    }

    .image {
        width: 100%;
        display: block;
    }

</style>