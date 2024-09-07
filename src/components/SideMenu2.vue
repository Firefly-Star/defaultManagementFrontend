<template>
    <el-menu class="side-menu" :default-active="activeMenu" @select="handleSelect">
        <el-menu-item index="0"><i class="el-icon-house"></i>首页</el-menu-item>
        <el-menu-item index="1"><i class="el-icon-user"></i>申请信息查询</el-menu-item>
        <el-menu-item index="2"><i class="el-icon-document-checked"></i>审核</el-menu-item>
        <el-menu-item index="3"><i class="el-icon-edit-outline"></i>违约风险原因维护</el-menu-item>
        <el-menu-item index="4"><i class="el-icon-s-grid"></i>违约统计</el-menu-item>
        <el-menu-item index="5"><i class="el-icon-user"></i>个人中心</el-menu-item>
    </el-menu>
    
</template>

<script>
export default {
    name: 'SideMenuAdmin',
    props: {
        activeMenu: {
            type: String,
            required: true
        }
    },
    methods: {
        handleSelect(key) {
            this.$emit('select', key);
        },
    }
};
</script>

<style scoped>
.side-menu {
    width: 200px;
    height: 200%;
    background-color: #2D3A4B;
}

.el-menu-item {
    color: lightgrey;
}
</style>

