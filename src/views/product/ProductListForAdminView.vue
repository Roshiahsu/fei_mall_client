<template>
<div>
    <h1 >商品列表(管理員)</h1>

    <div  style="width: 150px;margin: 0 auto">
        <span v-for=" i in pages" :key="i">
            <a href="javascript:void(0)" @click="loadProductList(i)">{{i}}</a><el-divider direction="vertical"></el-divider>
        </span>
    </div>
    <el-divider></el-divider>

    <el-table
            :data="productArr"
            border
            style="width: 100%">
        <el-table-column prop="picture" label="商品圖片"  align="center">
            <template   slot-scope="scope">
                <img  :src="require('@/assets/productImg/'+ scope.row.picture)" :width=imgWidth :height=imgHeight class="image" />
            </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名稱"  align="center"></el-table-column>
        <el-table-column prop="stock" label="商品庫存"  align="center"></el-table-column>
        <el-table-column prop="price" label="商品價錢"  align="center"></el-table-column>
        <el-table-column prop="keywords" label="關鍵字"  align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" label="商品描述"  align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="gmtExp" label="保存期限"  align="center"></el-table-column>

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
                jwt:'',
                url:"http://localhost:9080/product/",
                pages:'',//分類頁
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
                    if(json.serviceCode===20000){
                        this.productArr=json.data.list
                        this.pages = json.data.pages
                    }else {
                        this.$message.error(json.message)
                    }
                })
            },
            handleEdit(id){
                location.href = "/product/update?="+id
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