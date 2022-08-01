<template>
    <div class="container">
        <div class="handle-box">
            <el-button-group style="position: relative">
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="dialogShow = true">添加</el-button>
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="remove">删除</el-button>
            </el-button-group>
        </div>
        <el-table
            style="height: 550px; overflow: auto"
            :data="tableData"
            border
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange"
        >
            >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="序号" width="66" align="center" type="index"> </el-table-column>
            <el-table-column prop="project" label="项目名称" align="center"> </el-table-column>
            <el-table-column prop="piter" label="项目迭代" align="center"> </el-table-column>
            <el-table-column prop="page_name" label="页面名称" align="center"> </el-table-column>
            <el-table-column prop="case_name" label="测试用例名称" align="center"> </el-table-column>
            <el-table-column prop="case_desc" label="测试用例描述" align="center"> </el-table-column>
            <el-table-column prop="exec_uname" label="执行人" align="center"> </el-table-column>
            <el-table-column prop="status" label="用例状态" align="center">
                <template slot-scope="scope">
                    <el-switch :disabled="true" v-model="scope.row.status"> </el-switch>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="params.page"
                :page-sizes="params.sizes || [2, 5, 10, 20, 50, 100, 200]"
                :page-size="params.size ? params.size : 5"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageTotal ? pageTotal : 0"
            ></el-pagination>
        </div>
        <Dialog :dialogShow="dialogShow" @closeDialog="closeDialog" @getList="getList" :id="id"></Dialog>
    </div>
</template>
<script>
import Dialog from './dialog';
export default {
    components: {
        Dialog
    },
    data() {
        return {
            params: {
                page: 1,
                size: 10
            },
            pageTotal: 0,
            dialogShow: false,
            tableData: [],
            deleteIdList: [], //删除id数组
            id: null
        };
    },
    created() {
        let id = this.$route.query.id;
        this.id = id;
        this.getList(id);
    },
    methods: {
        add() {},
        remove() {
            if (!this.deleteIdList.length) {
                this.$message.error('请选择删除内容');
                return false;
            } else {
                let ids = this.deleteIdList.map((item) => item.id);
                this.deleteIds(ids);
            }
        },
        deleteIds(ids) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    let res = await this.$api.uiTestTaskSetApi.delete_case_to_task(this.id, { ids: ids });
                    if (res.code == 0) {
                        this.getList(this.id);
                        this.$message.success(res.msg);
                    }
                })
                .catch(() => {});
        },
        async getList(id) {
            let res = await this.$api.uiTestTaskSetApi.taskuiset_detail(this.id, this.params);
            if (res.results.code == 0) {
                this.tableData = res.results.data;
            }
        },
        handleSelectionChange(list) {
            this.deleteIdList = list;
        },
        closeDialog() {
            this.dialogShow = false;
        },
        // 分页导航
        handleCurrentChange(val) {
            this.params.page = val;
            this.getList(this.form);
        },
        handleSizeChange(val) {
            this.params.size = val;
            this.getList(this.form);
        }
    }
};
</script>
<style lang="less" scoped>
.handle-box {
    margin-bottom: 30px;
}
</style>
