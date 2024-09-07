<template>
    <div id="app">
        <!-- 标题栏与退出登录 -->
        <Header :userInfo="userInfo" title="衡泰违约客户信息管理平台-员工视图" />
        
        <div class="container">
            <!-- 左侧菜单 -->
            <SideMenu :activeMenu="activeMenu" @select="handleSelect" />

            <!--主要内容-->
            <div class="main-content">
                <div v-if="activeMenu == '0'">
                    <!--欢迎界面-->
                    <WelcomeComponent 
                        :userInfo="userInfo" 
                        :pendingTasks="pendingTasks" 
                        :messages="messages" 
                    />
                </div>

                <div v-if="activeMenu == '5'">
                    <!--信息查询-->
                    <ClaimInfo />
                </div>

                <div v-else-if="activeMenu == '6'">
                    <!--违规原因维护-->
                    <ReasonMaintenance />
                </div>

                <div v-else-if="activeMenu == '7'">
                    <!--统计视图-->
                    <StaticsComponent />
                </div>

                <div v-else-if="activeMenu == '8'">
                    <UserCenter 
                        :userInfo="userInfo" 
                        :passwordChangeUrl="'http://localhost:8080/api/auth/user/editPassword'" 
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
import ReasonMaintenance from '../components/ReasonMaintenance.vue';
import ClaimInfo from '../components/ClaimInfo.vue';
import UserCenter from '../components/UserCenter.vue';
import StaticsComponent from '../components/Satistics.vue'
import axios from 'axios';


export default {
    name: 'UserView',
    components: {
        Header,
        SideMenu,
        WelcomeComponent ,
        ReasonMaintenance,
        ClaimInfo,
        UserCenter,
        StaticsComponent
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

        async fetchUserInfo() {
            try {
                // 从 localStorage 中获取 token
                const token = localStorage.getItem('userToken');
                
                // 发送 GET 请求到后端获取用户信息
                const response = await axios.get('http://localhost:8080/api/user/info', {
                    headers: {
                        'userToken': token  // 将 token 作为请求头发送
                    }
                });

                console.log(response);

                // 如果请求成功并且状态为 "1"
                if (response.data.status === 1) {
                    this.userInfo = response.data.data;  // 将返回的用户信息存入 userInfo
                } else {
                    console.error('获取用户信息失败:', response.data.message);
                }
            } catch (error) {
                console.error('获取用户信息失败:', error);
            }
        },
    },
    created() {
        this.fetchUserInfo(); // 在组件创建时获取用户信息
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