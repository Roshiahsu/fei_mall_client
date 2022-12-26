<template>
    <el-table
            :data="categoryArr"
            style="width: 100%"
           >
        <el-table-column
                type="index"
                width="50"
                align="center">
        </el-table-column>
        <el-table-column
                prop="name"
                label="分類名"
                width="180"
                align="center">
        </el-table-column>
        <el-table-column
                prop="parentId"
                label="父級id"
                align="center">
        </el-table-column>
        <el-table-column
                prop="sort"
                label="排序"
                align="center">
        </el-table-column>
        <el-table-column
                prop="depth"
                label="深度"
                align="center">
        </el-table-column>
        <el-table-column
                prop="icon"
                label="圖片位置"
                align="center">
        </el-table-column>
        <el-table-column
                prop="enable"
                label="是否啟用"
                align="center">
        </el-table-column>
        <el-table-column
            prop="isDisplay"
            label="是否顯示"
            align="center">
        </el-table-column>
        <el-table-column
                prop="isParent"
                label="是否為父級"
                align="center">
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
</template>

<script>
    export default {
        data() {
            return {
                ruleForm: {
                    name: '',
                    parentId: '',
                    keywords: '',
                    sort:'',
                    icon: '',
                    enable: '',
                    isDisplay: '',
                    isParent: '',
                    depth:''
                },
                categoryArr:[]
            };
        },
        methods: {
            handleDelete(id){
                console.log(id)
                //deleteById
                let url="http://localhost:9080/categories/"+id+"/delete"
                this.axios.create({
                    headers:{'Authorization':localStorage.getItem("jwt")}
                }).
                post(url).then((response)=>{
                    let json = response.data;
                    if(json.statusCode==20000){
                        this.$message.success("刪除成功")
                    }else{
                        let message = response.data.message
                        this.$message.error(message);
                    }
                    this.loadCategories()
                })
            },
            handleEdit(id){
                console.log(id)
                //更改數據ByID
            },
            loadCategories(){
                //自動獲取
                let url="http://localhost:9080/categories"
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .get(url).then((response)=>{
                    let json=response.data
                    console.log("JSON",json)
                    if(json.statusCode===20000){
                        this.categoryArr=json.data
                    }else {
                        this.$message.error(response.data.message)
                    }
                })
            },
            openDeleteConfirm(id) {
                console.log(id)
                this.$confirm('此操作將永久删除该分類, 是否繼續?', '提示', {
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
        created() { //已創建 在mounted 顯示頁面之前執行
            this.jwt=localStorage.getItem("jwt")
        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            this.loadCategories();
        }
    }
</script>