<template>
    <div class="search">
        <el-row>
            <el-col :span="40">
                <el-form :model="claimInformationFilterForm" inline>
                    <el-form-item label="违约客户名" >
                        <el-input v-model="claimInformationFilterForm.clientName" placeholder="违约客户名" ></el-input>
                    </el-form-item>
                    <el-form-item label="严重程度" style="margin-left: 10px;">
                        <el-select v-model="claimInformationFilterForm.severity" placeholder="选择严重程度" style="margin-left: 10px; width: 150px;">
                            <el-option label="低" value="低"></el-option>
                            <el-option label="中" value="中"></el-option>
                            <el-option label="高" value="高"></el-option>
                            <el-option label="全部" value="全部"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请日期" style="margin-left: 10px;">
                        <el-date-picker v-model="claimInformationFilterForm.claimTime" type="date" placeholder="选择申请日期" style="margin-left: 10px; width: 150px;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="最新外部等级" style="margin-left: 10px;">
                        <el-select v-model="claimInformationFilterForm.externSeverity" placeholder="最新外部等级" style="margin-left: 10px; width: 150px;">
                            <el-option label="低" value="低"></el-option>
                            <el-option label="中" value="中"></el-option>
                            <el-option label="高" value="高"></el-option>
                            <el-option label="全部" value="全部"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请类型" style="margin-left: 10px;">
                        <el-select v-model="claimInformationFilterForm.type" placeholder="申请类型" style="margin-left: 10px; width: 150px;">
                            <el-option label="违约申请" value="违约申请"></el-option>
                            <el-option label="重生申请" value="重生申请"></el-option>
                            <el-option label="全部" value="全部"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-button type="primary" @click="applyClaimInformationFilter">搜索</el-button>
                </el-form>
            </el-col>
        </el-row>

        <el-table :data="paginatedClaimInformation" >
            <el-table-column prop="id" label="申请id" width="100"></el-table-column>
            <el-table-column prop="type" label="申请类型" width="100"></el-table-column>
            <el-table-column prop="clientName" label="违约客户" width="100"></el-table-column>
            <el-table-column prop="reviewStatus" label="审核状态" width="100"></el-table-column>
            <el-table-column prop="reasonName" label="认定违约原因"></el-table-column>
            <el-table-column prop="severity" label="严重程度" width="100"></el-table-column>
            <el-table-column prop="claimTime" label="认定申请时间" width="200"></el-table-column>
            <el-table-column prop="externSeverity" label="最新外部等级" width="100"></el-table-column>

            <el-table-column label="审核">
                <template v-slot="scope">
                    <el-select v-model="scope.row.reviewStatus" placeholder="选择审核状态" style="width: 150px;">
                        <el-option label="通过" value="通过"></el-option>
                        <el-option label="驳回" value="驳回"></el-option>
                    </el-select>
                    <el-button type="primary" size="small" @click="submitReview(scope.row)">提交</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :current-page="currentPage"
            :total="totalClaimInformation"
            @current-change="handlePageChange">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: 'ReviewView',
    data() {
        return {
            claimInformationFilterForm: {
                clientName: null,
                reviewStatus: '未审核',
                severity: null,
                reviewerName: null,
                claimTime: null,
                reviewTime: null,
                externSeverity: null,
                type: null
            },
            claimInformation: [],
            currentPage: 1,  // 当前页码
            pageSize: 5,     // 每页条数
        }
    },
    computed: {
        // 计算当前页的数据
        paginatedClaimInformation() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.claimInformation.slice(start, end);
        },
        // 总条数
        totalClaimInformation() {
            return this.claimInformation.length;
        }
    },
    methods: {
        async applyClaimInformationFilter() {
            try {
                const token = localStorage.getItem('adminToken');
                const params = {
                    clientName: this.claimInformationFilterForm.clientName,
                    reviewStatus: this.claimInformationFilterForm.reviewStatus === "全部" ? null : this.claimInformationFilterForm.reviewStatus,
                    severity: this.claimInformationFilterForm.severity === "全部" ? null : this.claimInformationFilterForm.severity,
                    reviewerName: this.claimInformationFilterForm.reviewerName,
                    claimTime: this.claimInformationFilterForm.claimTime,
                    reviewTime: this.claimInformationFilterForm.reviewTime,
                    externSeverity: this.claimInformationFilterForm.externSeverity === "全部" ? null : this.claimInformationFilterForm.externSeverity,
                    type: this.claimInformationFilterForm.type === "全部" ? null : this.claimInformationFilterForm.type
                };

                const response = await fetch('http://localhost:8080/api/admin/claims', {
                    method: 'POST',
                    headers: {
                        'adminToken': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(params)
                });

                const data = await response.json();

                if (data.status === 1) {
                    this.claimInformation = data.data;  // 将返回的申请信息存入 claimInformation
                    this.currentPage = 1; // 每次搜索后重置为第一页
                } else {
                    console.error('获取申请信息失败:', data.message);
                }
            } catch (error) {
                console.error('获取申请信息失败:', error);
            }
        },
        async submitReview(row) {
            try {
                const adminToken = localStorage.getItem('adminToken');
                const params = {
                    id: row.id,
                    reviewStatus: row.reviewStatus
                };

                const response = await fetch('http://localhost:8080/api/admin/claim-reviews', {
                    method: 'POST',
                    headers: {
                        'adminToken': adminToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(params)
                });

                const data = await response.json();

                if (data.status === 1) {
                    this.$message.success('审核提交成功');
                } else {
                    this.$message.error('审核提交失败: ' + data.message);
                }
            } catch (error) {
                console.error('提交审核失败:', error);
                this.$message.error('提交审核时发生错误');
            }
        },
        handlePageChange(page) {
            this.currentPage = page; // 更新当前页码
        }
    },
    mounted() {
        this.applyClaimInformationFilter();
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
