<template>
    <div class="search">
        <el-row>
            <el-col :span="40">
                <el-form :model="clientFilterForm" inline>
                    <el-form-item label="客户名">
                        <el-input v-model="clientFilterForm.name" placeholder="客户名"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" style="margin-left: 10px;">
                        <el-select v-model="clientFilterForm.gender" placeholder="选择性别">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                            <el-option label="全部" value="全部"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="行业" style="margin-left: 10px;">
                        <el-input v-model="clientFilterForm.industry" placeholder="行业" style="margin-left: 10px; width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="地区" style="margin-left: 10px;">
                        <el-input v-model="clientFilterForm.area" placeholder="地区" style="margin-left: 10px; width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" style="margin-left: 10px;">
                        <el-select v-model="clientFilterForm.status" placeholder="选择状态" style="margin-left: 10px; width: 150px;">
                            <el-option label="未违约" value="未违约"></el-option>
                            <el-option label="已违约" value="已违约"></el-option>
                            <el-option label="全部" value="全部"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="fetchClientInfo">搜索</el-button>
                </el-form>
            </el-col>
        </el-row>
        <el-table :data="clientInformation">
            <el-table-column prop="id" label="客户ID" width="100"></el-table-column>
            <el-table-column prop="name" label="客户名" width="100"></el-table-column>
            <el-table-column prop="gender" label="性别" width="100"></el-table-column>
            <el-table-column prop="industry" label="行业" width="100"></el-table-column>
            <el-table-column prop="area" label="地区" width="100"></el-table-column>
            <el-table-column prop="phone" label="电话" width="300"></el-table-column>
            <el-table-column prop="status" label="是否违约" width="100"></el-table-column>
            <el-table-column label="操作">
                <template v-slot="scope">
                    <div>
                        <el-button 
                            v-if="scope.row.status === '已违约'" 
                            type="primary" 
                            size="small" 
                            @click="openClaimDialog(scope.row, '重生')">
                            重生申请
                        </el-button>
                        <el-button 
                            v-else 
                            type="primary" 
                            size="small" 
                            @click="openClaimDialog(scope.row, '违约')">
                            违约申请
                        </el-button>
                    </div>
                </template>
            </el-table-column>

        </el-table>

        <!-- 违约申请表单弹窗 -->
        <el-dialog title="提交申请" :visible.sync="claimDialogVisible">
            <el-form :model="claimForm">
                <el-form-item label="原因" >
                    <el-select v-model="claimForm.reasonId" placeholder="选择原因" :style="{ width: '100%' }">
                        <el-option v-for="reason in reasonsList" :key="reason.id" :label="reason.cause" :value="reason.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="严重度">
                    <el-input v-model="claimForm.severity" placeholder="输入严重度"></el-input>
                </el-form-item>
                <el-form-item label="外部严重度">
                    <el-input v-model="claimForm.externSeverity" placeholder="输入外部严重度"></el-input>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="claimDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitClaim">提交申请</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ClientSearch',
    data() {
        return {
            clientFilterForm: {
                name: null,
                gender: null,
                industry: null,
                area: null,
                status: null
            },
            dialogTitle: '',
            clientInformation: [],
            claimDialogVisible: false, // 控制弹窗的显示与隐藏
            claimForm: {
                clientId: null,
                reasonId: null,
                severity: '',
                externSeverity: '',
                type: null,
            },
            reasonsList: [] // 存储违约/重生原因列表
        };
    },
    methods: {
        async fetchClientInfo() {
            try {
                const token = localStorage.getItem('userToken')

                const body = {
                    name: this.clientFilterForm.name,
                    gender: this.clientFilterForm.gender == "全部" ? null : this.clientFilterForm.gender,
                    industry: this.clientFilterForm.industry,
                    area: this.clientFilterForm.area,
                    status: this.clientFilterForm.status == "全部" ? null : this.clientFilterForm.status
                }

                const response = await fetch('http://localhost:8080/api/user/client', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'userToken': token
                    },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }

                const result = await response.json();
                if (result.status === 1) {
                    this.clientInformation = result.data;
                } else {
                    this.$message.error(result.message);
                }
            } catch (error) {
                console.error('获取客户信息失败:', error);
                this.$message.error('获取客户信息失败');
            }
        },
        openClaimDialog(row, title) {
            this.claimForm.clientId = row.id; // 设置客户ID
            this.claimForm.type = title == '违约' ? '违约申请' : '重生申请'
            this.claimDialogVisible = true; // 打开弹窗
            this.fetchReasons(); // 获取违约/重生原因列表
        },
        async fetchReasons() {
            try {
                const token = localStorage.getItem('userToken');
                const response = await fetch('http://localhost:8080/api/user/reasons', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'userToken': token
                    },
                    body : JSON.stringify({enable : 0, type : this.claimForm.type == '违约申请' ? '违规原因' : '重生原因'})
                });

                if (!response.ok) {
                    throw new Error('获取原因列表失败');
                }

                const result = await response.json();
                if (result.status === 1) {
                    this.reasonsList = result.data; // 将原因列表存储到 reasonsList 中
                } else {
                    this.$message.error(result.message);
                }
            } catch (error) {
                console.error('获取原因列表失败:', error);
                this.$message.error('获取原因列表失败');
            }
        },
        async submitClaim() {
            try {
                const token = localStorage.getItem('userToken');

                const body = {
                    clientId: this.claimForm.clientId,
                    reasonId: this.claimForm.reasonId,
                    severity: this.claimForm.severity,
                    externSeverity: this.claimForm.externSeverity,
                    type: this.claimForm.type
                };

                const response = await fetch('http://localhost:8080/api/user/claim', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'userToken': token
                    },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }

                const result = await response.json();
                if (result.status === 1) {
                    this.$message.success('申请提交成功');
                    this.claimDialogVisible = false; // 关闭弹窗
                } else {
                    this.$message.error(result.message);
                }
            } catch (error) {
                console.error('提交违约申请失败:', error);
                this.$message.error('提交违约申请失败');
            }
        }
    },
    mounted(){
        this.fetchClientInfo();
    }
};
</script>

<style scoped>
.search {
    margin: 20px;
}
</style>
