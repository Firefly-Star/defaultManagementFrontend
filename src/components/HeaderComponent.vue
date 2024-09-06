<template>
    <div class="header">
        <div class="title">{{ title }}</div>
        <!-- 用户名的部分和下拉菜单 -->
        <el-dropdown trigger="click" placement="bottom-end">
            <span class="el-dropdown-link username-avatar" :style="{ backgroundColor: avatarColor }">{{ namePart }}</span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
export default {
    name: 'HeaderComponent',
    props: {
        userInfo: {
            type: Object,
            required: true
        },
        title: {
            type: String,
            default: '这个项目真无聊'
        }
    },
    computed: {
        namePart() {
            return this.userInfo.name.slice(-2); // 获取姓名的后两个字
        }
    },
    data() {
        return {
            avatarColor: this.getRandomColor(),
        }
    },
    methods: {
        getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
        logout() {
            this.$router.push({ path: '/' });
        }
    }
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background-color: #409EFF;
    color: white;
}

.title {
    font-size: 26px;
    font-weight: bold;
}

.username-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: white;
    font-weight: bold;
    cursor: pointer;
    background-color: #409EFF;
    font-size: 20px;
}
</style>