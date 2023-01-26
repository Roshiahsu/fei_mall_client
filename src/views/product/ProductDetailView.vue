<template>
    <div>
        <!--行間距-->
        <el-row :gutter="20">
            <!--圖片區-->
            <el-col :span="12">
                <el-card :body-style="{ padding: '0px' }" >
                    <img v-if="picture"
                            :height=400
                            :src="require('@/assets/productImg/'+picture)"
                            class="image">
                    <div style="padding: 14px;">
                        <span>{{product.productName}}</span>
                        <div class="bottom">
<!--                            <el-button type="text" class="button" @click="addNewCart()">加入購物車</el-button>-->
                        </div>
                    </div>
                </el-card>
            </el-col>
            <!--文字敘述區-->
            <el-col :span="12">
                <span class="font-size" style="font-weight:bold">{{product.productName}}</span>
                <p>
                    <span class="font-size" v-if="product.gmtExp != null">有效期限：{{product.gmtExp.substring(0,0+10)}}</span>
                </p>
                <p>
                    <span class="font-size" style="color: red;">NT$：{{product.price}}NT</span>
                </p>
                <template>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                        <el-form-item label="購買數量：" prop="quantity">
                            <el-select v-model="ruleForm.quantity" placeholder="購買數量" size="small">
                                <el-option :value=o v-for="o in 9" ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </template>
                <p>
                    <span class="font-size">剩餘數量：{{product.stock}}
                    <el-button icon="el-icon-shopping-cart-2" class="font-size" style="float: right" type="primary" @click="addNewCart('ruleForm')">加入購物車</el-button>
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
            //自定義驗證規則
            var validateQuantity = (rule, value, callback) => {
                //如果輸入的數值大於庫存
                if (value > this.product.stock) {
                    callback(new Error('庫存不足'));
                }else {
                    callback()
                }
            };
            return {
                product: [],
                picture: '',
                jwt: '',
                id: '',
                url:'http://localhost:9080',
                ruleForm: {
                    quantity:''
                },
                rules: {
                    quantity: [
                        {required: true, message: '請輸入購買數量', trigger: 'change'},
                        {validator: validateQuantity ,trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            loadProduct() {
                //自動獲取
                let url = this.url+"/product/" + this.id + "/details"
                this.axios
                    .get(url).then((response) => {
                    let json = response.data
                    console.log("JSON", json)
                    if (json.serviceCode === 20000) {
                        this.product = json.data
                        this.picture = json.data.picture
                    } else {
                        this.$message.error(json.message)
                    }
                })
            },
            //新增購物車
            addNewCart(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let productAddNewDTO = {
                            spuId: this.id,
                            price: this.product.price,
                            quantity: this.ruleForm.quantity,
                        }

                        console.log(productAddNewDTO)
                        let url = this.url+"/cart/insert"
                        this.axios
                            .create({headers:{'Authorization':this.jwt}})
                            .post(url, productAddNewDTO).then((response) => {
                            let json = response.data
                            console.log("JSON", json)
                            if (json.serviceCode === 20000) {
                                this.$message.success("新增成功")
                            } else if (json.serviceCode === 40004 || json.serviceCode === 40002){
                                this.open()
                            }else{
                                this.$message.error(json.message)
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            open() {
                this.$alert('請先登入', '尚未登入', {
                    confirmButtonText: '確定',
                    callback: action => {
                        // location.href = "/login"
                        this.$router.push({path: '/login'})
                    }
                });
            }
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            this.jwt = localStorage.getItem("jwt")
            this.id = location.search.split("=")[1];
            this.loadProduct();
        }
    }
</script>

<style>

    header a:hover {
        color: #0aa1ed;
    }
    p {
        margin: 20px 0
    }
    .font-size {
        font-size: 20px
    }
    .el-form-item__label {
        font-size: 20px;
        padding: 0;
    }
    /*card*/
    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
        font-size: 18px;
    }

    .image {
        width: 100%;
        display: block;
        object-fit:contain;
    }


</style>