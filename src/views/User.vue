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

                <div v-else-if="activeMenu === '6'">
                    <!--违规原因维护-->
                    <div class="search">
                        <el-row>
                            <el-col :span="12">
                                <el-form :model="defaultReasonFilterForm" inline>
                                    <el-form-item label="筛选条件">
                                        <el-input v-model="defaultReasonFilterForm.cause" placeholder="请输入搜索关键词"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="applyDefaultReasonFilter">搜索</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col :span="12" class="add-button">
                                <el-button type="success" @click="addReason">新增</el-button>
                            </el-col>
                        </el-row>
                        <el-table :data="existingReasons">
                            <el-table-column prop="id" label="id"></el-table-column>
                            <el-table-column prop="cause" label="描述"></el-table-column>
                            <el-table-column label="是否启用">
                                <template v-slot="scope">
                                    <span v-if="scope.row.enable === 1">是</span>
                                    <span v-else>否</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template v-slot="scope">
                                    <el-button type="primary" @click="editReason(scope.row)">修改</el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                        <!-- 弹出修改对话框 -->
                        <el-dialog :title="isEditing ? '修改违规原因' : '新增违规原因'" :visible.sync="dialogVisible">
                            <el-form :model="editForm">
                                <el-form-item label="违规原因">
                                    <el-input v-model="editForm.cause"></el-input>
                                </el-form-item>
                                <el-form-item label="是否启用">
                                    <el-switch v-model="editForm.enable"></el-switch>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="saveEdit">{{ isEditing ? '确 定' : '新 增' }}</el-button>
                            </span>
                        </el-dialog>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import Header from '../components/HeaderComponent.vue';
import SideMenu from '../components/SideMenu.vue'; 
import WelcomeComponent from '../components/Welcome.vue'; 
import axios from 'axios';

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
            defaultReasonFilterForm: {
                cause: null, // 筛选条件,
                type:'违规原因',
            },
            dialogVisible: false,
            existingReasons: [
            ],
            editForm: {
                cause: null,
                enable: false
            },
            currentRow: null,
            isEditing: false,
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

        addReason() {
            this.editForm.description = '';
            this.editForm.isEnabled = false;
            this.currentRow = null;
            this.isEditing = false;
            this.dialogVisible = true;
        },

        editReason(row) {
            this.editForm.cause = row.cause;
            this.editForm.isEnabled = row.enable;
            this.currentRow = row;
            this.isEditing = true;
            this.dialogVisible = true;
        },

        saveEdit() {
            const adminToken = localStorage.getItem('adminToken'); // 获取 adminToken

            // 根据 isEditing 判断是添加还是更新
            if (this.isEditing) {
                // 更新违约原因
                const updateData = {
                    id: this.currentRow.id, // 当前行的 ID
                    reason: this.editForm.cause, // 更新后的违约原因
                    enable: this.editForm.enable // 更新后的启用状态
                };

                // 发送 PUT 请求
                axios.put('http://localhost:8080/api/admin/editReason/', updateData, {
                    headers: {
                        'Content-Type': 'application/json', // 设置请求体格式为 JSON
                        'adminToken': adminToken // 在请求头中加入 adminToken
                    }
                })
                .then(response => {
                    if (response.data.status === "1") {
                        this.$message.success('更新成功！');
                        this.dialogVisible = false; // 关闭对话框
                        this.applyDefaultReasonFilter(); // 重新加载数据
                    } else {
                        this.$message.error('更新失败: ' + response.data.message);
                    }
                })
                .catch(error => {
                    console.error('更新失败:', error);
                    this.$message.error('更新失败');
                });
            } else {
                // 添加新的违约原因
                const newData = {
                    cause: this.editForm.cause, // 新的原因关键词
                    type: '违规原因' // 固定类型
                };

                // 发送 POST 请求
                axios.post('http://localhost:8080/api/admin/addReason', newData, {
                    headers: {
                        'Content-Type': 'application/json', // 设置请求体格式为 JSON
                        'adminToken': adminToken // 在请求头中加入 adminToken
                    }
                })
                .then(response => {
                    if (response.data.status === "1") {
                        this.$message.success('添加成功！');
                        this.dialogVisible = false; // 关闭对话框
                        this.applyDefaultReasonFilter(); // 重新加载数据
                    } else {
                        this.$message.error('添加失败: ' + response.data.message);
                    }
                })
                .catch(error => {
                    console.error('添加失败:', error);
                    this.$message.error('添加失败');
                });
            }
        },

        async applyDefaultReasonFilter() {
            try {
                const adminToken = localStorage.getItem('adminToken');
                const response = await fetch("http://localhost:8080/api/admin/reasons", {
                    method: 'POST', // 使用 POST 方法
                    headers: {
                        'Content-Type': 'application/json', // 设置请求体格式为 JSON
                        'adminToken': adminToken // 在请求头中加入 userToken
                    },
                    body: JSON.stringify(this.defaultReasonFilterForm) // 将请求体转为 JSON 字符串
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = await response.json();
                console.log(result);
                if (result.status === 1 && result.data) {
                    this.existingReasons = result.data; // 将 data 中的内容赋值给 existingReasons
                } else {
                    console.error("Error: ", result.message); // 处理非成功情况
                }
            } catch (error) {
                console.error("Error fetching reasons:", error);
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

.add-button {
    text-align: right; /* 新增按钮右对齐 */
}

</style>