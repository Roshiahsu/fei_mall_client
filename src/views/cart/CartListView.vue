<template>
<div>
    <h1 style="margin: 20px 0;">購物車</h1>
    <div style="width: 150px;margin: 0 auto">
        <span v-for=" i in pages" :key="i">
            <a :href="'/cart/list?pageNum=' + i + '&pageSize='+pageSize">{{i}}</a><el-divider direction="vertical"></el-divider>
        </span>
    </div>
    <el-divider></el-divider>
    <el-card class="box-card" style="width: 1000px;margin: 0 auto" >
        <el-table
                :data="cartArr"
                border
                style="width: 100%">
            <el-table-column prop="id" label="ID" width="70" align="center"></el-table-column>
            <el-table-column prop="productName" label="商品名稱" width="300" align="center"></el-table-column>
            <el-table-column prop="price" label="單價" width="150"  align="center"></el-table-column>
            <el-table-column prop="quantity" label="購買數量" width="150" align="center" >
            </el-table-column>
            <el-table-column prop="subtotal" label="小計" width="150" align="center" ></el-table-column>

            <el-table-column
                    label="操作"
                    align="center"
                    >
                <template slot-scope="scope">
                    <el-button @click="openDeleteConfirm(scope.row.id)" type="info" icon="el-icon-delete" size="mini" >取消</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <p>
        總計：
    </p>
</div>
</template>



<script>
    export default {
        data() {
            return {
                cartArr:[],
                jwt:"eyJ0eXBlIjoiand0IiwiYWxnIjoiSFMyNTYifQ.eyJleHAiOjE2NzI0ODc2MTQsInVzZXIiOiJ7XCJhdXRob3JpdGllc1wiOltcIlJPTEVfdXNlclwiXSxcImlkXCI6MTMsXCJ1c2VybmFtZVwiOlwidGVzdDJcIn0ifQ.cAnXJpGrMZg0ABCSAMcVoZI7WYHo7C-KcqbH481K6JE",
                url:"http://localhost:9080/cart/",
                pageSize:"10",//預設每頁顯示10項
                pages:""//頁數總計
            };
        },
        methods: {
            handleDelete(id){
                console.log(id)
                //待完成
                let url=this.url+id+"/delete"
                this.axios.create({
                    headers:{'Authorization':this.jwt}
                }).
                post(url).then((response)=>{
                    let json = response.data;
                    if(json.statusCode==20000){
                        this.$message.success("刪除成功")
                    }else{
                        let message = response.data.message
                        this.$message.error(message);
                    }
                    this.loadBrands()
                })
            },
            //待完成
            handleEdit(id){
                console.log(id)
                //更改數據ByID
            },
            loadBrands(pageNum,pageSize){
                //自動獲取

                let url=this.url+"list?pageNum="+pageNum+"&pageSize="+pageSize
                this.axios
                    .create({headers:{'Authorization':this.jwt}})
                    .get(url).then((response)=>{
                    let json=response.data
                    console.log("JSON",json)
                    if(json.serviceCode===20000){
                        this.cartArr=json.data.list
                        this.pages = json.data.pages
                    }else {
                        this.$message.error(json.message)
                    }
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
        created() { //已創建 在mounted 顯示頁面之前執行
            this.jwt=localStorage.getItem("jwt")
        },
        mounted() { //已掛載 在created 顯示頁面之後執行
            let pageNum = location.search.split("&")[0].split("=")[1];
            let pageSize = location.search.split("&")[1].split("=")[1];
            this.loadBrands(pageNum,pageSize);
        }
    }
</script>

<style>
    body{
        font: 18px "Microsoft YaHei UI";
        margin: 0;
    }
    header a{
        text-decoration: none;
        color: #6c6c6c;
    }
    header a:hover{
        color: #0aa1ed;
    }



</style>