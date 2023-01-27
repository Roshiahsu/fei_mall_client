<template>
    <div>
        <h1>顧客中心</h1>
<el-button type="primary" @click="getPDF">buttonCont</el-button>
        <!--    用戶詳情-->
        <el-descriptions title="用戶詳情" direction="vertical" :column="4" border>
            <template slot="extra">
                <a href="/user/update">
                    <el-button type="primary" size="small">修改詳情</el-button>
                </a>
            </template>
            <el-descriptions-item label="用戶名">{{userInfo.username}}</el-descriptions-item>
            <el-descriptions-item label="暱稱">{{userInfo.nickname}}</el-descriptions-item>
            <el-descriptions-item label="生日">{{userInfo.bod}}</el-descriptions-item>
            <el-descriptions-item label="紅利積分">{{userInfo.rewardPoint}}</el-descriptions-item>
            <el-descriptions-item label="電話" :span="2">{{userInfo.phone}}</el-descriptions-item>
            <el-descriptions-item label="mail" :span="2">{{userInfo.email}}</el-descriptions-item>
        </el-descriptions>

        <el-divider></el-divider>
        <a href="/user/addressAddNew">
            <el-button type="primary" size="small" style="float: right;position: relative;bottom: 12px">新增地址</el-button>
        </a>
        <!--地址詳情開始-->

        <el-table
                :data="addressList"
                border
                style="width: 100%;">
            <el-table-column prop="city" label="居住地" width="100" align="center"></el-table-column>
            <el-table-column prop="zone" label="鄉鎮區" width="100" align="center"></el-table-column>
            <el-table-column prop="zipCode" label="郵遞區號" width="100" align="center"></el-table-column>
            <el-table-column prop="detailedAddress" label="詳細地址" align="center"></el-table-column>
            <el-table-column prop="tag" label="標籤" align="center" width="100"></el-table-column>
            <el-table-column label="是否為預設" align="center" width="100">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.isDefault"
                               :active-value="1"
                               :inactive-value="0"
                               active-color="#13ce66"
                               inactive-color="#999"
                               disabled
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center"
                    width="100px"
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

        <!--地址詳情結束-->
        <el-divider></el-divider>
        <div id="download">
            <!--訂單列表-->
            <el-table
                    :data="orderList"
                    style="width: 100%"
                    border
            >
                <el-table-column
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
        <canvas id="canvas" width="595" height="842" style="border: 1px solid black;"></canvas>

    </div>
</template>


<script>
    const { jsPDF } = require("jspdf"); // will automatically load the node version
    import html2canvas from 'html2canvas';
    import * as rasterizeHTML from 'rasterizehtml'

    export default {
        data() {
            return {
                userInfo: {
                    username: '',
                    nickname: '',
                    bod: '',
                    rewardPoint: '',
                    phone: '',
                    email: '',
                },
                orderList: [
                    {
                        amountOfActualPay:"", //實際支付金額
                        gmtCreate:"",//訂單生成時間
                        id:"",//訂單id
                        sn:"",//訂單編號
                        statusName:"",//訂單狀態
                    }
                ],
                addressList: [
                    {
                        city: '',
                        zone: '',
                        zipCode: '',
                        detailedAddress: '',
                    }
                ],
                url: "http://localhost:9080",
            };
        },
        methods: {
            //跳轉到訂單詳情
            getOrderDetail(id) {
                location.href = "/orderDetailInfo?id=" + id
            },
            //自動獲取用戶資料
            loadUserInfo() {
                let url = this.url + "/user/userInfo"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .get(url).then((response) => {
                    let json = response.data
                    if (json.serviceCode === 20000) {
                        this.userInfo = json.data;
                    } else if (json.serviceCode === 40001 || json.serviceCode === 40002) {
                        localStorage.clear()
                        this.open()
                    } else {
                        // this.$message.error(json.message)
                    }
                    console.log("userInfo", this.userInfo)
                })
            },
            //獲取地址詳情
            loadAddressList() {
                let url = this.url + "/address/addressList"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .get(url).then((response) => {
                    let json = response.data
                    if (json.serviceCode === 20000) {
                        this.addressList = json.data;
                    } else if (json.serviceCode === 40001 || json.serviceCode === 40002) {
                        localStorage.clear()
                        this.open()
                    } else {
                        this.$message.error(json.message)
                    }
                    console.log("addressList", this.addressList)
                })
            },
            //獲取訂單列表
            loadOrderList() {
                let url = this.url + "/order/list"
                this.axios
                    .create({headers: {'Authorization': this.jwt}})
                    .get(url).then((response) => {
                    let json = response.data
                    if (json.serviceCode === 20000) {
                        this.orderList = json.data;
                    } else if (json.serviceCode === 40004) {
                        this.open()
                    } else {
                        // this.$message.error(json.message)
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
            getExcel(){
                const workbook = new ExcelJs.Workbook(); // 創建試算表檔案
                const sheet = workbook.addWorksheet('工作表範例1',
                    {views:[{state: 'frozen', xSplit: 1, ySplit:1}]}); //在檔案中新增工作表 參數放自訂名稱
                sheet.addTable({ // 在工作表裡面指定位置、格式並用columsn與rows屬性填寫內容
                    name: 'test1',  // 表格內看不到的，讓你之後想要針對這個table去做額外設定的時候，可以指定到這個table
                    ref: 'A1', // 從A1開始
                    style: {
                        // theme: 'TableStyleMedium2',
                        // showRowStripes: true,
                    },
                    columns: [
                        {name:'訂單編號'},
                        {name:'支付金額'},
                        {name:'訂單創建時間'},
                        {name:'訂單狀態'}],
                    rows:[],
                });
                sheet.getColumn(1).width=25 //訂單編號
                sheet.getColumn(2).width=10 //支付金額
                sheet.getColumn(3).width=12 //訂單創建時間
                sheet.getColumn(4).width=15 //訂單狀態

                sheet.getRow(1).height=20
                /*添加資料到table中*/
                const table = sheet.getTable("test1");
                for (let i = 0; i <this.orderList.length ; i++) {
                    sheet.getRow(i+2).height=20 //設定每一行高度

                    table.addRow(
                        [
                            this.orderList[i].sn,
                            this.orderList[i].amountOfActualPay,
                            this.orderList[i].gmtCreate,
                            this.orderList[i].statusName,
                        ]
                    )
                }
                table.commit()
                // 表格裡面的資料都填寫完成之後，訂出下載的callback function
                // 異步的等待他處理完之後，創建url與連結，觸發下載
                workbook.xlsx.writeBuffer().then((content) => {
                    const link = document.createElement("a");
                    const blobData = new Blob([content], {
                        type: "application/vnd.ms-excel;charset=utf-8;"
                    });
                    link.download = '測試的試算表.xlsx';
                    link.href = URL.createObjectURL(blobData);
                    link.click();
                });
            },

            getPDF(){
                var canvas = document.getElementById("canvas");
                    var context = canvas.getContext('2d')
                    var fileContent = document.getElementById("download").outerHTML;
                    var options = {
                        width: 595,
                        height: 842
                    };
                    rasterizeHTML.drawHTML(fileContent, canvas, options).then(function (renderResult) {
                        context.drawImage(renderResult.image, 0, 0);
                        console.log(canvas.toDataURL("image/png"));
                        var imgData = canvas.toDataURL("image/png");
                        var pdf = new jsPDF(); //2.X版的寫法 var pdf = new jspdf.jsPDF()
                        pdf.addImage(imgData, 'JPEG', 0, 0);
                        //console.log(pdf);
                        pdf.save("download.pdf");
                    });
            }

        },

        created() {

        },
        mounted() {
            this.jwt = localStorage.getItem("jwt")
            this.loadUserInfo();
            this.loadOrderList();
            this.loadAddressList()
            this.haveJwt();

        }
    }

</script>
<style>

</style>