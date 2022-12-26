<template>
    <div>
        <!--麵包屑組件-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin' }">首頁</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/admin/brand/list">品牌管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>添加品牌</el-breadcrumb-item>
        </el-breadcrumb>
        <!--增加上下邊距-->
        <h1 style="margin: 20px 0;">添加品牌頁面</h1>
        <el-card>
                    <!--form表單組件 驗證表單開始-->
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                        <el-form-item label="品牌名稱" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="品牌名稱拼音" prop="pinyin">
                            <el-input v-model="ruleForm.pinyin"></el-input>
                        </el-form-item>
                        <!--上傳圖片開始-->
                        <el-form-item label="品牌logo的Url" prop="logo" >
                            <el-input :disabled="true" v-model="ruleForm.logo"></el-input>
                            <!--上傳框下移10px-->
                            <!--action是post請求，後端要用 @PostMapping("/upload")-->
                            <el-upload
                                    ref="upload"
                                    action="http://localhost:9080/brands/addNew"
                                    name="picFile"
                                    :limit="1"
                                    :data="ruleForm"
                                    accept=".zip,.txt,.jpeg"
                                    :headers="{'Authorization':this.jwt}"
                                    :on-preview="handlePictureCardPreview"
                                    :on-remove="handleRemove"
                                    :on-success="handleSuccess"
                                    :file-list="fileList"
                                    :auto-upload="false"
                                    list-type="picture">
                            <!--                    <i class="el-icon-plus"></i>-->
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-form-item>
                        <!--上傳圖片結束-->
                        <el-form-item label="品牌類別" prop="categoryId">
<!--                            <el-input v-model="ruleForm.categoryId"></el-input>-->
                            <template>
                                <!--添加選擇標籤，選擇匡母標籤，添加v-model="Product.categoryId"
                               把 values 的值c.id覆值給Product.categoryId 建立2資料表的關聯性-->
                                <el-select placeholder="請選擇" v-model="ruleForm.categoryId">
                                    <!--添加選項，從category獲取分類-->
                                    <el-option v-for="c in categoryArr" v-bind:key="c.id" :label="c.name" :value="c.id">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                        <el-form-item label="品牌簡介" prop="description">
                            <el-input v-model="ruleForm.description"></el-input>
                        </el-form-item>
                        <el-form-item label="關鍵字" prop="keywords">
                            <el-input v-model="ruleForm.keywords"></el-input>
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-input v-model="ruleForm.sort"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <!--form表單組件 驗證表單結束-->

        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                ruleForm: {
                    name: '',
                    pinyin: '',
                    logo: '',
                    categoryId: '',
                    description: '',
                    keywords:'',
                    sort: '',
                },
                fileList: [],
                jwt:'',
                categoryArr:[],
                rules: {
                    name: [
                        { required: true, message: '請輸入品牌名稱', trigger: 'blur' },
                        { min: 2, max: 15, message: '長度在 2 到 15 个字符', trigger: 'blur' }
                    ],
                    pinyin: [
                        { required: true, message: '請輸入品牌拼音', trigger: 'blur' },
                        { min: 2, max: 25, message: '長度在 2 到 25 个字符', trigger: 'blur' }
                    ],
                    sort:[
                        {pattern:/^[1-9]{1}[0-9]?$/,message:'必須是0-99的值',trigger: 'blur'}
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
                        //向服務端發送請求
                        let url="http://localhost:9080/brands/addNew";
                        this.axios.create({
                            headers:{'Authorization':this.jwt}
                        }).
                        post(url,this.ruleForm).then((response)=>{
                            console.log(response.data)
                            if(response.data.statusCode==20000){
                                this.$message.success("添加成功")
                                this.resetForm(formName)
                                // location.reload()
                            }else{
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
           /*上傳圖片相關代碼開始*/
            handleRemove(file, fileList) {
                /*file 表示要刪除的文件
                * file.response代表文件上傳成功後，服務器響應的數據(後台return filename所以這邊是filename)*/
                console.log(file, fileList);
                let url="http://localhost:9080/remove?name=";
                this.axios.get(url + file.response).then(function (response) {
                        alert("服務器圖片，刪除成功!!!")
                    }
                )
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleSuccess(response, file, fileList) {
                //response=file.response
                console.log("file=" + file )
                console.log("文件上傳成功,圖片名=" + response )
                this.ruleForm.logo = response;
            },
            /*上傳圖片相關代碼結束*/
        },
        created() {
            //自動獲取
        },
        mounted() {
            this.jwt = localStorage.getItem("jwt")
            let url="http://localhost:9080/categories"
            this.axios
                .create({headers:{'Authorization':this.jwt}})
                .get(url).then((response)=>{
                console.log(response.data)
                this.categoryArr=response.data.data
            }),
                this.resetForm('ruleForm')
        }
    }
</script>