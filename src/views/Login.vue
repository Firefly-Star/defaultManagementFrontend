<template>
    <div id="app" class="login-page">
        <div class="text-section">
            <h1>欢迎来到衡泰违约客户信息管理平台</h1>
            <p>洞察机会    实现价值</p>
        </div>

        <div class="login-container">
            <el-card class="login-card" shadow="always">
                <h2 class="login-title">{{ isLoginMode ? '登录' : '注册' }}</h2>
                <el-form :model="form" ref="form" class="login-form" @submit.native.prevent="handleSubmit">
                    <el-form-item class="role-selector">
                        <el-radio-group v-model="form.role">
                            <el-radio-button label="员工">员工</el-radio-button>
                            <el-radio-button label="管理员">管理员</el-radio-button>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item :label-width="formLabelWidth">
                        <el-input v-model="form.username" auto-complete="off" placeholder="账号为工号">
                            <template slot="prepend">
                                <i class="el-icon-user"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                        <el-input v-model="form.password" type="password" auto-complete="off" placeholder="请输入密码">
                            <template slot="prepend">
                                <i class="el-icon-lock"></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item v-if="!isLoginMode">
                        <el-input v-model="form.confirmPassword" type="password" auto-complete="off" placeholder="请确认密码">
                            <template slot="prepend">
                                <i class="el-icon-lock"></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item v-if="!isLoginMode">
                        <el-input v-model="form.email" auto-complete="off" placeholder="请输入邮箱">
                            <template slot="prepend">
                                <i class="el-icon-message"></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" native-type="submit" class="login-button">
                            {{ isLoginMode ? '登录' : '注册' }}
                        </el-button>
                    </el-form-item>
                </el-form>
                <div class="toggle-mode">
                    <el-link @click="toggleMode">{{ isLoginMode ? '没有账号？去注册' : '已有账号？去登录' }}</el-link>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'LoginView',
        data() {
            return {
                isLoginMode: true,
                formLabelWidth: '0px',
                form: {
                    role: '员工',
                    username: '',
                    password: '',
                    confirmPassword: '',
                    email: ''
                }
            };
        },
        methods: {
            toggleMode() {
                this.isLoginMode = !this.isLoginMode;
            },
            handleSubmit() {
                if (this.isLoginMode) {
                    this.handleLogin();
                } else {
                    this.handleRegister();
                }
            },
            handleLogin() {
                const { role, username, password } = this.form;

                if (!username || !password) {
                    this.$message.error('账号和密码不能为空');
                    return;
                }

                if (username === 'admin' && password === '123456' && role === '管理员') {
                    console.log('管理员登录成功');
                    this.$router.push('/admin');
                } else if (username === 'user' && password === '123456' && role === '员工') {
                    console.log('员工登录成功');
                    this.$router.push('/user');
                } else {
                    this.$message.error('账号、密码或角色不正确');
                }
            },
            handleRegister() {
                const { role, username, password, confirmPassword, email } = this.form;

                if (!username || !password || !confirmPassword || !email) {
                    this.$message.error('账号、密码、确认密码和邮件不能为空');
                    return;
                }

                if (password !== confirmPassword) {
                    this.$message.error('两次输入的密码不一致');
                    return;
                }

                console.log(`注册成功: 账号:${username}, 角色:${role}`);
                this.$message.success('注册成功！请登录');
                this.isLoginMode = true;
            }
        }
    };
</script>

<style scoped>
    .login-page {
        margin: 0;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url('../assets/background.png') no-repeat center center;
        background-size: cover;
        width: 100%;
        height: 100%;
        padding: 0 5%;
        flex-direction: column; /* 让内容垂直排列 */
    }

    .role-selector {
        text-align: center;
    }

    .text-section {
        flex: 0 0 auto; /* 使文本部分自适应内容 */
        display: flex;
        flex-direction: column; /* 垂直排列 */
        justify-content: center;
        color: #fff;
        text-align: center; /* 让文本居中 */
        margin-bottom: 20px; /* 为文本部分与登录框增加一些间距 */
    }

    .text-section h1 {
        font-size: 36px;
        margin-bottom: 10px;
    }

    .text-section p {
        font-size: 18px;
    }

    .login-container {
        flex: 0 0 30%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login-card {
        width: 100%;
        padding: 20px;
    }

    .login-title {
        text-align: center;
        margin-bottom: 20px;
        font-size: 24px;
    }

    .login-form {
        width: 100%;
    }

    .login-button {
        width: 100%;
    }
</style>
