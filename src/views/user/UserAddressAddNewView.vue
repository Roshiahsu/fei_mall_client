<template>
    <div>
        <h1>顧客地址新增中心</h1>
        <!--地址詳情開始-->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="20px" class="demo-ruleForm">
            <div>
                <el-descriptions title="地址詳情" direction="vertical"
                                 :column="4"
                                 style="margin-top: 10px"
                                 border
                >
                    <template slot="extra">
                        <el-button type="primary" size="small"
                                   @click="userAddressAddNew('ruleForm')"
                                   v-loading.fullscreen.lock="fullscreenLoading">確認新增
                        </el-button>
                    </template>

                    <el-descriptions-item label="居住地" span="1">
                        <el-form-item label=" " prop="city">
                            <el-input v-model="ruleForm.city" placeholder="台北市"></el-input>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="鄉鎮區" span="1">
                        <el-form-item label=" " prop="zone">
                            <el-input v-model="ruleForm.zone" placeholder="信義區"></el-input>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="郵遞區號" span="1">
                        <el-form-item label=" " prop="zipCode">
                            <el-input v-model="ruleForm.zipCode" placeholder="110"></el-input>
                        </el-form-item>
                    </el-descriptions-item>

                    <el-descriptions-item label="是否設定為預設">
                        <template>
                            <el-switch v-model="ruleForm.isDefault"
                                       :active-value="1"
                                       :inactive-value="0"
                                       active-color="#13ce66"
                                       inactive-color="#999"
                            >
                            </el-switch>
                        </template>
                    </el-descriptions-item>

                    <el-descriptions-item label="標籤">
                        <el-input v-model="ruleForm.tag" placeholder="住家"></el-input>
                    </el-descriptions-item>

                    <el-descriptions-item label="詳細地址">
                        <el-form-item label=" " prop="detailedAddress">
                            <el-input v-model="ruleForm.detailedAddress" placeholder="市府路45號"></el-input>
                        </el-form-item>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            <!--地址詳情結束-->
        </el-form>
    </div>
</template>


<script>
    import {getRequest, postRequest} from '@/utils/api'
    import {haveJwt} from "@/utils/Utils";

    export default {
        data() {
            return {
                fullscreenLoading: false,
                ruleForm: {
                    city: '',
                    zone: '',
                    zipCode: '',
                    detailedAddress: '',
                    isDefault: '',
                    tag: ''
                },
                rules: {
                    city: [
                        {required: true, message: '請輸入所在城市', trigger: 'blur'},
                    ],
                    zone: [
                        {required: true, message: '請輸入所在地(鄉、鎮、區)', trigger: 'blur'},
                    ],
                    zipCode: [
                        {required: true, message: '請輸入郵遞區號', trigger: 'blur'},
                        {min: 3, max: 3, message: '請輸入三碼郵遞區號', trigger: 'blur'}
                    ],
                    detailedAddress: [
                        {required: true, message: '請輸入地址', trigger: 'blur'},
                    ],
                },
            };
        },
        methods: {
            userAddressAddNew(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = "/address/insert"
                        postRequest(url, this.ruleForm).then(response => {
                            if (response.serviceCode === 20000) {
                                this.fullscreenLoading = true;
                                this.$message.success("新增完成")
                                setTimeout(() => {
                                    this.fullscreenLoading = false;
                                    // location.href="/customerCenter"
                                    this.$router.push({path: '/customerCenter'})
                                }, 500);
                            }else{
                                this.$message.error(response.message)
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        },
        created() {

        },
        mounted() {
            //haveJwt()為 utils包下的方法
            haveJwt(localStorage.getItem('jwt'))
        }
    }
</script>
<style>
    .el-form-item {
        margin: 0;
    }

</style>