<template>

    <!--头-->
    <div id="app">
        <Header :userInfo="userInfo" title="衡泰违约客户信息管理平台-员工视图" />
        <!-- 其他内容 -->
    </div>
</template>

<script>
import Header from '../components/HeaderComponent.vue';

export default {
    name : 'UserView',
    components: {
        Header
    },
    data() {
        return {
            userInfo: {
                employeeId: '12345',
                name: '张三',
                email: 'test@example.com'
            }
        }
    }
};
</script>