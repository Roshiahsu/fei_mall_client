<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin' }">首頁</el-breadcrumb-item>
        <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
        <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--增加上下邊距-->
    <h1 style="margin: 20px 0;">管理員列表頁面</h1>

    <el-table
            :data="tableData"
            border
            style="width: 100%">
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="username" label="用戶名" width="120" align="center"></el-table-column>
        <el-table-column prop="nickname" label="暱稱" width="120" align="center"></el-table-column>
<!--        <el-table-column prop="logo" label="圖片URL" align="center"></el-table-column>-->
<!--        <el-table-column prop="description" label="品牌描述" align="center"></el-table-column>-->
        <el-table-column prop="phone" label="電話" align="center" ></el-table-column>
        <el-table-column prop="email" label="e-mail" align="center" width="70"></el-table-column>
        <el-table-column prop="enable" label="是否啟用" align="center" width="100"></el-table-column>
        <el-table-column
                prop="enable"
                label="是否啟用"
                align="center"
                width="130"
                >
            <template slot-scope="scope">
                <el-switch v-model="scope.row.enable"
                           :active-value="1"
                           :inactive-value="0"
                           active-color="#13ce66"
                           inactive-color="#999"
                disabled>
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column
                label="操作"
                align="center"
                width="130">
            <template slot-scope="scope">
                <el-button @click="openDeleteConfirm(scope.row.id)" type="info" icon="el-icon-delete" size="mini" circle></el-button>
                <el-button
                        style="background-color:darkorchid"
                        size="mini"
                        type="info"
                        icon="el-icon-setting"
                        @click="handleEdit(scope.row.id)" circle></el-button>
            </template>
        </el-table-column>
    </el-table>

</div>
</template>



<script>
    export default {
        data() {
            return {
                ruleForm: {
                    id:'',
                    username: '',
                    nickname: '',
                    email: '',
                    phone: '',
                    isEnable:'',
                    rewardPoint:'',
                    roleName:''
                },
                tableData:[]
            };
        },
        methods: {
            handleDelete(id){
                console.log(id)
                //deleteById
                let url="http://localhost:9081/admins/"+id+"/delete"
                this.axios.post(url).then((response)=>{
                    let json = response.data;
                    if(json.code==20000){
                        this.$message.success("刪除成功")
                    }else{
                        let message = response.data.message
                        this.$message.error(message);
                    }
                    this.loadAdmins()
                })
            },
            handleEdit(id){
                console.log(id)
                //更改數據ByID
            },
            loadAdmins(){
                //自動獲取
                let url="http://localhost:9080/user/userInfo"
                this.axios.get(url).then((response)=>{
                    let json=response.data
                    console.log(json)
                    if(json.serviceCode===20000){
                        this.tableData=json.data;
                    }else{
                        this.$message.error(json.message)
                    }
                    console.log(this.tableData)
                })
            },
            openDeleteConfirm(id) {
                console.log(id)
                this.$confirm('此操作將永久删除该品牌, 是否繼續?', '提示', {
                    confirmButtonText: '繼續', //點確認走then
                    cancelButtonText: '取消', //點取消走catch
                    type: 'warning'
                }).then(() => {
                   this.handleDelete(id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        created() {

        },
        mounted() {
            this.loadAdmins();
        }
    }
</script>