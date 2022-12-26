<template>
    <div class="block">
        <span class="demonstration"><h4>新品推薦</h4></span>
        <el-carousel trigger="click" height="150px">
            <el-carousel-item v-for="item in 5" :key="item">
                <img :src="item.url" style="width: 100%;height: 100%" alt="">
            </el-carousel-item>
        </el-carousel>
        <el-divider></el-divider>

        <el-row :gutter="10">
            <el-col :span="12">
                <h4>熱門商品</h4>
                <el-row :gutter="10">
                    <el-col :span="12" v-for="p in 4" style="margin-top: 5px">
                        <el-card shadow="always" :body-style="{ padding: '0px' }">
                            <img swidth="230" height="230"
                                 src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                                 class="image">
                            <div style="padding: 14px;">
                                <span>好吃的汉堡</span>
                                <div class="bottom clearfix">
                                    <time class="time">{{ currentDate }}</time>
                                    <el-button type="text" class="button">操作按钮</el-button>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <h4>優惠商品</h4>
                <el-row :gutter="10">
                    <el-col :span="12" v-for="p in 4" style="margin-top: 5px">
                        <el-card :body-style="{ padding: '0px' }">
                            <img swidth="230" height="230"
                                 src="/au.png"
                                 class="image">
                            <div style="padding: 14px;">
                                <span>好吃的汉堡</span>
                                <div class="bottom clearfix">
                                    <time class="time">{{ currentDate }}</time>
                                    <el-button type="text" class="button">操作按钮</el-button>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

    </div>

</template>

<script>
    export default {
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: [],
                ruleForm: {
                    name: '',
                    pinyin: '',
                    logo: '',
                    categoryId: '',
                    description: '',
                    keywords: '',
                    sort: '',
                },
                jwt: '',
                categoryArr: [],
                rules: {
                    username: [
                        {required: true, message: '請輸入品牌名稱', trigger: 'blur'},
                        {min: 2, max: 15, message: '長度在 2 到 15 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '請輸入品牌拼音', trigger: 'blur'},
                        {min: 2, max: 25, message: '長度在 2 到 25 个字符', trigger: 'blur'}
                    ],
                    sort: [
                        {pattern: /^[1-9]{1}[0-9]?$/, message: '必須是0-99的值', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //分開2行查看結果
                        //console.log('data>>>'+this.ruleForm)，一行輸出會是Object，無法點開查看
                        console.log('data>>>' + this.ruleForm)
                        console.log(this.ruleForm)
                        //向服務端發送請求
                        let url = "http://localhost:9080/brands/addNew";
                        this.axios.create({
                            headers: {'Authorization': this.jwt}
                        }).post(url, this.ruleForm).then((response) => {
                            console.log(response.data)
                            if (response.data.statusCode === 20000) {
                                this.$message.success("添加成功")
                                this.submitUpload()
                                this.resetForm(formName)
                            } else {
                                let message = response.data.message
                                this.$message.error(message);
                            }
                        }).catch(function (error) { //響應成功會走then，響應失敗走catch
                            console.log("響應結果失敗")
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            /*上傳圖片相關代碼開始*/
            handleRemove(file, fileList) {
                /*file 表示要刪除的文件
                * file.response代表文件上傳成功後，服務器響應的數據(後台return filename所以這邊是filename)*/
                console.log(file, fileList);
                let url = "http://localhost:9080/remove?name=";
                this.axios.get(url + file.response).then(function (response) {
                        alert("服務器圖片，刪除成功!!!")
                    }
                )
            },
            handleSuccess(response, file, fileList) {
                //response=file.response
                console.log("file=" + file)
                console.log("文件上傳成功,圖片名=" + response)
                this.ruleForm.logo = response;
            },
            /*上傳圖片相關代碼結束*/
        },
        created() {
            //自動獲取
        },
        mounted() {
            this.jwt = localStorage.getItem("jwt")
            let url = "http://localhost:9080/categories"
            this.axios
                .create({headers: {'Authorization': this.jwt}})
                .get(url).then((response) => {
                console.log(response.data)
                this.categoryArr = response.data.data
            }),
                this.resetForm('ruleForm')
        }
    }
</script>
<style>
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }


    /*card*/
    .time {
        font-size: 13px;
        color: #999;
    }

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