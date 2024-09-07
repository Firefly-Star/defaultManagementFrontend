<template>
    <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="info">
            <div class="info-container">
                <el-row class="info-row">
                    <el-col :span="8" class="info-label">工号：</el-col>
                    <el-col :span="16" class="info-value">{{ userInfo.id }}</el-col>
                </el-row>
                <el-row class="info-row">
                    <el-col :span="8" class="info-label">姓名：</el-col>
                    <el-col :span="16" class="info-value">{{ userInfo.name }}</el-col>
                </el-row>
                <el-row class="info-row">
                    <el-col :span="8" class="info-label">邮箱：</el-col>
                    <el-col :span="16" class="info-value">{{ userInfo.email }}</el-col>
                </el-row>
            </div>
        </el-tab-pane>
        <el-tab-pane label="密码修改" name="password">
            <el-form :model="passwordForm" ref="passwordForm" label-width="120px">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input type="password" v-model="passwordForm.oldPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="passwordForm.newPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="passwordForm.confirmPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handlePasswordChange">提交</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
export default {
    name: 'UserCenter',
    props: {
        userInfo: {
            type: Object,
            required: true,
        },
        passwordChangeUrl: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            activeTab: 'info',
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
        };
    },
    methods: {
        async handlePasswordChange() {
            if (this.passwordForm.newPassword === this.passwordForm.confirmPassword) {
                try {
                    const response = await fetch(this.passwordChangeUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'userToken': localStorage.getItem('userToken'),
                        },
                        body: JSON.stringify({
                            id: this.userInfo.id,
                            oldPassword: this.passwordForm.oldPassword,
                            newPassword: this.passwordForm.newPassword
                        })
                    });

                    const result = await response.json();

                    if (response.ok && result.status === 1) {
                        this.$message.success('密码修改成功');
                        this.passwordForm.oldPassword = '';
                        this.passwordForm.newPassword = '';
                        this.passwordForm.confirmPassword = '';
                    } else {
                        this.$message.error(result.message || '密码修改失败');
                    }
                } catch (error) {
                    console.error('密码修改失败:', error);
                    this.$message.error('密码修改失败');
                }
            } else {
                this.$message.error('新密码和确认密码不匹配');
            }
        }
    }
};
</script>

<style scoped>
.info-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.info-label {
    font-weight: bold;
    color: #333;
    flex: 0 0 80px;
}

.info-value {
    font-size: 16px;
    color: #666;
    flex: 1;
}
</style>
