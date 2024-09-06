<template>
    <div class="welcome-container">
        <div class="welcome-left">
            欢迎您，{{ userInfo.name }}
        </div>
        <div class="welcome-right">
            <span class="currentTime">{{ currentTime }}</span>
        </div>
        <div class="user-info-container">
            <div class="user-info-left">
                <div class="username-avatar" :style="{ backgroundColor: avatarColor }">
                    {{ namePart }}
                </div>
                <div class="user-info-details">
                    <div class="user-name">{{ userInfo.name }}</div>
                    <div class="user-role">员工</div>
                </div>
            </div>
            <div class="user-info-right">
                待处理事项：{{ pendingTasks }}
            </div>
        </div>
        <div class="message-bar">
            <div class="message-title">{{ messageBarTitle }}</div>
            <div v-for="message in messages" :key="message.id" class="message-content">
                {{ message.content }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : 'HomeComponent',
    props: {
        userInfo: Object,
        currentTime: String,
        avatarColor: String,
        namePart: String,
        pendingTasks: Number,
        messageBarTitle: String,
        messages: Array
    }
};
</script>