<template>
<div>
    <h1 >商品列表(管理員)</h1>
    <!--    Pagination分頁開始-->
    <div  style="width: 150px;margin: 0 auto">
        <el-pagination
                @current-change="handleCurrentChange"
                :page-size="1"
                layout="prev, pager, next, jumper"
                :total="pages">
        </el-pagination>
    </div>
    <!--    Pagination分頁結束-->
    <el-divider></el-divider>

    <el-table
            :data="productArr"
            border
            style="width: 100%">
        <el-table-column prop="picture" label="商品圖片"  align="center">
            <template   slot-scope="scope">
                <el-image style="width: 70px; height: 70px"
                          :src="require('@/assets/productImg/'+ scope.row.picture)"
                          fit="contain"></el-image>
<!--                <img  :src="require('@/assets/productImg/'+ scope.row.picture)"-->
<!--                      :width=imgWidth :height=imgHeight-->
<!--                      class="image"-->
<!--                >-->
            </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名稱"  align="center"></el-table-column>
        <el-table-column prop="stock" label="商品庫存"  align="center"></el-table-column>
        <el-table-column prop="price" label="商品價錢"  align="center"></el-table-column>
        <el-table-column prop="keywords" label="關鍵字"  align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" label="商品描述"  align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="gmtExp" label="保存期限"  align="center">
            <template slot-scope="scope" v-if="scope.row.gmtExp != null">
                    {{scope.row.gmtExp.substring(0,0+10)}}
            </template>
        </el-table-column>

        <el-table-column
                label="操作"
                align="center"
        >
            <template slot-scope="scope">
                <el-button
                        style="margin-left: 10px"
                        size="mini"
                        type="info"
                        circle
                        icon="el-icon-setting"
                        @click="handleEdit(scope.row.id)">
                </el-button>
                <el-button @click="openDeleteConfirm(scope.row.id)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>

            </template>
        </el-table-column>
    </el-table>

</div>
</template>



<script>
    const allProduct =1
    export default {
        data() {
            return {
                productArr:[],
                url:"http://localhost:9080/product/",
                pages:1,//分類頁
                imgWidth:50,
                imgHeight:50,

            };
        },
        methods: {
            loadProductList(pageNum){
                //自動獲取
                let url = this.url+allProduct+"/listProduct?pageNum="+pageNum+"&pageSize=10"
                this.axios
                .get(url).then((response)=>{
                    let json=response.data
                    console.log("商品列表JSON",json)
                    if(json.serviceCode===20000) {
                        this.productArr = json.data.list
                        this.pages = json.data.totalPage
                    }else if (json.serviceCode === 40001 || json.serviceCode === 40002){
                            this.open()
                    }else {
                        this.$message.error(json.message)
                    }
                })
            },
            handleEdit(id){
                location.href = "/product/update?="+id
            },
            //商品刪除確認
            openDeleteConfirm(id) {
                this.$confirm('確認移除商品?', '提示', {
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
            //根據id刪除商品
            handleDelete(id){
                console.log(id)
                let url=this.url+id+"/delete"
                this.axios
                    .create({headers:{'Authorization':localStorage.getItem("jwt")}})
                    .get(url).then((response)=>{
                    let json = response.data;
                    if(json.serviceCode===20000){
                        this.$message.success("刪除成功")
                        this.loadProductList(1);
                    }else{
                        let message = response.data.message
                        this.$message.error(message);
                    }
                    this.loadProductList(1);
                })
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
            handleCurrentChange(val) {
                this.loadProductList(val)
            }
        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行

            // let pageNum = location.search.split("&")[0].split("=")[1];
            // let pageSize = location.search.split("&")[1].split("=")[1];
            this.loadProductList(1);
        }
    }
</script>

<style>

    .image {
        object-fit:contain;
        width: 100%;
        display: block;
    }

</style>