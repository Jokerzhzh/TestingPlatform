<template>
    <div>
        <div class="container">
            <el-tabs v-model="activeName" :tab-position="tabPosition" @tab-click="handleClick">
                <el-tab-pane label="任务集总览" name="0">
                    <div class="test-report">
                        <div class="grid-content grid-con-1">
                            <i class="el-icon-tickets grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">{{ total_count.total_cases }}</div>
                                <div>执行总用例数</div>
                            </div>
                        </div>
                        <div class="grid-content grid-con-2">
                            <i class="el-icon-circle-check grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">{{ total_count.pass_cases }}</div>
                                <div>执行通过</div>
                            </div>
                        </div>
                        <div class="grid-content grid-con-3">
                            <i class="el-icon-lx-info grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">{{ total_count.fail_cases }}</div>
                                <div>执行失败</div>
                            </div>
                        </div>
                        <div class="grid-content grid-con-4">
                            <i class="el-icon-circle-close grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">{{ total_count.err_cases }}</div>
                                <div>执行错误</div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <el-table :data="task_report" border class="table" header-cell-class-name="table-header">
                        <el-table-column label="序号" type="index" width="50" align="center">
                            <template slot-scope="scope">
                                <span>{{ scope.$index + 1 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="任务ID" width="66" align="center">
                            <template slot-scope="scope">{{ scope.row.task_id }}</template>
                        </el-table-column>
                        <el-table-column label="名称" align="center">
                            <template slot-scope="scope">{{ scope.row.task_name }}</template>
                        </el-table-column>
                        <el-table-column label="用例总数" align="center">
                            <template slot-scope="scope">{{ scope.row.total_cases }}</template>
                        </el-table-column>
                        <el-table-column label="直行通过" align="center">
                            <template slot-scope="scope">{{ scope.row.pass_cases }}</template>
                        </el-table-column>
                        <el-table-column label="执行失败" align="center">
                            <template slot-scope="scope">{{ scope.row.fail_cases }}</template>
                        </el-table-column>
                        <el-table-column label="执行错误" align="center">
                            <template slot-scope="scope">{{ scope.row.err_cases }}</template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane v-for="item in task_report" :key="item.task_name" :label="item.task_name" :name="item.task_id">
                    <div class="test-report">
                        <div class="grid-content grid-con-1">
                            <i class="el-icon-tickets grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">{{ report_res.total_cases }}</div>
                                <div>执行总用例数</div>
                            </div>
                        </div>
                        <div class="grid-content grid-con-2">
                            <i class="el-icon-circle-check grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">{{ report_res.pass_cases }}</div>
                                <div>执行通过</div>
                            </div>
                        </div>
                        <div class="grid-content grid-con-3">
                            <i class="el-icon-lx-info grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">{{ report_res.fail_cases }}</div>
                                <div>执行失败</div>
                            </div>
                        </div>
                        <div class="grid-content grid-con-4">
                            <i class="el-icon-circle-close grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">{{ report_res.err_cases }}</div>
                                <div>执行错误</div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div class="inventory">用例执行清单</div>

                    <!-- 执行失败 -->
                    <div>
                        <h5>执行失败</h5>
                        <el-table :data="assert_ret" header-row-class-name="assert-ret" border class="table">
                            <el-table-column label="用例ID" align="center" width="80">
                                <template slot-scope="scope">{{ scope.row.id }}</template>
                            </el-table-column>
                            <el-table-column label="接口url" align="center">
                                <template slot-scope="scope">{{ scope.row.path }}</template>
                            </el-table-column>
                            <el-table-column label="验证key" align="center">
                                <template slot-scope="scope">{{ scope.row.key }}</template>
                            </el-table-column>
                            <el-table-column label="实际值" align="center">
                                <template slot-scope="scope">{{ scope.row.actual_val }}</template>
                            </el-table-column>
                            <el-table-column label="断言表达式" align="center">
                                <template slot-scope="scope">{{ scope.row.assert_expression }}</template>
                            </el-table-column>
                            <el-table-column label="预期值" align="center">
                                <template slot-scope="scope">{{ scope.row.expected_value }}</template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- 执行错误 -->
                    <div>
                        <h5>执行错误</h5>
                        <el-table
                            :data="error_ret"
                            border
                            class="table"
                            header-row-class-name="error-ret"
                            :header-cell-style="{ color: '#f56c6c' }"
                        >
                            <el-table-column label="用例ID" align="center" width="80">
                                <template slot-scope="scope">{{ scope.row.id }}</template>
                            </el-table-column>
                            <el-table-column label="接口url" :show-overflow-tooltip="true" align="center">
                                <template slot-scope="scope">{{ scope.row.api_addr }}</template>
                            </el-table-column>
                            <el-table-column label="响应头" :show-overflow-tooltip="true" align="center">
                                <template slot-scope="scope">{{ scope.row.response_header }}</template>
                            </el-table-column>
                            <el-table-column label="响应体" :show-overflow-tooltip="true" align="center">
                                <template slot-scope="scope">{{ scope.row.response_body }}</template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- 请求参数 -->
                    <div>
                        <h5>请求参数</h5>
                        <el-table :data="params_ret" border class="table" header-row-class-name="params-ret">
                            <el-table-column label="用例ID" align="center" width="80">
                                <template slot-scope="scope">{{ scope.row.id }}</template>
                            </el-table-column>
                            <el-table-column label="请求全路径" :show-overflow-tooltip="true" align="center">
                                <template slot-scope="scope">{{ scope.row.full_addr }}</template>
                            </el-table-column>
                            <el-table-column label="请求头" :show-overflow-tooltip="true" align="center">
                                <template slot-scope="scope">{{ scope.row.resquest_header }}</template>
                            </el-table-column>
                            <el-table-column label="请求体" :show-overflow-tooltip="true" align="center">
                                <template slot-scope="scope">{{ scope.row.resquest_params }}</template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- 总体相应结果 -->
                    <div>
                        <h5>总体相应结果</h5>
                        <el-table :data="res_ret" border class="table" header-row-class-name="res-ret">
                            <el-table-column label="用例ID" align="center" width="80">
                                <template slot-scope="scope">{{ scope.row.id }}</template>
                            </el-table-column>
                            <el-table-column label="接口url" :show-overflow-tooltip="true" align="center">
                                <template slot-scope="scope">{{ scope.row.api_addr }}</template>
                            </el-table-column>
                            <el-table-column label="响应头" :show-overflow-tooltip="true" align="center">
                                <template slot-scope="scope">{{ scope.row.response_header }}</template>
                            </el-table-column>
                            <el-table-column label="响应体" :show-overflow-tooltip="true" align="center">
                                <template slot-scope="scope">{{ scope.row.response_body }}</template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tabs',
    data() {
        return {
            formTask: {
                task_name: '', //任务集名称
                times: '', // 选择时间
                startTime: '', //开始时间
                endTime: '' //结束时间
            },
            activeName: '0',
            tabPosition: 'left',
            total_count: {}, // 任务集总览
            task_report: [], //任务集列表
            report_res: {}, //单项任务集总览
            assert_ret: [], //执行失败
            error_ret: [], //执行错误
            params_ret: [], //请求参数
            res_ret: [], //总体相应结果
            tagsList: []
        };
    },
    watch: {
        $route(newValue, oldValue) {
            this.setTags(newValue);
        }
    },
    created() {
        this.getData();
    },
    watch: {
        $route(to, from) {
            if (to.path == '/testTaskSetResult') {
                this.getData();
            }
        }
    },
    methods: {
        // Tab监听
        handleClick(tab, event) {
            console.log(tab, event);
            let params = {
                task_id: tab.name,
                // report_id: localStorage.getItem('report_id')
                report_id: ''
                // task_id:'268',
                // report_id: '1434'
            };
            // 判断“url里"?"后面的”是否为“undefined”
            if (this.$route.query.report_id == undefined) {
                params.report_id = localStorage.getItem('report_id');
            } else {
                params.report_id = this.$route.query.report_id;
            }
            // console.log(params.report_id);
            this.$api
                .report_detail(params)
                .then((res) => {
                    if (res.code == 0) {
                        // 单项任务集总览
                        this.report_res = res.report_res;
                        // 执行失败
                        this.assert_ret = res.assert_ret;
                        // 执行错误
                        this.error_ret = res.error_ret;
                        // 请求参数
                        this.params_ret = res.params_ret;
                        // 总体相应结果
                        this.res_ret = res.res_ret;
                    } else {
                        this.$message.error(res.results.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.results.msg);
                });
        },
        // 执行测试用例
        getData() {
            this.activeName = '0';
            // var url = window.location.href.split('?')[1]; /*获取url里"?"后面的值*/
            // console.log(url);
            // 获取url里"?"后面的report_id的值
            // console.log(this.$route.query.report_id);
            let params = {
                report_id: ''
            };
            // 判断“url里"?"后面的”是否为“undefined”
            if (this.$route.query.report_id == undefined) {
                params.report_id = localStorage.getItem('report_id');
            } else {
                params.report_id = this.$route.query.report_id;
            }
            this.$api
                .tasks_total_massage(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.total_count = res.total_count;
                        this.task_report = res.task_report;
                    } else {
                        this.$message.error(res.results.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.results.msg);
                });
        }
    }
};
</script>


<style scoped lang="less">
/deep/ .assert-ret {
    color: #e6a23c;
    .is-center {
        background-color: #fdf6ec !important;
    }
}

/deep/ .error-ret {
    color: #f56c6c;
    .is-center {
        background-color: #fef0f0 !important;
    }
}

/deep/ .params-ret {
    color: #67c23a;
    .is-center {
        background-color: #f0f9eb !important;
    }
}

/deep/ .res-ret {
    color: #409eff;
    .is-center {
        background-color: #ecf5ff !important;
    }
}

h5 {
    margin: 10px 0;
}
.inventory {
    width: 100%;
    font-size: 20px;
    border-bottom: 1px #eee solid;
    padding: 10px 0;
    box-sizing: border-box;
}
.handle-box {
    text-align: center;
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

.mr10 {
    margin-right: 10px;
}
.mt2 {
    margin-top: 2px;
}

.test-report {
    display: flex;
    justify-content: space-between;
}

.el-row {
    margin-bottom: 20px;
}

.grid-content {
    background: #eeeeee;
    width: 24%;
    display: flex;
    flex-direction: column;
}

.grid-cont-right {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #999;
    height: 40px;
    div {
        color: #666666;
    }
}

.grid-num {
    font-size: 24px;
    font-weight: bold;
    margin-right: 10px;
}

.grid-con-icon {
    line-height: 60px;
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 32px;
}

.grid-con-1 .grid-con-icon {
    background: #409eff;
}

.grid-con-1 .grid-num {
    color: #409eff;
}

.grid-con-2 .grid-con-icon {
    background: #67c23a;
}

.grid-con-2 .grid-num {
    color: #67c23a;
}

.grid-con-3 .grid-con-icon {
    background: #e6a23c;
}

.grid-con-3 .grid-num {
    color: #e6a23c;
}
.grid-con-4 .grid-con-icon {
    background: #f56c6c;
}

.grid-con-4 .grid-num {
    color: #f56c6c;
}
</style>

