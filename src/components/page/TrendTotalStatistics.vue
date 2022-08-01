<template>
    <div>
        <el-card style="margin-bottom:20px">
            <div class="handle-box">
                <span class="public-title">项目:</span>
                <el-select
                    @change="changeRequirepid"
                    v-model="params.pid"
                    placeholder="请选择项目"
                    class="public-form"
                >
                    <el-option
                        v-for="item in projectsName"
                        :key="item.pid"
                        :label="item.pname"
                        :value="item.pid"
                    ></el-option>
                </el-select>
                <span class="public-title">迭代项目:</span>
                <el-select
                    class="public-form"
                    placeholder="请选择迭代项目"
                    :disabled="!params.pid"
                    v-model="params.iter_id"
                    @change="changeiterId"
                >
                    <el-option
                        v-for="item in iterationList"
                        :key="item.id"
                        :label="item.project_name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <span class="public-title">需求:</span>
                <el-select
                    v-model="params.rid"
                    placeholder="请选择需求"
                    class="public-form"
                    @change="changeDuty"
                    :disabled="showRequiresName == true"
                >
                    <el-option
                        v-for="item in requiresName"
                        :key="item.ZID"
                        :label="item.rname"
                        :value="item.ZID"
                    ></el-option>
                </el-select>

                <div style="display:inline-block;">
                    <span style="display:flex">
                        <span class="public-title">统计项:</span>
                        <div style="padding:2px 0 0 5px">
                            <el-checkbox-group v-model="typed" @change="changechecd">
                                <template v-for="item in checkItem" ;key="item.value">
                                    <el-checkbox
                                        :label="item.value"
                                        :key="item.value"
                                    >{{ item.name }}</el-checkbox>
                                </template>
                                <!-- <el-checkbox label="选中且禁用"></el-checkbox> -->
                            </el-checkbox-group>
                        </div>
                    </span>
                </div>
                <br />
                <span class="public-title">起始时间:</span>
                <el-date-picker
                    v-model="params.stime"
                    class="public-form"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                ></el-date-picker>-
                <el-date-picker
                    v-model="params.etime"
                    class="public-form"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                ></el-date-picker>

                <el-button type="primary" @click="reportGenerate">生成报表</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
            </div>
        </el-card>

        <el-card class="box-card">
            <!-- <div class="table-title">
            <h4 style="color:#909399;line-height:40px;text-align:center;">缺陷累计变化趋势图</h4>-->
            <!-- <div class="select-public">
                    <span class="public-title">需求:</span>
                    <el-select v-model="value" placeholder="请选择需求" class="public-form">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
            </div>-->
            <!-- </div> -->
            <div ref="bar" class="bar"></div>
            <el-table
                sum-text="总计"
                show-summary
                :summary-method="getSummaries"
                :data="tableData"
                border
                size="mini"
                class="table"
                ref="multipleTable"
            >
                <el-table-column prop="datetime" label="日期" align="center">
                    <!-- <template slot-scope="scope">{{ scope.row.datetime }}</template> -->
                </el-table-column>
                <el-table-column prop="Open" label="创建缺陷总数">
                    <!-- <template slot-scope="scope">{{ scope.row.Open }}</template> -->
                </el-table-column>
                <el-table-column prop="Resolved" label="修复缺陷总数">
                    <!-- <template slot-scope="scope">{{ scope.row.Resolved }}</template> -->
                </el-table-column>
                <el-table-column prop="Closed" label="关闭缺陷总数">
                    <!-- <template slot-scope="scope">{{ scope.row.Closed }}</template> -->
                </el-table-column>
                <el-table-column prop="Not_Closed" label="未关闭缺陷总数">
                    <!-- <template slot-scope="scope">{{ scope.row.Not_Closed }}</template> -->
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'DefectStatistics',
    data() {
        return {
            iterKey: '',
            projectKey: '', //
            dialogVisible: false,
            typed: [],
            title: '创建项目',
            requiresName: [], // 需求名称搜索
            showRequiresName: false,
            dutyName: [],
            showDutyName: true,
            tableData: [{ datetime: '' }], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            projectsName: [],
            status: [],
            terminal: ['IOS', 'Android', 'PC'],
            dutype: [],
            iterationList: [], // 迭代列表
            checkItem: [
                { name: '创建缺陷总数', value: 1 },
                { name: '修复缺陷总数', value: 2 },
                { name: '关闭缺陷总数', value: 3 },
                { name: '未关闭缺陷总数', value: 4 }
            ],
            value: '',
            params: {
                _type: []
            },
            options: {
                title: {
                    text: '缺陷累计变化趋势图',
                    // subtext: '纯属虚构',

                    // top: '1%',

                    // left: 'center',

                    textStyle: { color: '#909399' }
                },
                legend: {
                    // left: '1%'
                },
                // toolbox: {
                //     feature: {
                //         saveAsImage: {
                //             show: true
                //         }
                //     }
                // },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    // data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: []
            }
        };
    },
    mounted() {
        // 绑定enter事件
        // document.addEventListener('keyup', this.enterKey);
        // this.initEcharts();
        this.getProjectName();
        this.groupName();
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        onReset() {
            this.params = {};
            this.tableData = [];
            this.options = {};
            this.initEcharts();
        },
        changechecd(e) {
            this.params._type = JSON.stringify(e);
            // this.params._type = JSON.stringify(this.params._type);
            console.log('this.params._type', this.params._type.toString());
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    // sums[index] += ' 元';
                } else {
                    sums[index] = 'N/A';
                }
            });

            return sums;
        },
        groupName() {
            // dutype
            this.$api.apiChart
                .group_name({})
                .then(res => {
                    if (res.code == 0) {
                        this.dutype = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        initEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.bar);

            myEcharts.setOption(this.options);
        },
        handleClose() {
            this.dialogVisible = false;
        },
        // 新增
        onAdd() {
            this.dialogVisible = true;
        },
        async reportGenerate() {
            this.dialogVisible = true;
            this.showLevel = true;
            let data = await this.getData();
            this.tableData = data;
            console.log(JSON.stringify(this.tableData));
            let arr = [];
            let series = [
                {
                    name: '创建缺陷总数',
                    type: 'line',
                    // stack: '总量',
                    data: []
                },
                {
                    name: '修复缺陷总数',
                    type: 'line',
                    // stack: '总量',
                    data: []
                },
                {
                    name: '关闭缺陷总数',
                    type: 'line',
                    // stack: '总量',
                    data: []
                },
                {
                    name: '未关闭缺陷总数',
                    type: 'line',
                    stack: '总量',
                    data: []
                }
            ];
            data.map((ite, index) => {
                arr.push(ite.datetime);
                series.map(item => {
                    if (item.name == '创建缺陷总数') {
                        item.data.push(ite.Open);
                    } else if (item.name == '修复缺陷总数') {
                        item.data.push(ite.Resolved);
                    } else if (item.name == '关闭缺陷总数') {
                        item.data.push(ite.Closed);
                    } else if (item.name == '未关闭缺陷总数') {
                        item.data.push(ite.Not_Closed);
                    }
                });
                // series[0].data.push(ite.Open);
                // series[1].data.push(ite.Resolved);
                // series[2].data.push(ite.Closed);

                // series.map(ite => {
                //     if (key == 'Open') {
                //         ite.name = '创建缺陷总数';
                //         ite.data.push(ite[key]);
                //     } else if (key == 'Resolved') {
                //         ite.name = '修复缺陷总数';
                //         ite.data.push(ite[key]);
                //     } else if (key == 'Closed') {
                //         ite.name = '关闭缺陷总数';
                //         ite.data.push(ite[key]);
                //     }
                // });
            });
            console.log('series', JSON.stringify(series));
            console.log('arr', JSON.stringify(arr));
            this.options.xAxis.data = arr;
            this.options.series = [...series];
            this.initEcharts();
            // this.initPieEcharts();
            // this.getSummaries();
        },
        async getData() {
            // 项目检索状态+列表
            if (!this.params.pid) {
                this.$message.error('项目为必选项');
                return;
            }
            let data = [];

            await this.$api.apiChart
                .daily_trend(this.params)
                .then(res => {
                    if (res.code == 0) {
                        data = res.result;
                    } else {
                        this.$message.error(res.msg);
                        console.log('res.msg', res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
            return data;
        },
        getProjectName() {
            // 获取项目名称
            this.$api.apiChart
                .projectName({})
                .then(res => {
                    if (res.code == 0) {
                        this.projectsName = res.projects_name;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        changeRequirepid(e) {
            let parm = { key: e };
            if (this.projectKey != e) {
                this.projectKey = e;
                delete this.params.iter_id;
                this.requiresName = [];
                delete this.params.rid;
                this.getIterList(parm);
            }
        },
        /**
         * 请求迭代列表
         * @param {Object} e 请求迭代列表参数
         */
        getIterList(e) {
            // this.requiresName = [];
            this.$api
                .get_iteration_list(e)
                .then(res => {
                    if (res.code == 0) {
                        this.iterationList = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(err);
                });
        },
        /**
         * 根据迭代id获取需求列表
         * @param {String} e 选中迭代id
         */
        changeiterId(e) {
            let parm = { pid: e };
            if (this.iterKey != e) {
                this.iterKey = e;
                delete this.params.rid;
                this.getRequireName(parm);
            }
        },
        changeRequire(e) {
            // console.log(this.params.rid, e);
            let parm = { rname: e };
            this.getRequireName(parm);
        },
        changeDuty(e) {
            // e = this.$methods.serchCutOut(e);
            let parm = { rid: e };
            this.getDutyName(parm);
        },
        getProjectName() {
            // 获取项目名称
            this.$api.apiChart
                .projectName({})
                .then(res => {
                    if (res.code == 0) {
                        this.projectsName = res.project_name;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        getRequireName(e) {
            // 获取项目名称
            this.$api.apiChart
                .rname_id(e)
                .then(res => {
                    if (res.code == 0) {
                        res.result.map(item => {
                            item.ZID = this.$methods.serchCutOut(item.ZID);
                        });
                        this.requiresName = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        getDutyName(e) {
            // 获取项目名称
            this.$api.apiChart
                .tname_id(e)
                .then(res => {
                    if (res.code == 0) {
                        // this.dutyName = res.task_info;
                        res.task_info.map(item => {
                            item.DID = this.$methods.serchCutOut(item.DID);
                        });
                        this.dutyName = res.task_info;
                        this.showDutyName = false;
                        // console.log('this.dutyName', this.dutyName);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        // // 全局回车搜索
        // enterKey(event) {
        //     const code = event.keyCode;
        //     const path = this.$route.path;
        //     if (code == 13 && path == '/testProject') {
        //         this.handleSearch();
        //     }
        // },
        // // 触发搜索按钮
        // handleSearch() {
        //     this.$set(this.params, 'page', 1);
        //     this.getData();
        // },
        // // 控制下拉框失去焦点
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
        }
    }
    // mounted() {
    //     this.initEcharts();
    // }
};
</script>
<style scoped lang="less">
.bar {
    width: 100%;
    height: 400px;
    margin: auto;
    margin-top: 30px;
    margin-bottom: 30px;
}
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

//公共弹窗
.public-dialog {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex !important;
}
.box-card {
    flex: 1;
    .table-title {
        overflow: hidden;
        .select-public {
            float: right;
        }
    }
}
.box-input-card {
    width: 320px;
    margin-left: 10px;
}
.box-line {
    border-bottom: 1px solid #cccccc;
}
.project-input {
    border: 0px solid transparent !important;
    outline: none !important;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
}
.textarea-input {
    width: 100%;
    height: 400px;
    outline: none;
    border: 1px solid #cccccc;
    padding: 5px 10px;
    box-sizing: border-box;
}
.textarea-table {
    height: 80px;
    outline: none;
    width: 100%;
    border: 0px solid transparent;
}
.public-form {
    margin: 0 10px;
}
.public-title {
    font-size: 14px;
    font-weight: 400;
}
</style>
