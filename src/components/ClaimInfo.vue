<template>
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
            <el-table-column prop="clientName" label="违约客户"></el-table-column>
            <el-table-column prop="reviewStatus" label="审核状态"></el-table-column>
            <el-table-column prop="reasonName" label="认定违约原因"></el-table-column>
            <el-table-column prop="severity" label="严重程度"></el-table-column>
            <el-table-column prop="reviewerName" label="认定人"></el-table-column>
            <el-table-column prop="claimTime" label="认定申请时间"></el-table-column>
            <el-table-column prop="reviewTime" label="认定审核时间"></el-table-column>
            <el-table-column prop="externSeverity" label="最新外部等级"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default{
    name : 'ClaimInfo',
    data(){
        return {
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
                { id: 1, clientName: '阿三', reviewStatus: '已审核', reasonName: '欠我钱', severity: '严重', reviewer: '我', claimTime: '2024-9-2', reviewTime: '2024-9-3', externSeverity: '严重' },
                // 更多数据...
            ],
        }
    },
    methods : {
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
    }
}
</script>

<style scoped>

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