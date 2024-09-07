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
                    <WelcomeComponent 
                        :userInfo="userInfo" 
                        :pendingTasks="pendingTasks" 
                        :messages="messages" 
                    />
                </div>

                <div v-if="activeMenu == '5'">
                    <div class="search">
                        <el-row>
                            <el-col :span="40">
                                <el-form :model="claimInformationFilterForm" inline>
                                    <el-form-item label="违约客户名" >
                                        <!-- 输入框 -->
                                        <el-input v-model="claimInformationFilterForm.clientName" placeholder="违约客户名" ></el-input>
                                    </el-form-item>
                                    <el-form-item label="审核状态" style="margin-left: 10px;">
                                        <!-- 下拉选择框 -->
                                        <el-select v-model="claimInformationFilterForm.reviewStatus" placeholder="选择审核状态" >
                                            <el-option label="已审核" value="已审核"></el-option>
                                            <el-option label="未审核" value="未审核"></el-option>
                                            <el-option label="全部" value="全部"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="严重程度" style="margin-left: 10px;">
                                        <el-select v-model="claimInformationFilterForm.severity" placeholder="选择严重程度" style="margin-left: 10px; width: 150px;">
                                            <el-option label="低" value="低"></el-option>
                                            <el-option label="中" value="中"></el-option>
                                            <el-option label="高" value="高"></el-option>
                                            <el-option label="全部" value="全部"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="认定人" style="margin-left: 10px;">
                                        <el-input v-model="claimInformationFilterForm.reviewerName" placeholder="认定人" style="margin-left: 10px; width: 150px;"></el-input>
                                    </el-form-item>
                                    <el-form-item label="申请日期" style="margin-left: 10px;">
                                        <el-date-picker v-model="claimInformationFilterForm.claimTime" type="date" placeholder="选择申请日期" style="margin-left: 10px; width: 150px;"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="审核日期" style="margin-left: 10px;">
                                        <el-date-picker v-model="claimInformationFilterForm.ReviewTime" type="date" placeholder="选择审核日期" style="margin-left: 10px; width: 150px;"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="最新外部等级" style="margin-left: 10px;">
                                        <el-select v-model="claimInformationFilterForm.externSeverity" placeholder="最新外部等级" style="margin-left: 10px; width: 150px;">
                                            <el-option label="低" value="低"></el-option>
                                            <el-option label="中" value="中"></el-option>
                                            <el-option label="高" value="高"></el-option>
                                            <el-option label="全部" value="全部"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-button type="primary" @click="applyClaimInformationFilter">搜索</el-button>
                                </el-form>
                                
                            </el-col>
                        </el-row>
                        <el-table :data="claimInformation" >
                            <el-table-column prop="id" label="申请id"></el-table-column>
                            <el-table-column prop="name" label="违约客户"></el-table-column>
                            <el-table-column prop="reviewStatus" label="审核状态"></el-table-column>
                            <el-table-column prop="cause" label="认定违约原因"></el-table-column>
                            <el-table-column prop="severity" label="严重程度"></el-table-column>
                            <el-table-column prop="reviewerName" label="认定人"></el-table-column>
                            <el-table-column prop="claimTime" label="认定申请时间"></el-table-column>
                            <el-table-column prop="reviewTime" label="认定审核时间"></el-table-column>
                            <el-table-column prop="externSeverity" label="最新外部等级"></el-table-column>
                        </el-table>
                    </div>
                </div>

                <div v-else-if="activeMenu === '6'">
                    <!--违规原因维护-->
                    <ReasonMaintenance />
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import Header from '../components/HeaderComponent.vue';
import SideMenu from '../components/SideMenu.vue'; 
import WelcomeComponent from '../components/Welcome.vue'; 
import ReasonMaintenance from '@/components/ReasonMaintenance.vue';
import axios from 'axios';

export default {
    name: 'UserView',
    components: {
        Header,
        SideMenu,
        WelcomeComponent ,
        ReasonMaintenance
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
            claimInformationFilterForm: {
                clientName: null,
                reviewStatus: null,
                severity: null,
                reviewerName: null,
                claimTime: null,
                reviewTime: null,
                externSeverity: null
            },
            claimInformation: [
                { id: 1, name: '阿三', reviewStatus: '已审核', cause: '欠我钱', severity: '严重', reviewer: '我', claimTime: '2024-9-2', reviewTime: '2024-9-3', externSeverity: '严重' },
                // 更多数据...
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

        async applyClaimInformationFilter() {
            try {
                // 从 localStorage 中获取 token
                const token = localStorage.getItem('userToken');

                // 创建请求参数
                const params = {
                    clientName: this.claimInformationFilterForm.clientName,
                    reviewStatus: this.claimInformationFilterForm.reviewStatus == "全部" ? null : this.claimInformationFilterForm.reviewStatus,
                    severity: this.claimInformationFilterForm.severity == "全部" ? null : this.claimInformationFilterForm.severity,
                    reviewerName: this.claimInformationFilterForm.reviewerName,
                    claimTime: this.claimInformationFilterForm.claimTime,
                    reviewTime: this.claimInformationFilterForm.reviewTime,
                    externSeverity: this.claimInformationFilterForm.externSeverity == "全部" ? null : this.claimInformationFilterForm.externSeverity ,
                    type: '违约申请'  // 根据需求设置类型
                };

                // 发送 GET 请求到后端获取申请信息
                const response = await fetch('http://localhost:8080/api/user/claims', {
                    method: 'POST',
                    headers: {
                        'userToken': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(params)
                });

                const data = await response.json();

                console.log(data);

                 // 如果请求成功并且状态为 "1"
                 if (data.status === 1) {
                     this.claimInformation = data.data;  // 将返回的申请信息存入 claimInformation
                 } else {
                     console.error('获取申请信息失败:', data.message);
                 }
            } catch (error) {
                console.error('获取申请信息失败:', error);
            }
        },
       
    },
    created() {
        this.fetchUserInfo(); // 在组件创建时获取用户信息
    }
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


.search {
    margin-top: 25px; /* 增加顶部间距 */
    padding: 20px; /* 增加内边距 */
    border: 1px solid #e0e0e0; /* 边框 */
    border-radius: 6px; /* 圆角 */
    background-color: #f9f9f9; /* 背景颜色 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

.search .el-form {
    margin-bottom: 25px; /* 增加底部间距 */
}

</style>