<template>
<div >
    <h1 >搜尋列表{{"【"+keyword+"】"}}</h1>
    <div  style="width: 150px;margin: 0 auto">
        <span v-for=" i in pages" :key="i">
            <a href="javascript:void(0)" @click="loadSearchList(this.keyword,i)">{{i}}</a><el-divider direction="vertical"></el-divider>
        </span>
    </div>
    <el-divider></el-divider>

    <el-row :gutter="10">
        <el-col :span="6" v-for="item in brandArr" style="margin-top:10px" >
            <el-card :body-style="{ padding: '0px'}">
                <img :width=imgWidth :height=imgHeight
                     :src="require('@/assets/productImg/'+ item.picture)"
                     class="image"
                     @click="productDetails(item.id)">
                <div style="padding: 14px;">
                    <span>{{item.productName}}</span>
                    <div class="bottom">
                        <el-button type="text" class="button" @click="productDetails(item.id)">商品詳情</el-button>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>

</div>
</template>

<script>
    import {getRequest, postRequest} from '@/utils/api'
    export default {
        data() {
            return {
                brandArr:[],
                pages:'',//分類頁
                imgWidth:200,
                imgHeight:200,
                keyword:''
            };
        },
        methods: {
            productDetails(id){
                this.$router.push({path: "/product/details?="+id});
                // location.href = "/product/details?="+id
            },
            loadSearchList(keyword,pageNum){
                let url = "/search/?pageNum="+pageNum+"&pageSize=8&keywords="+keyword
                getRequest(url).then(response=>{
                    if(response.serviceCode===20000){
                        this.brandArr=response.data.list
                        this.pages = response.data.totalPage
                    }else {
                        this.$message.error(response.message)
                    }
                })
            },
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            let keyword = location.search.split("=")[1];
            this.keyword =decodeURI(keyword)//UTF-8轉成中文
            this.loadSearchList(keyword,1); //預設分頁第一頁
        }
    }
</script>

<style>

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
        object-fit:contain;
        width: 100%;
        display: block;
    }

</style>