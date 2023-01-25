<template>
    <div>
        <h1 style="margin: 20px 0;">添加類別頁面</h1>
        <!--表單開始-->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="類別名稱 " prop="categoryName">
                <el-input v-model="ruleForm.categoryName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即創建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <!--表單結束-->
        <el-divider></el-divider>
        <h1>品牌列表</h1>
        <router-view/>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                ruleForm: {
                    categoryName: '',
                },
                rules: {
                    categoryName: [
                        { required: true, message: '請輸入類別名稱', trigger: 'blur' },
                        { min: 2, max: 15, message: '  長度在 2 到 15 個字符', trigger: 'blur' }
                    ],
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log("data>>>")
                        console.log(this.ruleForm)
                        let url="http://localhost:9080/categories/addNew";
                        this.axios
                            .create({headers:{'Authorization':localStorage.getItem("jwt")}})
                            .post(url,this.ruleForm).then((res)=>{
                            console.log(res.data)
                            if(res.data.statusCode === 20000){
                                this.$message.success("添加成功")
                                this.resetForm('ruleForm')
                            }else{
                                this.$message.error(res.data.message)
                            }
                        }).catch(function (error) {
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
            haveJwt(){
                if(this.jwt ===null){
                    this.open()
                    return
                }
            }
        },
        created() {

        },
        mounted() {
            this.jwt = localStorage.getItem("jwt")
            this.haveJwt()
        }
    }
</script>