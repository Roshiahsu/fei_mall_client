<template>
<div>
    <!--增加上下邊距-->
    <h1 style="margin: 20px 0;">管理員列表頁面</h1>

    <el-table
            :data="tableData"
            border
            style="width: 100%">
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="username" label="用戶名" width="120" align="center"></el-table-column>
        <el-table-column prop="nickname" label="暱稱" width="120" align="center"></el-table-column>
        <el-table-column prop="rewardPoint" label="紅利積分" align="center"></el-table-column>
        <el-table-column prop="roleName" label="用戶權限" align="center"></el-table-column>
        <el-table-column prop="phone" label="電話" align="center" ></el-table-column>
        <el-table-column prop="email" label="e-mail" align="center" width="180"></el-table-column>
        <el-table-column
                prop="isEnable"
                label="是否啟用"
                align="center"
                width="130"
                >
            <template slot-scope="scope">
                <el-switch v-model="scope.row.isEnable"
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
                width="80">
            <template slot-scope="scope">
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
                tableData:[],
                utl:'http://localhost:9080'
            };
        },
        methods: {
            //刪除
            handleDelete(id){
                console.log(id)
                //更改數據ByID
            },
            loadAdmins(){
                //自動獲取
                let url=this.url+"/user/userInfo"
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
            var jwt=localStorage.getItem("jwt")
            this.loadAdmins();
        }
    }
</script>