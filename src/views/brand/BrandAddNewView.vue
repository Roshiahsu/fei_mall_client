<template>
    <div>
        <h1>添加品牌頁面</h1>
        <el-card>
            <!--form表單組件 驗證表單開始-->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="品牌名稱" prop="brandName">
                    <el-input v-model="ruleForm.brandName"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">立即創建</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
            <!--form表單組件 驗證表單結束-->
        </el-card>

        <el-divider/>
       <router-view/>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                pages:"",
                brandArr: [],
                ruleForm: {
                    brandName: '',
                },
                jwt:'',
                rules: {
                    brandName: [
                        {required: true, message: '請輸入品牌名稱', trigger: 'blur'},
                        {min: 2, max: 15, message: '長度在 2 到 15 個字符', trigger: 'blur'}
                    ],
                }
            };
        },
        methods: {
            //表單驗證，並發送添加品牌的請求
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = "http://localhost:9080/brands/insert";
                        this.axios
                            .create({headers:{'Authorization':localStorage.getItem("jwt")}})
                            .post(url, this.ruleForm).then((response) => {
                            let json = response.data
                            if (json.serviceCode === 20000) {
                                this.$message.success("添加成功")
                                this.resetForm(formName)
                                location.href="/brand/addNew/list"
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
            //重置表單
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            open() {
                this.$alert('請先登入', '尚未登入', {
                    confirmButtonText: '確定',
                    callback: action => {
                        location.href = "/login"
                    }
                });
            },
            created() {

            },
            mounted() {

            }
        }
    }
</script>