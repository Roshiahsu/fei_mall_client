<template>
    <div>
        <h1>修改品牌頁面(管理員)</h1>
        <el-card>
            <!--form表單組件 驗證表單開始-->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="商品名稱:" prop="productName">
                            <el-input v-model="ruleForm.productName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品價錢:" prop="price">
                            <el-input v-model="ruleForm.price"></el-input>
                        </el-form-item>
                    </el-col>
                    <!--上傳圖片開始-->
                    <el-col :span="12">
                        <!--上傳圖片開始-->
                        <el-form-item label="商品圖片:" prop="picture">
                            <el-input :disabled="true" v-model="ruleForm.picture"></el-input>
                            <!--action是post請求，後端要用 @PostMapping("/upload")-->
                            <el-upload
                                    ref="upload"
                                    action="http://localhost:9080/upload"
                                    name="picFile"
                                    :limit="1"
                                    :data="{picture:ruleForm.picture,oldPicture:this.oldPicture}"
                                    accept=".jpeg,.png"
                                    :headers="{'Authorization':this.jwt}"
                                    :on-preview="handlePictureCardPreview"
                                    :on-success="handleSuccess"
                                    :before-upload="onBeforeUpload"
                                    :on-change="handleChange"
                                    :file-list="fileList"
                                    :auto-upload="false"
                                    list-type="picture">
                                <el-button slot="trigger" size="small" type="primary">選取文件</el-button>
                                <div slot="tip" class="el-upload__tip">只能上傳jpg/png文件，且不超過500kb</div>
                            </el-upload>
                            <!--顯示上傳預覽圖-->
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-form-item>
                        <!--上傳圖片結束-->
                    </el-col>
                    <!--上傳圖片結束-->
                    <el-col :span="12">
                        <el-form-item label="庫存:" prop="stock">
                            <el-input v-model="ruleForm.stock"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="品牌:" prop="brandId">
                            <template>
                                <el-select placeholder="請選擇" v-model="ruleForm.brandName">
                                    <el-option v-for="c in brandArr" v-bind:key="c.id" :label="c.brandName"
                                               :value="c.id">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="推播種類:" prop="productTypeId">
                            <template>
                                <el-select placeholder="請選擇" v-model="ruleForm.productTypeName">
                                    <el-option v-for="c in productTypeList" v-bind:key="c.id" :label="c.name"
                                               :value="c.id">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>

                    <el-col :span="12">
                        <el-form-item label="有效期限:">
                            <el-date-picker
                                    align="center"
                                    v-model="ruleForm.gmtExp"
                                    type="date"
                                    placeholder="選擇日期"
                            >
                            </el-date-picker>

                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="關鍵字:" prop="keywords">
                            <el-input v-model="ruleForm.keywords"></el-input>
                            <span class="el-upload__tip">請用開空白分隔</span>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-form-item label="商品簡介:" prop="description">
                    <el-input type="textarea" v-model="ruleForm.description"></el-input>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">確認修改</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
            <!--form表單組件 驗證表單結束-->

        </el-card>
    </div>
</template>

<script>
    import {getUrl} from '@/utils/Utils';
    import {getRequest,postRequest} from "@/utils/api";
    import {haveJwt} from "@/utils/Utils";

    export default {
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                oldPicture:'',//舊的圖片名稱
                ruleForm: {
                    id:'',
                    productName: '',//商品名稱
                    price: '',      //商品價錢
                    picture: '',    //商品圖片路徑
                    brandId: '',    //品牌id
                    description: '',//商品描述
                    keywords: '',    //關鍵字
                    tags: '',        //標籤
                    stock: '',       //庫存
                    productTypeId: '',//推播ID
                    productTypeName:'',//推播名稱
                    gmtExp: '',      //有效日期
                },
                fileList: [],
                jwt: '',
                productTypeList:[],
                brandArr: [],
                id:'',
                rules: {
                    productName: [
                        {required: true, message: '請輸入品牌名稱', trigger: 'blur'},
                        {min: 2, max: 40, message: '長度在 2 到 30 個字符', trigger: 'blur'}
                    ],
                    price: [
                        {required: true, message: '請輸入商品價錢', trigger: 'blur'},
                        {pattern: /^[0-9]+?$/, message: '請輸入正確數值', trigger: 'blur'}
                    ],
                    brandId: [
                        {required: true, message: '請輸入品牌', trigger: 'blur'},
                    ],
                    picture: [
                        {required: true, message: '請上傳圖片', trigger: 'blur'},
                    ],
                    stock: [
                        {required: true, message: '請輸入庫存(可以為0)', trigger: 'blur'},
                        {pattern: /^[0-9]+?$/, message: '請輸入正確數值', trigger: 'blur'}
                    ],
                    picture: [
                        {required: true, message: '請上傳圖片', trigger: 'blur'},
                    ],
                    productTypeId: [
                        {required: true, message: '請選擇推播種類', trigger: 'blur'},
                    ],
                },
                url:getUrl()
            };
        },
        methods: {
            //TODO 傳送MultipartFile
            submitForm(formName) {
                console.log("ruleForm", this.ruleForm)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = "/product/update"
                        postRequest(url, this.ruleForm).then(response =>{
                            console.log("傳送json", response)
                            if (response.serviceCode === 20000) {
                                //判斷傳送表單內的圖片路徑與獲取的商品詳情圖片是否相等
                                if(this.ruleForm.picture != this.oldPicture){
                                    //不相等，重新上傳圖片
                                    console.log("更換圖片", response)
                                    this.submitUpload()
                                }
                                this.$message.success("修改成功")
                                location.reload()
                            } else {
                                this.$message.error(response.message)
                            }
                        })
                    } else {
                        this.$message.error("資料格式有誤，請檢查!")
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            /*上傳圖片相關代碼開始*/
            //預覽圖片
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //上傳成功
            handleSuccess(response, file, fileList) {
                if (response.serviceCode === 20000) {
                    console.log("上傳圖片成功")
                } else {
                    let message = response.message
                    this.$message.error(message);
                }
            },
            //上傳文件
            submitUpload() {
                // console.log(this.$refs.upload.uploadFiles[0].name)
                this.$refs.upload.submit();
            },
            //檔案上傳前先判斷大小與種類
            onBeforeUpload(file) {
                const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png';
                const isLt500K = file.size / 1024 / 512 < 1;
                if (!isIMAGE) {
                    this.$message.error('只能上傳圖片!');
                }
                if (!isLt500K) {
                    this.$message.error('上傳文件大小不能超過500KB!');
                }
                return isIMAGE && isLt500K;
            },
            //生成UUID
            getUUID() {
                var d = Date.now();
                if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                    d += performance.now();
                }
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            },
            //圖片上傳狀態改變，生成UUID
            handleChange(file, fileList) {
                //獲取副檔名
                let suffix = file.name.substring(file.name.lastIndexOf('.'))
                //uuid拼接副檔名
                this.ruleForm.picture = this.getUUID() + suffix
            },
            /*上傳圖片相關代碼結束*/
            //獲取品牌列表
            loadBrands(pageNum) {
                let url = "/brands/list?pageNum=" + pageNum

                getRequest(url).then(response=>{
                    console.log("獲取品牌列表JSON", response)
                    if (response.serviceCode === 20000) {
                        this.brandArr = response.data.list
                    } else {
                        this.$message.error(response.message)
                    }
                })
            },
            //獲取推播種類
            loadProductTypeList() {
                let url = "/product/productTypeList"
                getRequest(url).then(response=>{
                    console.log("獲取推播列表JSON", response)
                    if (response.serviceCode === 20000) {
                        this.productTypeList = response.data
                    } else {
                        this.$message.error(response.message)
                    }
                })
            },
            //獲取商品詳情
            loadProduct() {
                let url = "/product/" + this.id + "/details"
                getRequest(url).then(response=>{
                    console.log("商品詳情JSON", response)
                    if (response.serviceCode === 20000) {
                        this.ruleForm = response.data
                        this.oldPicture = response.data.picture
                    } else {
                        this.$message.error(response.message)
                    }
                })
            },
        },
        created() {
            //自動獲取
        },
        mounted() {
            this.jwt = localStorage.getItem("jwt")
            this.id = location.search.split("=")[1];
            haveJwt(this.jwt)
            //獲取品牌列表
            this.loadBrands(1);
            //獲取推播種類
            this.loadProductTypeList();
            //獲取商品詳情
            this.loadProduct()
        }
    }
</script>