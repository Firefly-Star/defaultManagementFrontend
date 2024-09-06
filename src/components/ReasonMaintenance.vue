<template>
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
        <el-table :data="reasons">
            <el-table-column prop="description" label="违约原因描述"></el-table-column>
            <el-table-column prop="id" label="操作">
                <template v-slot="scope">
                    <el-button type="text" size="small" @click="editReason(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteReason(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props: {
        defaultReasonFilterForm: Object,
        reasons: Array
    },
    methods: {
        applyDefaultReasonFilter() {
            this.$emit('applyDefaultReasonFilter');
        },
        addReason() {
            this.$emit('addReason');
        },
        editReason(reason) {
            this.$emit('editReason', reason);
        },
        deleteReason(reason) {
            this.$emit('deleteReason', reason);
        }
    }
};
</script>