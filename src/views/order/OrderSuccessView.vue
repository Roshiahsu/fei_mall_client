<template>
    <div>
        <h1>訂單完成</h1>
        <!--        步驟條開始-->
        <el-steps :active="3" simple>
            <el-step title="購物清單" ></el-step>
            <el-step title="訂單確認與送出" ></el-step>
            <el-step title="訂單完成" ></el-step>
        </el-steps>
        <!--        步驟條結束-->
        <el-divider></el-divider>
        <router-view/>
    </div>
</template>



<script>
    export default {
        data() {
            return {

            };
        },
        methods: {

        },
        created() { //已創建 在mounted 顯示頁面之前執行

        },
        mounted() { //已掛載 在created 顯示頁面之後執行

        }
    }
</script>

<style>


</style>