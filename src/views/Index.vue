<template>
    <div class="block">
        <!--   新品推薦輪播圖開始     -->
        <span class="demonstration"><h4>新品推薦</h4></span>
        <div style="width: 700px;margin: 0 auto" >
            <el-carousel trigger="click" height="270px" type="card"  >
                <el-carousel-item v-for="item in newProductArr" >
                    <img width="100%" height="100%"
                         :src="require('@/assets/productImg/'+ item.picture)"
                         class="image"
                         @click="productDetails(item.id)">
                </el-carousel-item>
            </el-carousel>
        </div>
        <!--   新品推薦輪播圖結束     -->

        <el-divider></el-divider>

        <el-row :gutter="10">
            <!--   熱門商品開始     -->
            <el-col :span="12">
                <h4>熱門商品</h4>
                <el-row :gutter="gutter">
                    <el-col :span="12" v-for="item in hotProductArr" style="margin-top: 10px" :key="item.id" >
                        <el-card shadow="always" :body-style="{ padding: '0px' }">
                            <img :width=imgWidth :height=imgHeight
                                 :src="require('@/assets/productImg/'+ item.picture)"
                                 class="image"
                                 @click="productDetails(item.id)">
                            <div style="padding: 14px;">
                                <span>{{item.productName}}</span>
                                <div class="bottom ">
                                    <el-button type="text" class="button" @click="productDetails(item.id)">商品詳情</el-button>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <!--   熱門商品結束     -->
            <!--   優惠商品開始     -->
            <el-col :span="12">
                <h4>優惠商品</h4>
                <el-row :gutter="gutter">
                    <el-col :span="12" v-for="item in discountedProductArr" style="margin-top: 10px">
                        <el-card :body-style="{ padding: '0px' }">
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
            </el-col>
            <!--   優惠商品結束     -->
        </el-row>

    </div>

</template>

<script>
    const newProduct =2
    const hotProduct =3
    const discountedProduct =4

    export default {
        data() {
            return {
                gutter:15,
                jwt: '',
                categoryArr: [],
                newProductArr:[],
                hotProductArr:[],
                discountedProductArr:[],
                imgWidth:250,
                imgHeight:250,
            };
        },
        methods: {
            productDetails(id){
                location.href = "/product/details?id="+id
            },
        },
        created() {
            //自動獲取
        },
        /*
            查詢商品
            newProduct = 新品推薦
            hotProduct = 熱門商品
            discountedProduct = 優惠商品
         */
        //TODO 冗余代碼提取成方法
        mounted() {
            let url = "http://localhost:9080/product/"+newProduct+"/listProduct?pageNum=1&pageSize=4"
            this.axios
                .get(url).then((response) => {
                if (response.data.serviceCode === 20000) {
                   this.newProductArr = response.data.data.list
                } else {
                    let message = response.data.message
                    this.$message.error(message);
                }
            }).catch(function (error) { //響應成功會走then，響應失敗走catch
                    console.log("響應結果失敗")
            }),
                url = "http://localhost:9080/product/"+hotProduct+"/listProduct?pageNum=1&pageSize=6"
            this.axios
                .get(url).then((response) => {
                console.log("獲取的資料",response.data)
                if (response.data.serviceCode === 20000) {
                    this.hotProductArr = response.data.data.list
                } else {
                    let message = response.data.message
                    this.$message.error(message);
                }
            }).catch(function (error) { //響應成功會走then，響應失敗走catch
                console.log("響應結果失敗")
            }),
            url = "http://localhost:9080/product/"+discountedProduct+"/listProduct?pageNum=1&pageSize=6"
            this.axios
                .get(url).then((response) => {
                if (response.data.serviceCode === 20000) {
                    this.discountedProductArr = response.data.data.list
                } else {
                    let message = response.data.message
                    this.$message.error(message);
                }
            }).catch(function (error) { //響應成功會走then，響應失敗走catch
                console.log("響應結果失敗")
            })
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

    /*跑馬燈開始*/
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    /*跑馬燈結束*/


    /*card開始*/
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

    /*card結束*/
</style>