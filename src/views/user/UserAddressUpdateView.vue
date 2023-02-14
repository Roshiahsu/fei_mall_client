<template>
    <div>
        <h1>顧客地址修改中心</h1>
        <!--地址詳情開始-->
        <div >

            <el-descriptions title="地址詳情" direction="vertical"
                             :column="4"
                             style="margin-top: 10px"
                             border
            >
                <template slot="extra">
                    <el-button type="primary" size="small"
                               @click="userAddressUpdate()"
                               v-loading.fullscreen.lock="fullscreenLoading">確認修改</el-button>
                </template>
                <el-descriptions-item label="居住地" span="1" >
                    <el-input v-model="addressInfo.city"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="鄉鎮區" span="1">
                    <el-input v-model="addressInfo.zone"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="郵遞區號" span="1">
                    <el-input v-model="addressInfo.zipCode"></el-input>
                </el-descriptions-item>
                            <el-descriptions-item label="是否設定為預設" >
                                <template>
                                    <el-switch v-model="addressInfo.isDefault"
                                               :active-value="1"
                                               :inactive-value="0"
                                               active-color="#13ce66"
                                               inactive-color="#999"
                                    >
                                    </el-switch>
                                </template>
                            </el-descriptions-item>
                <el-descriptions-item label="標籤">
                    <el-input v-model="addressInfo.tag"></el-input>
                </el-descriptions-item>
                <el-descriptions-item label="詳細地址" >
                    <el-input v-model="addressInfo.detailedAddress"></el-input>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <!--地址詳情結束-->

    </div>
</template>


<script>
    import {haveJwt} from '@/utils/Utils';
    import {getRequest,postRequest} from "@/utils/api";

    export default {
        data() {
            return {
                fullscreenLoading: false,
                addressInfo:
                    {
                        city:'',
                        zone:'',
                        zipCode:'',
                        detailedAddress:'',
                        isDefault:'',
                        tag:''
                    },
            };
        },
        methods: {
            //獲取地址詳情
            loadAddressInfo(id) {
                let url = "/address/addressInfo?id="+id
                getRequest(url).then(response => {
                    if (response.serviceCode === 20000) {
                        this.addressInfo = response.data;
                    }else{
                        this.$message.error(response.message)
                    }
                })
            },
            userAddressUpdate() {
                let url = "/address/updateAddress"
                postRequest(url,this.addressInfo).then(response=>{
                    if (response.serviceCode === 20000) {
                        this.fullscreenLoading = true;
                        this.$message.success("修改完成")
                        setTimeout(() => {
                            // location.href="/customerCenter"
                            this.$router.push({path: '/customerCenter'})
                        }, 500);
                    }else{
                        this.$message.warning(response.message)
                    }
                })
            },
        },
        created() {

        },
        mounted() {
            let id =location.search.split("=")[1]
            haveJwt(localStorage.getItem('jwt'));
            this.loadAddressInfo(id)
        }
    }
</script>
