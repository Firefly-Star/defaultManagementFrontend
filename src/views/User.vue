<template>
    <div id="app">
        <!-- 标题栏与退出登录 -->
        <Header :userInfo="userInfo" title="衡泰违约客户信息管理平台-员工视图" />
        
        <div class="container">
            <!-- 左侧菜单 -->
            <SideMenu :activeMenu="activeMenu" @select="handleSelect" />

            <!--主要内容-->
            <div class="main-content">
                <div v-if="activeMenu === '0'">
                    <WelcomeComponent 
                        :userInfo="userInfo" 
                        :pendingTasks="pendingTasks" 
                        :messages="messages" 
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../components/HeaderComponent.vue';
import SideMenu from '../components/SideMenu.vue'; 
import WelcomeComponent from '../components/Welcome.vue'; 

export default {
    name: 'UserView',
    components: {
        Header,
        SideMenu,
        WelcomeComponent 
    },
    data() {
        return {
            userInfo: {
                id: '12345',
                name: '张三',
                email: 'test@example.com'
            },
            activeMenu: '0',
            pendingTasks: 5,
            messages: [
                { id: 1, content: '张三在2024-09-03提交了一份申请' },
                { id: 2, content: '李四在2024-09-04提交了一份申请' },
            ],
        }
    },
    methods: {
        async handleSelect(key) {
            this.activeMenu = key;
            console.log(key);
        },
    },
};
</script>

<style scoped>
.container {
    display: flex;
    height: calc(100vh - 70px); /* 调整高度 */
}

.main-content {
    flex: 1;
    padding: 25px; /* 增加 padding */
}
</style>