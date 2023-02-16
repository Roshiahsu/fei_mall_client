<template>
<div >
    <h1 >商品介紹</h1>
<!--    Pagination分頁開始-->
    <div  style="width: 150px;margin: 0 auto">
        <el-pagination
                @current-change="handleCurrentChange"
                :page-size="1"
                layout="prev, pager, next, jumper"
                :total="pages">
        </el-pagination>
    </div>
    <!--    Pagination分頁結束-->
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
    import{getRequest,postRequest} from "@/utils/api";

    const allProduct =1
    export default {
        data() {
            return {
                brandArr:[],
                pages:100,//分類頁
                pageSize:1,
                imgWidth:200,
                imgHeight:200,
            };
        },
        methods: {
            //商品詳情
            productDetails(id){
                location.href = "/product/details?="+id
            },
            //獲取商品列表
            loadProductList(pageNum){
                let url ='/product/'+allProduct+"/listProduct?pageNum="+pageNum+"&pageSize=8"
                getRequest(url).then(response=>{
                    console.log("獲取商品列表JSON",response)
                    if(response.serviceCode===20000){
                        this.brandArr=response.data.list
                        this.pages = response.data.totalPage
                        this.pageSize = response.data.pageSize
                    }else {
                        this.$message.error(response.message)
                    }
                })
            },
            //分頁功能狀態改變
            handleCurrentChange(val) {
                this.loadProductList(val)
            }
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            // let pageNum = location.search.split("&")[0].split("=")[1];
            // let pageSize = location.search.split("&")[1].split("=")[1];
            this.loadProductList(1); //預設分頁第一頁
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