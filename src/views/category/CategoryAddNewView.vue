<template>
    <div>
        <!--麵包屑start-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/admin/category/list">類別管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>新增類別</el-breadcrumb-item>
        </el-breadcrumb>
        <!--麵包屑end-->
        <h1 style="margin: 20px 0;">添加類別頁面</h1>
        <!--表單開始-->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="類別名稱 " prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="父級類別ID" prop="parentId">
                <template>
                    <el-select placeholder="請選擇" v-model="ruleForm.parentId">
                        <el-option v-for="c in parentArr" v-bind:key="c.id" :label="c.name" :value="c.id"></el-option>
                    </el-select>
                </template>
            </el-form-item>
            <el-form-item label="關鍵字" prop="keywords">
                <el-input v-model="ruleForm.keywords"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="ruleForm.sort"></el-input>
            </el-form-item>
            <el-form-item label="圖片URL" prop="icon">
                <el-input v-model="ruleForm.icon"></el-input>
            </el-form-item>
            <el-form-item label="是否啟用" prop="enable">
<!--                <el-input v-model="ruleForm.enable"></el-input>-->
                <el-switch
                        v-model="ruleForm.enable"
                        active-value="1"
                        inactive-value="0"
                        active-color="#13ce66"
                        inactive-color="#999">
                </el-switch>
            </el-form-item>
            <el-form-item label="是否顯示在導航欄" prop="isDisplay">
<!--                <el-input v-model="ruleForm.isDisplay"></el-input>-->
                <el-switch
                        v-model="ruleForm.isDisplay"
                        active-value="1"
                        inactive-value="0"
                        active-color="#13ce66"
                        inactive-color="#999">
                </el-switch>
            </el-form-item>
            <el-form-item label="是否為父級" prop="isParent">
<!--                <el-input v-model="ruleForm.isParent"></el-input>-->
                <el-switch
                        v-model="ruleForm.isParent"
                        active-color="#13ce66"
                        inactive-color="#999">
                </el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <!--表單結束-->
    </div>
</template>
<script>
    export default {
        data() {
            return {
                ruleForm: {
                    name: '',
                    parentId: "",
                    keywords: '',
                    sort:'',
                    icon: '',
                    enable: '',
                    isDisplay: '',
                    isParent: '',
                },
                parentArr:[],
                rules: {
                    name: [
                        { required: true, message: '請輸入類別名稱', trigger: 'blur' },
                        { min: 2, max: 15, message: '  長度在 2 到 15 个字符', trigger: 'blur' }
                    ],
                    sort: [
                        {pattern:/^[1-9]{1}[0-9]?$/,message:'必須是0-99的值',trigger: 'blur'}
                    ]
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
                            if(res.data.statusCode == 20000){
                                this.$message.success("添加成功")
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
            }
        },
        created() {
            //自動獲取

        },
        mounted() {
            let url="http://localhost:9080/categories"
            this.axios
                .create({headers:{'Authorization':localStorage.getItem("jwt")}})
                .get(url).then((response)=>{
                console.log(response.data)
                this.parentArr=response.data.data
                console.log(this.parentArr)
            })
        }
    }
</script>