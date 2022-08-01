<template>
    <div>
        <el-card style="margin-bottom: 20px">
            <div class="handle-box">
                <span class="public-title">项目:</span>
                <el-select @change="changeRequirepid" v-model="params.pid" placeholder="请选择项目" class="public-form">
                    <el-option v-for="item in projectsName" :key="item.pid" :label="item.pname" :value="item.pid"> </el-option>
                </el-select>

                <span class="public-title">需求:</span>
                <el-select
                    v-model="params.rid"
                    placeholder="请选择需求"
                    class="public-form"
                    @change="changeDuty"
                    :disabled="showRequiresName == true"
                >
                    <el-option v-for="item in requiresName" :key="item.ZID" :label="item.rname" :value="item.ZID"> </el-option>
                </el-select>
                <span class="public-title">任务:</span>
                <el-select :disabled="showDutyName == true" v-model="params.tid" placeholder="请选择任务" class="public-form">
                    <el-option v-for="item in dutyName" :key="item.DID" :label="item.task_name" :value="item.DID"> </el-option>
                </el-select>

                <!-- <span class="public-title">终端:</span>
                <el-select v-model="params.terminal" placeholder="请选择终端" class="public-form">
                    <el-option v-for="item in terminal" :key="item" :label="item" :value="item"> </el-option>
                </el-select> -->
                <span class="public-title">用户组:</span>
                <el-select v-model="params.group" placeholder="用户组" class="public-form" @change="getchangeGroup">
                    <el-option v-for="item in dutype" :key="item.id" :label="item.group_name" :value="item.group_name"> </el-option>
                </el-select>
                <br />
                <span class="public-title">起始时间:</span>
                <el-date-picker v-model="params.stime" class="public-form" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                </el-date-picker>
                -
                <el-date-picker v-model="params.etime" class="public-form" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                </el-date-picker>

                <el-button type="primary" @click="reportGenerate">生成报表</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
            </div>
        </el-card>

        <el-card class="box-card">
            <!-- <div class="table-title">
                <h4 style="color:#909399;line-height:40px;text-align:center;">缺陷年龄统计</h4> -->
            <!-- <div class="select-public">
                    <span class="public-title">需求:</span>
                    <el-select v-model="value" placeholder="请选择需求" class="public-form">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </div> -->
            <!-- </div> -->
            <div ref="bar" class="bar"></div>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="owner" label="人名" align="center">
                    <!-- <template slot-scope="scope">{{ scope.row.id }}</template> -->
                </el-table-column>
                <el-table-column prop="total_bugs" label="BUG总数">
                    <!-- <template slot-scope="scope">{{ scope.row.project_name }}</template> -->
                </el-table-column>
                <el-table-column prop="avg_resolved_time" label="BUG平均解决时间/小时">
                    <!-- <template slot-scope="scope">{{ scope.row.project_desc }}</template> -->
                </el-table-column>
            </el-table>
            <div v-if="isShow == true">
                <el-table :data="tableData1" border size="mini" class="table1" ref="multipleTable">
                    <el-table-column prop="dev_count" label="参与项目的开发人员" align="center">
                        <!-- <template>{{ dev_count }}</template> -->
                    </el-table-column>
                    <el-table-column prop="group_avg_resolved_time" label="组解决一个bug的平均解决时间" align="center">
                        <!-- <template>{{ group_avg_resolved_time }}</template> -->
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'DefectStatistics',
    data() {
        return {
            dialogVisible: false,
            title: '创建项目',
            requiresName: [], // 需求名称搜索
            showRequiresName: false,
            dutyName: [],
            dutyped: [],
            showDutyName: true,
            tableData: [], // 列表数据
            tableData1: [],
            pageTotal: 0, // 数据总条数
            disabled: false,
            projectsName: [],
            terminal: ['IOS', 'Android', 'PC'],
            dutype: [],
            value: '',
            params: {},
            isShow: false,
            options: {
                title: {
                    text: '缺陷年龄统计',
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
                yAxis: {
                    type: 'category',
                    data: []
                },
                xAxis: {
                    type: 'value'
                },
                legend: {
                    left: '5%'
                },
                series: {
                    name: 'BUG平均解决时间/小时',
                    type: 'bar',
                    barWidth: 10,
                    zlevel: 1,
                    itemStyle: {
                        barBorderRadius: [0, 6, 6, 0],
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#3D9FFF' // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: '#41D7F3' // 100% 处的颜色
                                }
                            ],
                            global: false // 缺省为 false
                        }
                    },
                    // itemStyle: {
                    //     normal: {
                    //         // barBorderRadius: [0, 6, 6, 0],
                    //         itemStyle: {
                    //             barBorderRadius: [4, 24, 0, 0],
                    //             color: {
                    //                 type: 'linear',
                    //                 x: 0,
                    //                 y: 1,
                    //                 x2: 0,
                    //                 y2: 0,
                    //                 colorStops: [
                    //                     {
                    //                         offset: 0,
                    //                         color: '#3D9FFF' // 0% 处的颜色
                    //                     },
                    //                     {
                    //                         offset: 1,
                    //                         color: '#41D7F3' // 100% 处的颜色
                    //                     }
                    //                 ],
                    //                 global: false // 缺省为 false
                    //             }
                    //         }
                    //         // color: new echarts.graphic.LinearGradient(
                    //         //     0,
                    //         //     0,
                    //         //     1,
                    //         //     1,
                    //         //     [
                    //         //         {
                    //         //             offset: 0,
                    //         //             color: '#3D9FFF'
                    //         //         },
                    //         //         {
                    //         //             offset: 1,
                    //         //             color: '#41D7F3'
                    //         //         }
                    //         //     ],
                    //         //     false
                    //         // )
                    //     }
                    // },
                    data: []
                }
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
        // document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        onReset() {
            this.params = {};
            this.tableData = [];
            this.tableData1 = [];
            this.options.series = [];
        },
        groupName() {
            // dutype
            this.$api.apiChart
                .group_name({})
                .then((res) => {
                    if (res.code == 0) {
                        this.dutype = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        getchangeGroup(e) {
            let id = 0;
            this.dutype.map((item) => {
                if (item.group_name == e) {
                    id = item.id;
                }
            });
            this.groupPerson(id);
        },
        groupPerson(e) {
            // dutype
            this.$api.apiChart
                .group_to_user({ gid: e })
                .then((res) => {
                    if (res.code == 0) {
                        this.dutyped = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        initEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.bar);

            myEcharts.setOption(this.options);
        },
        async reportGenerate() {
            let arr = [];
            let seriesData = [];
            this.tableData1 = [];
            let data = await this.getData();
            this.tableData = data;
            data.map((item) => {
                arr.push(item.owner);
                seriesData.push(item.avg_resolved_time);
            });
            this.options.yAxis.data = arr;
            this.options.series.data = seriesData;
            this.initEcharts();
        },
        handleClose() {
            this.dialogVisible = false;
        },
        // 新增
        onAdd() {
            this.dialogVisible = true;
        },
        async getData() {
            // 项目检索状态+列表
            // let par = {assignee: '张三'};
            // this.params
            let data = [];
            await this.$api.apiChart
                .resolve_time(this.params)
                .then((res) => {
                    if (res.code == 0) {
                        // this.options.series.data = res.result;
                        // this.tableData = res.result;
                        data = res.result;

                        let obj = {
                            dev_count: res.dev_count,
                            group_avg_resolved_time: res.group_avg_resolved_time
                        };
                        this.tableData1.push(obj);

                        if (res.dev_count == 0 && res.group_avg_resolved_time == '当前还没有开始解决bug...') {
                            this.isShow = false;
                        } else {
                            this.isShow = true;
                        }

                        // this.pageTotal = res.count;
                        // this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
            return data;
        },
        changeRequirepid(e) {
            let parm = { pid: e };
            this.getRequireName(parm);
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
                .then((res) => {
                    if (res.code == 0) {
                        this.projectsName = res.project_name;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        getRequireName(e) {
            // 获取项目名称
            this.$api.apiChart
                .rname_id(e)
                .then((res) => {
                    if (res.code == 0) {
                        res.result.map((item) => {
                            item.ZID = this.$methods.serchCutOut(item.ZID);
                        });
                        this.requiresName = res.result;
                        this.showRequiresName = false;
                        // console.log('res.result', res.result);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        getDutyName(e) {
            // 获取项目名称
            this.$api.apiChart
                .tname_id(e)
                .then((res) => {
                    if (res.code == 0) {
                        // this.dutyName = res.task_info;
                        res.task_info.map((item) => {
                            item.DID = this.$methods.serchCutOut(item.DID);
                        });
                        this.dutyName = res.task_info;
                        this.showDutyName = false;
                        // console.log('this.dutyName', this.dutyName);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 全局回车搜索
        // enterKey(event) {
        //     const code = event.keyCode;
        //     const path = this.$route.path;
        //     if (code == 13 && path == '/testProject') {
        //         this.handleSearch();
        //     }
        // },
        // 触发搜索按钮
        // handleSearch() {
        //     this.$set(this.params, 'page', 1);
        //     this.getData();
        // },
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
.table1 {
    width: 60%;
    font-size: 14px;
    margin-top: 10px;
    margin-left: 230px;
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
