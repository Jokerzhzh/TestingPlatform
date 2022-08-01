<template>
    <div>
        <el-card style="margin-bottom:20px">
            <div class="handle-box">
                <span class="public-title">项目:</span>
                <el-select
                    v-model="params.big_project"
                    @change="changeRequirepid"
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
                    :disabled="!params.big_project"
                    v-model="params.project_id"
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
                    v-model="params.requid_id"
                    filterable
                    :filter-method="changeRequire"
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
                <span class="public-title">用户组:</span>
                <el-select
                    v-model="params.group_id"
                    placeholder="用户组"
                    class="public-form"
                    @change="serchPerson"
                >
                    <el-option label="全部" value="0"></el-option>
                    <el-option
                        v-for="item in dutype"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <span class="public-title">用例执行次数:</span>
                <el-input
                    v-model="params.excute_times"
                    class="public-form"
                    type="number"
                    placeholder
                >
                    <template slot="append">次</template>
                </el-input>
                <!-- <span class="public-title">人员:</span>
               
                <el-select v-model="params.userid" class="public-form" placeholder="请输人员名称">
                    <el-option v-for="item in users" :key="item.id" :label="item.username" :value="item.id"> </el-option>
                </el-select>

                <span class="public-title">图表类型:</span>
                <el-select v-model="params.graph_type" placeholder="图表类型" class="public-form">
                    <el-option v-for="item in useCase" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>-->

                <br />

                <span class="public-title">起始时间:</span>
                <el-date-picker
                    v-model="params.begin_time"
                    class="public-form"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                ></el-date-picker>-
                <el-date-picker
                    v-model="params.end_time"
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
                <h4 style="color:#909399;line-height:40px;text-align:center;">
                    用例执行次数情况
                </h4>
            </div>-->
            <div ref="bar" class="bar"></div>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="case_name" label="用例名称" align="center">
                    <!-- <template slot-scope="scope">{{ scope.row.id }}</template> -->
                </el-table-column>
                <el-table-column prop="username" label="执行人">
                    <!-- <template slot-scope="scope">{{ scope.row.project_name }}</template> -->
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
            title: '创建项目',
            requiresName: [], // 需求名称搜索
            showRequiresName: false,
            dutyName: [],
            showDutyName: true,
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            projectsName: [],
            terminal: ['IOS', 'Android', 'PC'],
            dutype: [],
            useCase: [
                { label: '编写用例', value: 1 },
                { label: '执行用例', value: 2 }
            ],
            users: [],
            value: '',
            params: {},
            options: {
                title: {
                    text: '用例执行次数情况',
                    // subtext: '纯属虚构',

                    // top: '1%',

                    left: 'center',

                    textStyle: { color: '#909399' }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                // legend: {},
                series: {
                    name: '',
                    type: 'bar',
                    data: []
                }
            },
            iterationList: [] // 迭代列表
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
        // document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        onReset() {
            this.params = {};
            this.tableData = [];
            this.options = {};
            this.initEcharts();
        },
        groupName() {
            // dutype
            this.$api.apiChart
                .get_group({})
                .then(res => {
                    if (res.code == 0) {
                        this.dutype = res.group;
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
        changeRequire(e) {
            // console.log(this.params.rid, e);
            let parm = { rname: e, belong_project: this.params.big_project };
            this.getRequireName(parm);
        },
        async reportGenerate() {
            let xAxis = [],
                series = [];
            let res = await this.getData();
            console.log('res', res);
            this.tableData = this.oneArr(res.data);
            res.tj = res.tj ? res.tj : [];
            res.tj.map(ite => {
                xAxis.push(ite.username);
                series.push(ite.sum_all);
            });
            this.options.xAxis.data = xAxis;
            this.options.series.data = series;
            this.initEcharts();
        },
        async getData() {
            if (!this.params.big_project) {
                this.$message.error('项目为必选项');
                return;
            }
            if (!this.params.excute_times) {
                this.$message.error('用例执行次数为必选项');
                return;
            }
            let param = JSON.parse(JSON.stringify(this.params));
            if (this.params.requid_id) {
                delete param.project_id;
                delete param.big_project;
            } else if (this.params.project_id) {
                delete param.requid_id;
            } else {
                delete param.project_id;
                delete param.requid_id;
            }
            // 项目检索状态+列表
            let data = {};
            await this.$api.apiChart
                .excuteTimes(param)
                .then(res => {
                    if (res.code == 0) {
                        data = res;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
            return data;
        },
        changeDuty(e) {
            console.log('e', e);
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
                        this.showRequiresName = false;
                        // console.log('res.result', res.result);
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
        serchPerson(e) {
            //   group_users
            // this.params.group_id
            this.getGroupUsers(e);
        },
        getGroupUsers(e) {
            let parms = {
                gid: e
            };
            this.$api.apiChart
                .group_users(parms)
                .then(res => {
                    if (res.code == 0) {
                        this.users = res.users;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.$message.error(err);
                });
        },
        oneArr(data) {
            data = data.map ? data : [];
            data.map(item => {
                item.case_name = item.caseid.case_name;
                item.executor.map(ite => {
                    item.username = ite.username;
                });
            });

            return data;
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
        changeRequirepid(e) {
            let parm = { key: e };
            if (this.projectKey != e) {
                this.projectKey = e;
                delete this.params.project_id;
                delete this.params.rid;
                this.requiresName = [];
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
                delete this.params.requid_id;
                this.getRequireName(parm);
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
