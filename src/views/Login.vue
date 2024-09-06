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
                    username: null,
                    password: null,
                    confirmPassword: null,
                    email: null
                }
            };
        },
        methods: {
            toggleMode() {
                this.isLoginMode = !this.isLoginMode;
            },
            async handleSubmit() {
                if (this.isLoginMode) {
                    this.handleLogin();
                } else {
                    this.handleRegister();
                }
            },
            async handleLogin() {
                if (!this.form.username || !this.form.password) {
                    this.$message.error('账号和密码不能为空');
                    return;
                }

                if (this.form.role == "员工")
                {
                    try {
                        // 从 this.form 中获取 username 和 password
                        const requestBody = {
                            username: this.form.username, // 假设 this.form 中有 username 字段
                            password: this.form.password  // 假设 this.form 中有 password 字段
                        };

                        const response = await fetch("http://localhost:8080/api/auth/user/login", {
                            method: 'POST', // 使用 POST 方法
                            headers: {
                                'Content-Type': 'application/json', // 设置请求体格式为 JSON
                            },
                            body: JSON.stringify(requestBody) // 将请求体转为 JSON 字符串
                        });

                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }

                        const result = await response.json();
                        console.log(result);
                        if (result.status === 1) {
                            const userToken = result.data;

                            localStorage.setItem("userToken", userToken);

                            // 跳转到首页或其他页面
                            this.$router.push({ path: '/user' });
                        } else {
                            // 登录失败，显示错误信息
                            this.$message.error('账号或密码错误');
                        }
                        
                    } catch (error) {
                        console.error("Error fetching reasons:", error);
                    }
                }
                else
                {
                    try {
                        // 从 this.form 中获取 username 和 password
                        const requestBody = {
                            username: this.form.username, 
                            password: this.form.password  
                        };

                        const response = await fetch("http://localhost:8080/api/auth/admin/login", {
                            method: 'POST', // 使用 POST 方法
                            headers: {
                                'Content-Type': 'application/json', // 设置请求体格式为 JSON
                            },
                            body: JSON.stringify(requestBody) // 将请求体转为 JSON 字符串
                        });

                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }

                        const result = await response.json();
                        console.log(result);
                        if (result.status === 1) {
                            const adminToken = result.data;

                            localStorage.setItem("adminToken", adminToken);

                            // 跳转到首页或其他页面
                            this.$router.push({ path: '/home' });
                        } else {
                            // 登录失败，显示错误信息
                            this.$message.error('账号或密码错误');
                        }
                        
                    } catch (error) {
                        console.error("Error fetching reasons:", error);
                    }
                }
            },
            async handleRegister() {
                if (!this.form.username || !this.form.password || !this.form.confirmPassword || !this.form.email) {
                    this.$message.error('账号、密码、确认密码和邮件不能为空');
                    return;
                }

                if (this.form.password !== this.form.confirmPassword) {
                    this.$message.error('两次输入的密码不一致');
                    return;
                }

                if (this.form.role == "员工")
                {
                    try {
                        const requestBody = {
                            username : this.form.username,
                            password : this.form.password,
                            email : this.form.email
                        }
                        const response = await fetch("http://localhost:8080/api/auth/user/register", {
                            method: 'POST', // 使用 POST 方法
                            headers: {
                                'Content-Type': 'application/json', // 设置请求体格式为 JSON
                            },
                            body: JSON.stringify(requestBody) // 将请求体转为 JSON 字符串
                        })

                        if (!response.ok){
                            this.$message.error("登录失败");
                        }

                        const result = await response.json();

                        if (result.status == 1)
                        {
                            this.$message.success('注册成功！请登录');
                            this.isLoginMode = true;
                        }else
                        {
                            this.$message.error(result.message);
                        }
                    }catch(error) {
                        console.log("Failed to register: ",error);
                    }
                }
                else
                {
                    try {
                        const requestBody = {
                            username : this.form.username,
                            password : this.form.password,
                            email : this.form.email
                        }
                        const response = await fetch("http://localhost:8080/api/auth/admin/register", {
                            method: 'POST', // 使用 POST 方法
                            headers: {
                                'Content-Type': 'application/json', // 设置请求体格式为 JSON
                            },
                            body: JSON.stringify(requestBody) // 将请求体转为 JSON 字符串
                        })
    
                        if (!response.ok){
                            this.$message.error("登录失败");
                        }
    
                        const result = await response.json();
    
                        if (result.status == 1)
                        {
                            this.$message.success('注册成功！请登录');
                            this.isLoginMode = true;
                        }else
                        {
                            this.$message.error(result.message);
                        }
                    }catch(error) {
                        console.log("Failed to register: ",error);
                    }

                }
            }
        }
    }
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
