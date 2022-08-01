<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="params.task_name" placeholder="任务集名称" class="handle-input mr10"></el-input>
                <el-date-picker
                    class="mr10"
                    unlink-panels
                    value-format="yyyy-MM-dd HH:mm:ss"
                    v-model="params.times"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                >
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="序号" type="index" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{ (params.page - 1) * params.page_size + scope.$index + 1 }}</span>
                        <!-- <span>{{scope.$index + 1}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="id" label="报告名称" align="center">
                    <template slot-scope="scope">
                        <div class="report-name" @click="onDetails(scope.row.id)">
                            {{ scope.row.report_name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="创建时间" align="center">
                    <template slot-scope="scope">
                        {{ format(scope.row.create_time) }}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params.page"
                    :page-size="params.page_size"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            params: {
                page: 1,
                page_size: 10
            },
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false
        };
    },
    created() {
        this.getData();
    },
    mounted() {
        // 绑定enter事件
        document.addEventListener('keyup', this.enterKey);
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener('keyup', this.enterKey);
    },
    computed: {
        format() {
            return (originVal) => {
                const dt = new Date(originVal);

                const y = dt.getFullYear();
                const m = (dt.getMonth() + 1 + '').padStart(2, '0');
                const d = (dt.getDate() + '').padStart(2, '0');

                const hh = (dt.getHours() + '').padStart(2, '0');
                const mm = (dt.getMinutes() + '').padStart(2, '0');
                const ss = (dt.getSeconds() + '').padStart(2, '0');

                return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
            };
        }
    },
    methods: {
        onDetails(e) {
            localStorage.setItem('report_id', e);
            // 跳转用例结果页
            this.$router.push({ path: '/testTaskSetResult' });
        },
        getData() {
            // 查询历史测试报告
            this.$api
                .search_report(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.data;
                        this.pageTotal = res.count;
                        this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 全局回车搜索
        enterKey(event) {
            const code = event.keyCode;
            const path = this.$route.path;
            if (code == 13 && path == '/testTaskSetHistory') {
                this.handleSearch();
            }
        },
        // 触发搜索按钮
        handleSearch() {
            if (this.params.times) {
                this.params.stime = this.params.times[0];
                this.params.etime = this.params.times[1];
            }
            // delete this.params.times
            console.log(this.params, '入参');

            this.$set(this.params, 'page', 1);
            this.getData();
        },
        // 控制下拉框失去焦点
        changeFocus1(val) {
            if (val) {
                this.$refs.select1.focus();
            } else {
                this.$refs.select1.blur();
            }
        },
        changeFocus2(val) {
            if (val) {
                this.$refs.select2.focus();
            } else {
                this.$refs.select2.blur();
            }
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.params, 'page', val);
            this.getData();
        }
    }
};
</script>

<style scoped lang="less">
.handle-box {
    margin-bottom: 10px;
    div {
        margin-bottom: 10px;
    }
    .el-input {
        width: 200px;
    }
    .el-select {
        width: 150px;
    }
}

.handle-select {
    width: 150px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.report-name {
    color: Blue;
    cursor: pointer;
}
</style>
