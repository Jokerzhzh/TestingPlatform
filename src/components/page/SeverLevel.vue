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
                >
                    <el-option
                        v-for="item in requiresName"
                        :key="item.ZID"
                        :label="item.rname"
                        :value="item.ZID"
                    ></el-option>
                </el-select>

                <!-- <span class="public-title">终端:</span>
                <el-select v-model="params.terminal" placeholder="请选择终端" class="public-form">
                    <el-option v-for="item in terminal" :key="item" :label="item" :value="item"> </el-option>
                </el-select>-->
                <br />
                <span class="public-title">用户组:</span>
                <el-select v-model="params.group" placeholder="用户组" class="public-form">
                    <el-option
                        v-for="item in dutype"
                        :key="item.id"
                        :label="item.group_name"
                        :value="item.group_name"
                    ></el-option>
                </el-select>
                <!-- <span class="public-title">人员岗位:</span>
                <el-select v-model="params.utype" placeholder="请选人员岗位" class="public-form">
                    <el-option v-for="item in dutype" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>-->
                <!-- <br /> -->
                <!-- <span class="public-title">人员:</span>
                <el-input v-model="params.uname" class="public-form" placeholder="请输人员名称"></el-input>-->
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

        <el-card class="box-card" v-loading="dialogVisible" style="margin-bottom: 10px">
            <div class="table-title">
                <!-- <h4 style="color:#909399;line-height:40px;text-align:center;">缺陷严重级别分布图</h4> -->
                <div class="select-public">
                    <!-- <span class="public-title">需求:</span> -->
                    <el-select
                        v-model="status"
                        placeholder="请选择严重级别状态"
                        class="public-form"
                        @change="changSatus"
                    >
                        <el-option
                            v-for="item in levelStatus"
                            :key="item"
                            :label="item"
                            :value="item"
                        ></el-option>
                    </el-select>
                </div>
            </div>
            <!-- <template> -->
            <div ref="bar" class="bar"></div>
            <!-- </template> -->
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="name" label="严重程度" align="center">
                    <!-- <template slot-scope="scope">{{ scope.row.name }}</template> -->
                </el-table-column>
                <el-table-column prop="value" label="总数">
                    <!-- <template slot-scope="scope">{{ scope.row.value }}</template> -->
                </el-table-column>
            </el-table>
        </el-card>
        <el-card class="box-card" v-if="showLevel">
            <div class="table-title">
                <h4
                    v-show="showRequiresName"
                    style="color:#909399;line-height:40px;text-align:center;"
                >缺陷严重级别分布图</h4>
            </div>
            <!-- <template v-if="showRequiresName"> -->
            <div ref="pie" class="bar" :style="{ width: scrollerWidth, height: scrollerHeight }"></div>
            <!-- </template> -->
            <el-table
                :data="tableDataLevel"
                border
                size="mini"
                class="table"
                ref="multipleTable"
                v-show="showRequiresName"
            >
                <el-table-column prop="name" label="名称" align="center">
                    <!-- <template slot-scope="scope">{{ scope.row.name }}</template> -->
                </el-table-column>
                <el-table-column prop="value" label="数量">
                    <!-- <template slot-scope="scope">{{ scope.row.value }}</template> -->
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
            dialogVisible: false,
            scrollerWidth: '100%',
            scrollerHeight: '400px',
            title: '创建项目',
            requiresName: [], // 需求名称搜索
            showRequiresName: false,
            showLevel: false,
            dutyName: [],
            showDutyName: true,
            tableData: [], // 列表数据
            tableDataLevel: [],
            pageTotal: 0, // 数据总条数
            disabled: false,
            projectsName: [],
            terminal: ['IOS', 'Android', 'PC'],
            dutype: [
                { value: '1', label: 'reporter' },
                { value: '2', label: 'assignee' }
            ],
            status: '',
            params: {},
            iterationList: [], // 迭代列表
            levelStatus: ['Highest', 'High', 'Medium', 'Low', 'Lowest'],
            options: {
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                title: {
                    text: '缺陷严重级别分布图',
                    // subtext: '纯属虚构',

                    // top: '1%',

                    left: 'center',

                    textStyle: { color: '#909399' }
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    bottom: 'bottom'
                    // left: 'left'
                },
                series: {
                    name: '',
                    type: 'pie',
                    // radius: '50%',
                    data: [],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            },
            pieOptions: {
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                title: {
                    text: '',
                    subtext: '',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        fontWeight: 'normal',
                        color: '#29EEF3',
                        fontSize: '75'
                    },
                    subtextStyle: {
                        fontWeight: 'normal',
                        color: '#29EEF3',
                        fontSize: '75'
                    }
                },
                // title: {
                //     text: '缺陷严重级别分布图',
                //     // subtext: '纯属虚构',

                //     top: '1%',

                //     left: 'center',

                //     textStyle: { color: '#909399' }
                // },
                tooltip: {
                    formatter: function(params) {
                        return params.name + '：' + params.percent + ' %';
                    }
                },
                // legend: {
                //     show: true,
                //     itemGap: 12,
                //     data: ['占比', '剩余']
                // },

                series: {
                    name: 'circle',
                    type: 'pie',
                    clockWise: true,
                    radius: ['84%', '100%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    hoverAnimation: false,
                    data: [
                        {
                            value: '',
                            name: '',
                            itemStyle: {
                                normal: {
                                    color: {
                                        // 颜色渐变
                                        colorStops: [
                                            {
                                                offset: 0,
                                                color: '#4FADFD' // 0% 处的颜色
                                            },
                                            {
                                                offset: 1,
                                                color: '#28E8FA' // 100% 处的颜色1
                                            }
                                        ]
                                    },
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            }
                        },
                        {
                            name: '',
                            value: '',
                            itemStyle: {
                                normal: {
                                    color: '#E1E8EE'
                                }
                            }
                        }
                    ]
                }
            },
            iterKey: '',
            projectKey: ''
        };
    },
    mounted() {
        // 绑定enter事件
        // document.addEventListener('keyup', this.enterKey);
        // this.getData();
        this.getProjectName();
        this.groupName();
        // this.enterKey();
    },
    destroyed() {
        // 销毁enter事件
        // document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        onReset() {
            this.params = {};
            this.tableData = [];
            this.options.series = [];
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
        async changSatus(e) {
            let data = this.options.series.data;
            // console.log('wwww', e, data);
            data.map(item => {
                if (item.hasOwnProperty(e)) {
                    this.pieOptions.series.data = item[e];
                    this.tableDataLevel = item[e];
                    this.pieOptions.series.data[0].itemStyle = {
                        normal: {
                            color: {
                                // 颜色渐变
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#4FADFD' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#28E8FA' // 100% 处的颜色1
                                    }
                                ]
                            },
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    };
                    this.pieOptions.series.data[1].itemStyle = {
                        normal: {
                            color: '#E1E8EE'
                        }
                    };
                    this.pieOptions.title.text = item.name;
                    this.pieOptions.title.subtext = item.value;
                }
            });
            this.showRequiresName = true;
            this.scrollerWidth = '100%';
            this.scrollerHeight = '400px';
            await this.initPieEcharts();
        },
        initEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.bar);
            // let option = options;
            // myEcharts.clear();
            myEcharts.setOption(this.options);
            this.dialogVisible = false;
        },
        initPieEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.pie);
            // let option = options;
            // myEcharts.clear();
            myEcharts.setOption(this.pieOptions);
            // this.dialogVisible = false;
        },
        async reportGenerate() {
            this.dialogVisible = true;
            this.showLevel = true;
            let data = await this.getData();
            this.tableData = data;
            this.options.series.data = data;
            this.scrollerWidth = '100%';
            this.scrollerHeight = '400px';
            this.initEcharts();
            // this.initPieEcharts();
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
            if (!this.params.pid) {
                this.$message.error('项目为必选项');
                return;
            }
            // this.params
            let data = [];
            await this.$api.apiChart
                .severLevel(this.params)
                .then(res => {
                    if (res.code == 0) {
                        // this.options.series.data = res.result;
                        // this.tableData = res.result;
                        data = res.result;
                        // this.dialogVisible = false;
                        // this.pageTotal = res.count;
                        // this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                        // this.dialogVisible = false;
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
            return data;
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
        changeRequire(e) {
            // console.log(this.params.rid, e);
            let parm = { rname: e };
            this.getRequireName(parm);
        },
        // blurDuty(e) {

        // },
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
        // 全局回车搜索
        // enterKey(event) {
        //     console.log('event', event);
        //     const code = event.keyCode;
        //     const path = this.$route.path;
        //     if (path == '/statusDistribution') {
        //         // this.handleSearch();
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
        width: 200px;
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
