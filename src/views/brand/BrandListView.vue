<template>
<div>
    <h1>品牌列表</h1>
<!--    分頁開始-->
    <div  style="width: 150px;margin: 0 auto">
        <span v-for=" i in pages" :key="i">
            <a href="javascript:void(0)" @click="loadBrands(i)">{{i}}</a><el-divider direction="vertical"></el-divider>
        </span>
    </div>
    <!--    分頁結束-->

    <el-table
            :data="brandArr"
            border
            style="width: 100%">
        <el-table-column type="index" label="ID" width="100" align="center"></el-table-column>
        <el-table-column prop="brandName" label="品牌名"  align="center"></el-table-column>


        <el-table-column
                label="操作"
                align="center"
             >
            <template slot-scope="scope">
                <el-input v-model="scope.row.brandName" size="medium" style="width: 180px"></el-input>
                <el-button
                        style="margin-left: 10px"
                        size="mini"
                        type="info"
                        icon="el-icon-setting"
                        @click="handleEdit(scope.row)">確定修改
                </el-button>
                <el-button @click="openDeleteConfirm(scope.row.id)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>

            </template>
        </el-table-column>
    </el-table>

</div>
</template>



<script>
    export default {
        data() {
            return {
                brandArr:[],
                jwt:'',
                pages:'',
                url:"http://localhost:9080"
            };
        },
        methods: {
            //刪除品牌
            handleDelete(id){
                console.log(id)
                //deleteById
                let url=this.url+"/brands/"+id+"/delete"
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .get(url).then((response)=>{
                    let json = response.data;
                    if(json.serviceCode === 20000){
                        this.$message.success("刪除成功")
                    }else{
                        let message = response.data.message
                        this.$message.error(message);
                    }
                    this.loadBrands(1)
                })
            },
            handleEdit(product){
                console.log(product)
                //deleteById
                let url=this.url+"/brands/update"
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .post(url,product).then((response)=>{
                    let json = response.data;
                    if(json.serviceCode === 20000){
                        this.$message.success("修改成功")
                    }else{
                        let message = response.data.message
                        this.$message.error(message);
                    }
                    this.loadBrands(1)
                })
            },
            //獲取品牌列表
            loadBrands(pageNum){
                let url=this.url+"/brands/list?pageNum="+pageNum
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .get(url).then((response)=>{
                    let json=response.data
                    console.log("JSON",json)
                    if(json.serviceCode===20000){
                        this.brandArr=json.data.list
                        this.pages = json.data.pages
                    }else {
                        this.$message.error(json.message)
                    }
                })
            },
            openDeleteConfirm(id) {
                console.log(id)
                this.$confirm('此操作將永久删除該品牌, 是否繼續?', '提示', {
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
            },
            open() {
                this.$alert('請先登入', '尚未登入', {
                    confirmButtonText: '確定',
                    callback: action => {
                        // location.href = "/login"
                        this.$router.push({path: '/login'})
                    }
                });
            },
            //判斷是否有包含jwt，如果沒有則跳到登入頁
            haveJwt(){
                if(this.jwt ===null){
                    this.open()
                    return
                }
            },
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            this.jwt=localStorage.getItem("jwt")
            console.log("jwt",this.jwt)
            this.haveJwt()
            this.loadBrands(1);
        }
    }
</script>