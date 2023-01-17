<template>

<!--    沒功能，暫不完成-->
    <div>
        <!--麵包屑組件-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin' }">首頁</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/admin/admin/list">管理員管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>添加管理員</el-breadcrumb-item>
        </el-breadcrumb>
        <!--增加上下邊距-->
        <h1 style="margin: 20px 0;">添加管理員頁面</h1>
        <el-card>
                    <!--form表單組件 驗證表單開始-->
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                        <el-form-item label="管理員名稱" prop="username">
                            <el-input v-model="ruleForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="管理員密碼" prop="password">
                            <el-input v-model="ruleForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="管理員暱稱" prop="nickname">
                            <el-input v-model="ruleForm.nickname"></el-input>
                        </el-form-item>
                        <!--上傳圖片開始-->
                        <el-form-item label="品牌logo的Url" prop="logo" >
                            <el-input :disabled="true" v-model="ruleForm.logo"></el-input>
                            <!--上傳框下移10px-->
                            <el-upload style="position: relative; top: 10px"
                                    action="http://localhost:9080/upload"
                                    name="picFile"
                                    :limit="1"
                                    list-type="picture-card"
                                    :on-preview="handlePictureCardPreview"
                                    :on-success="handleSuccess"
                                    :on-remove="handleRemove">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-form-item>
                        <!--上傳圖片結束-->
                        <el-form-item label="管理員權限" prop="categoryId">
<!--                            <el-input v-model="ruleForm.categoryId"></el-input>-->
                            <template>
                                <!--添加選擇標籤，選擇匡母標籤，添加v-model="Product.categoryId"
                               把 values 的值c.id覆值給Product.categoryId 建立2資料表的關聯性-->
                                <el-select placeholder="請選擇" v-model="ruleForm.roleId">
                                    <!--添加選項，從category獲取分類-->
                                    <el-option v-for="c in roleArr" v-bind:key="c.id">
                                    </el-option>
                                </el-select>
                            </template>
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
                    username: '',
                    password: '',
                    logo: '',
                    roleId: '',
                    description: '',
                    keywords:'',
                    sort: '',
                    nickname:'',
                },
                jwt:'',
                roleArr:[],
                rules: {
                    username: [
                        { required: true, message: '請輸入管理員名稱', trigger: 'blur' },
                        { min: 2, max: 15, message: '長度在 2 到 15 個字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '請輸入管理員密碼', trigger: 'blur' },
                        { min: 2, max: 25, message: '長度在 2 到 25 個字符', trigger: 'blur' }
                    ],
                    nickname: [
                        { required: true, message: '請輸入管理員暱稱', trigger: 'blur' },
                        { min: 2, max: 25, message: '長度在 2 到 25 個字符', trigger: 'blur' }
                    ],

                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //分開2行查看結果
                        //console.log('data>>>'+this.ruleForm)，一行輸出會是Object，無法點開查看
                        console.log('data>>>'+this.ruleForm)
                        console.log(this.ruleForm)
                        //向服務端發送請求
                        let url="http://localhost:9081/admins/addNew";
                        console.log(this.jwt)
                        this.axios
                            .create({headers:{'Authorization':this.jwt}})
                            .post(url,this.ruleForm).then((response)=>{
                            console.log(response.data)
                            if(response.data.statusCode==20000){
                                this.$message.success("添加成功")
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
                console.log("文件上傳成功,圖片名=" + response )
                this.ruleForm.logo = response;
            },
            /*上傳圖片相關代碼結束*/
        },
        created() {
            //自動獲取
            this.jwt=localStorage.getItem("jwt")
        },
        mounted() {
            let url="http://localhost:9081/admins/listRole"
            console.log("jwt",this.jwt)
            this.axios
                .create({headers:{'Authorization':this.jwt}})
                .get(url).then((response)=>{
                console.log(response.data.data)
                this.roleArr=response.data.data
            })


        }
    }
</script>