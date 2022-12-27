<template>
<div>
    <h1 style="margin: 20px 0;">商品詳情</h1>
        <!--行間距-->
        <el-row :gutter="20">
            <!--:span 佈局-->
            <el-col :span="12">
                <el-card :body-style="{ padding: '0px' }">
                    <img
                            :src="'/productImg/'+product.picture"
                            class="image">
                    <div style="padding: 14px;">
                        <span>{{product.productName}}</span>
                        <div class="bottom clearfix">
                            <el-button type="text" class="button">加入購物車</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <p style="=font-size:25px">
                    價錢：{{product.price}}NT
                </p>
                <!--分割線-->
                <el-divider></el-divider>
                <p style="font-size:15px">
                    剩餘數量：{{product.stock}}
                </p>
                <p style="font-size: 25px;font-weight: bold">
                    <span style="color: #999;font-size: 15px">
                            <!--<s>刪除線-->
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
                product:[
                ],
                jwt:''
            };
        },
        methods: {
            loadBrands(){
                let id = location.search.split("=")[1];
                //自動獲取
                let url = "http://localhost:9080/product/"+id+"/details"
                this.axios
                .get(url).then((response)=>{
                    let json=response.data
                    console.log("JSON",json)
                    if(json.serviceCode===20000){
                        this.product=json.data
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

</style>