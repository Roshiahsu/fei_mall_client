<template>
    <div>
        <h1>管理員訂單列表管理</h1>
<!--        搜尋功能開始-->
        <el-card class="filter-container" shadow="never">
            <div>
                <i class="el-icon-search"></i>
                <span>快速搜尋</span>
                <el-button
                        style="float:right"
                        type="primary"
                        @click="handleCurrentChange()"
                        size="small">
                    快速搜尋
                </el-button>
                <el-button
                        style="float:right;margin-right: 15px"
                        @click="handleResetSearch()"
                        size="small">
                    重置
                </el-button>
            </div>

            <div style="margin-top: 15px">
                <el-form :inline="true" :model="orderQueryDTO" size="small" label-width="140px">
                    <el-form-item label="輸入搜尋條件：">
                        <el-input v-model="orderQueryDTO.sn" class="input-width" placeholder="訂單編號" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="收件人：">
                        <el-input v-model="orderQueryDTO.receiverKeyword" class="input-width" placeholder="收件人姓名/手機號碼" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="訂單創建時間：">
                        <el-date-picker
                                align="center"
                                class="input-width"
                                v-model="orderQueryDTO.gmtCreate"
                                type="date"
                                placeholder="請選擇時間">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
<!--        搜尋功能結束-->
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
        <!--地址詳情結束-->
        <el-divider></el-divider>
        <div id="download">
            <!--訂單列表-->
            <el-table
                    :data="orderList"
                    style="width: 100%"
                    border
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column
                        label="編號"
                        type="index"
                        width="50"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="sn"
                        label="訂單編號"
                        width="180"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="gmtCreate"
                        label="訂購日期"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="statusName"
                        label="訂單狀態"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="amountOfActualPay"
                        label="實際支付金額"
                        align="center">
                </el-table-column>
                <el-table-column
                        label="訂單詳情"
                        align="center"
                >
                    <template slot-scope="scope">
                        <el-button type="info" size="mini" @click="getOrderDetail(scope.row.id)">訂單詳情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>


<script>
    import {getUrl} from '@/utils/Utils';

    const orderQueryDTO = {
        pageNum: 1,
        pageSize: 10,
        sn: null,
        receiverKeyword: null,
        gmtCreate: null,
    };
    export default {
        data() {
            return {
                multipleSelection:[],
                pages:1,
                orderQueryDTO:Object.assign({}, orderQueryDTO),
                orderList: [
                    {
                        amountOfActualPay:"", //實際支付金額
                        gmtCreate:"",//訂單生成時間
                        id:"",//訂單id
                        sn:"",//訂單編號
                        statusName:"",//訂單狀態
                    }
                ],
                url: getUrl(),
            };
        },
        methods: {
            //跳轉到訂單詳情
            getOrderDetail(id) {
                location.href = "/orderDetailInfo?id=" + id
            },
            //獲取訂單列表
            loadOrderList(pageNum) {
                if(pageNum != null){
                    this.orderQueryDTO.pageNum=pageNum
                }
                let url = this.url +"/order/admin/list"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .post(url,this.orderQueryDTO).then((response) => {
                    let json = response.data
                    console.log(json)
                    if (json.serviceCode === 20000) {
                        this.orderList = json.data.list;
                        this.pages = json.data.totalPage
                        this.orderQueryDTO=Object.assign({}, orderQueryDTO)
                    } else if (json.serviceCode === 40004 ||json.serviceCode === 40002) {
                        this.open()
                    } else {
                        this.$message.error(json.message)
                    }
                    console.log("orderList", this.orderList)
                })
            },
            handleEdit(id){
                location.href = "/user/addressUpdate?id="+id
            },
            //商品刪除確認
            openDeleteConfirm(id) {
                this.$confirm('確認移除設定?', '提示', {
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
            //根據id刪除地址
            handleDelete(id){
                console.log(id)
                let url=this.url+"/address/"+id+"/delete"
                this.axios
                    .create({headers:{'Authorization':localStorage.getItem("jwt")}})
                    .get(url).then((response)=>{
                    let json = response.data;
                    if(json.serviceCode===20000){
                        this.$message.success("刪除成功")
                    }else{
                        let message = response.data.message
                        this.$message.error(message);
                    }
                    setTimeout(() => {
                        location.href=''
                        // this.$router.push({path: '/customerCenter'})
                    }, 500);

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
            haveJwt() {
                if (this.jwt === null) {
                    this.open()
                    return
                }
            },
            //批量待完成
            handleSelectionChange(val){
                this.multipleSelection = val;
                console.log(this.multipleSelection)
            },
            //分頁
            handleCurrentChange(val) {
                console.log(val)
                this.loadOrderList(val)
            },
            //表單重置
            handleResetSearch() {
                this.orderQueryDTO=Object.assign({}, orderQueryDTO)
            }
        },

        created() {

        },
        mounted() {
            this.jwt = localStorage.getItem("jwt")
            this.loadOrderList(1);
            this.haveJwt();

        }
    }

</script>
<style>

</style>