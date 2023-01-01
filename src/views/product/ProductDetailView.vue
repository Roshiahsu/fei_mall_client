<template>
    <div>
        <!--行間距-->
        <el-row :gutter="20">
            <!--圖片區-->
            <el-col :span="12">
                <el-card :body-style="{ padding: '0px' }">
                    <img
                            :src="require('@/assets/productImg/'+url)"
                            class="image">
                    <div style="padding: 14px;">
                        <span>{{product.productName}}</span>
                        <div class="bottom">
                            <el-button type="text" class="button" @click="addNewCart()">加入購物車</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <!--文字敘述區-->
            <el-col :span="12">
                <span class="font-size" style="font-weight:bold">{{product.productName}}</span>
                <p>
                    <span class="font-size" style="color: red;">NT$：{{product.price}}NT</span>
                </p>
                <template>
                    <span class="font-size">購買數量：</span>
                    <el-select v-model="quantity" placeholder="購買數量" size="small">
                        <el-option :value=o v-for="o in 9"></el-option>
                    </el-select>
                </template>
                <p>
                    <span class="font-size">剩餘數量：{{product.stock}}
                    <el-button class="font-size" style="float: right" type="text" @click="addNewCart()">加入購物車</el-button>
                </span>
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
                product: [],
                url: '',
                jwt: '',
                id: '',
                quantity: '',
            };
        },
        methods: {
            loadBrands() {
                //自動獲取
                let url = "http://localhost:9080/product/" + this.id + "/details"
                this.axios
                    .get(url).then((response) => {
                    let json = response.data
                    console.log("JSON", json)
                    if (json.serviceCode === 20000) {
                        this.product = json.data
                        this.url = json.data.picture
                    } else {
                        this.$message.error(json.message)
                    }
                })
            },
            addNewCart() {
                let productAddNewDTO = {
                    spuId: this.id,
                    price: this.product.price,
                    quantity: this.quantity
                }

                console.log(productAddNewDTO)
                let url = "http://localhost:9080/cart/insert"
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .post(url, productAddNewDTO).then((response) => {
                    let json = response.data
                    console.log("JSON", json)
                    if (json.serviceCode === 20000) {
                        this.$message.success("新增成功")
                    } else if (json.serviceCode === 40004){
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
                        location.href = "/login"
                    }
                });
            }
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            this.jwt = localStorage.getItem("jwt")
            this.id = location.search.split("=")[1];
            this.loadBrands();
        }
    }
</script>

<style>
    body {
        font: 18px "Microsoft YaHei UI";
        margin: 0;
    }

    header a {
        text-decoration: none;
        color: #6c6c6c;
    }

    header a:hover {
        color: #0aa1ed;
    }
    p {
        margin: 20px 0
    }
    .font-size {
        font-size: 20px
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