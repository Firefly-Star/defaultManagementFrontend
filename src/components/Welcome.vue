<template>
    <div>
        <div class="welcome-container">
            <div class="welcome-left">
                欢迎您，{{ userInfo.name }}
            </div>
            <div class="welcome-right">
                <span class="currentTime">{{ currentTime }}</span>
            </div>
        </div>
        <div class="user-info-container">
            <div class="user-info-left">
                <div class="username-avatar" :style="{ backgroundColor: avatarColor }">
                    {{ namePart }}
                </div>
                <div class="user-info-details">
                    <div class="user-name">
                        {{ userInfo.name }}
                    </div>
                    <div class="user-role">
                        员工
                    </div>
                </div>
            </div>
            <div class="user-info-right">
                待处理事项：{{ pendingTasks }}
            </div>
        </div>
        <!-- 消息栏 -->
        <div class="message-bar">
            <div class="message-title">{{ messageBarTitle }}</div>
            <div class="message-content" v-for="message in messages" :key="message.id">
                {{ message.content }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WelcomeView',
    props: {
        userInfo: {
            type: Object,
            required: true
        },
        pendingTasks: {
            type: Number,
            required: true
        },
        messages: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            currentTime: '',
            avatarColor: this.getRandomColor(),
        };
    },
    computed: {
        namePart() {
            return this.userInfo.name.slice(-2); // 获取姓名的后两个字
        },
        messageBarTitle() {
            return `消息栏（${this.messages.length}）`; // 动态计算消息栏标题
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
        updateCurrentTime() {
            const update = () => {
                this.currentTime = new Date().toLocaleTimeString();
            };
            update(); // 初始化时间
            setInterval(update, 1000); // 每秒更新时间
        }
    },
    created() {
        this.updateCurrentTime(); // 调用更新时间方法
    }
};
</script>

<style scoped>
/* 复制原有样式或根据需要调整样式 */
.welcome-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    font-size: 20px;
}

.user-info-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #ebecf0;
}

.username-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    color: white;
    font-weight: bold;
    cursor: pointer;
    background-color: #409EFF;
    font-size: 20px;
    margin-right: 20px;
}

.message-bar {
    margin-top: 25px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.message-content {
    font-size: 16px;
    color: #333;
    margin-bottom: 15px;
    padding: 8px;
    border-left: 4px solid #409EFF;
    background-color: #f9f9f9;
    border-radius: 4px;
}

.message-title {
    font-size: 18px;
    color: #333;
    font-weight: bold;
    margin-bottom: 10px;
}

.user-info-left {
    display: flex;
    align-items: center;
}
</style>