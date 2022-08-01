<template>
    <div>
        <el-card style="margin-bottom: 20px">
            <div class="handle-box">
                <span class="public-title">项目:</span>
                <el-select @change="changeRequirepid" v-model="params.pid" placeholder="请选择项目" class="public-form">
                    <el-option v-for="item in projectsName" :key="item.pid" :label="item.pname" :value="item.pid"></el-option>
                </el-select>
                <span class="public-title">迭代项目:</span>
                <el-select
                    class="public-form"
                    placeholder="请选择迭代项目"
                    :disabled="!params.pid"
                    v-model="params.iter_id"
                    @change="changeiterId"
                >
                    <el-option v-for="item in iterationList" :key="item.id" :label="item.project_name" :value="item.id"></el-option>
                </el-select>
                <span class="public-title">需求:</span>
                <el-select
                    v-model="params.rid"
                    placeholder="请选择需求"
                    class="public-form"
                    @change="changeDuty"
                    :disabled="showRequiresName == true"
                >
                    <el-option v-for="item in requiresName" :key="item.ZID" :label="item.rname" :value="item.ZID"></el-option>
                </el-select>

                <!-- <span class="public-title">终端:</span>
                <el-select v-model="params.terminal" placeholder="请选择终端" class="public-form">
                    <el-option v-for="item in terminal" :key="item" :label="item" :value="item"> </el-option>
                </el-select>-->
                <br />
                <span class="public-title">用户组:</span>
                <el-select v-model="params.group" placeholder="用户组" class="public-form">
                    <el-option v-for="item in dutype" :key="item.id" :label="item.group_name" :value="item.group_name"></el-option>
                </el-select>

                <!-- <span class="public-title">人员:</span>
                <el-input v-model="params.uname" class="public-form" placeholder="请输人员名称"></el-input>-->
                <span class="public-title">起始时间:</span>
                <el-date-picker
                    v-model="params.stime"
                    class="public-form"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                ></el-date-picker
                >-
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
            <div ref="bar" class="bar"></div>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="name" label="状态" align="center"></el-table-column>
                <el-table-column prop="value" label="小计"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
// import 'https://cdn.jsdelivr.net/npm/echarts-liquidfill@2/dist/echarts-liquidfill.min.js';
import 'echarts-liquidfill';
export default {
    name: 'DefectStatistics',
    data() {
        return {
            iterKey: '',
            projectKey: '', //
            iterationList: [],
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
            value: '',
            params: {},
            // options: {
            //     toolbox: {
            //         feature: {
            //             saveAsImage: {
            //                 show: true
            //             }
            //         }
            //     },
            //     title: {
            //         text: '缺陷状态分布图',
            //         // subtext: '纯属虚构',

            //         top: '1%',

            //         left: 'center',

            //         textStyle: { color: '#909399' }
            //     },
            //     tooltip: {
            //         trigger: 'item'
            //     },
            //     legend: {
            //         orient: 'vertical',
            //         bottom: 'bottom'
            //         // left: 'left'
            //     },
            //     series: {
            //         name: '',
            //         type: 'pie',
            //         // radius: '50%',
            //         data: [],
            //         emphasis: {
            //             itemStyle: {
            //                 shadowBlur: 10,
            //                 shadowOffsetX: 0,
            //                 shadowColor: 'rgba(0, 0, 0, 0.5)'
            //             }
            //         }
            //     }
            // }
            options: {
                title: {
                    text: '缺陷状态分布图',
                    // subtext: '纯属虚构',
                    top: '45%',
                    left: 'center',
                    textStyle: {
                        color: '#9AD7FF',
                        fontSize: 16
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                // title: {
                //     top: '45%',
                //     left: 'center',
                //     text: '异常比例',
                //     textStyle: {
                //         color: '#fff',
                //         fontStyle: 'normal',
                //         fontWeight: 'normal',
                //         fontSize: 12
                //     },
                //     subtext: '70.34%',
                //     subtextStyle: {
                //         color: '#fff',
                //         fontSize: 12
                //     }
                // },
                series: [
                    // {
                    //     type: 'liquidFill',
                    //     radius: '70%',
                    //     center: ['50%', '50%'],
                    //     data: [
                    //         {
                    //             value: 0
                    //             // itemStyle: {
                    //             //     normal: {
                    //             //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    //             //             {
                    //             //                 offset: 0,
                    //             //                 color: 'rgb(35,114,255,0.8)'
                    //             //             },
                    //             //             {
                    //             //                 offset: 1,
                    //             //                 color: 'rgb(20,133,255,0)'
                    //             //             }
                    //             //         ])
                    //             //     }
                    //             // }
                    //         }
                    //     ], // data个数代表波浪数
                    //     backgroundStyle: {
                    //         borderWidth: 4,
                    //         color: 'transparent'
                    //     },
                    //     // label: {
                    //     //     normal: {
                    //     //         formatter: (0.5 * 100).toFixed(2) + '%',
                    //     //         textStyle: {
                    //     //             fontSize: 16,
                    //     //             // color: '#9AD7FF'
                    //     //             color: '#9AD7FF'
                    //     //         }
                    //     //     }
                    //     // },
                    //     outline: {
                    //         show: false
                    //     }
                    // },
                    {
                        type: 'liquidFill',
                        data: ['0.6'],
                        // itemStyle: {
                        //     normal: {
                        //         opacity: 0.4,
                        //         shadowBlur: 0,
                        //         shadowColor: '#9395BE'
                        //     }
                        // },
                        backgroundStyle: {
                            borderWidth: 4,
                            color: 'transparent'
                        },
                        center: ['50%', '50%'],
                        radius: '70%',
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#8e5139'
                                },
                                {
                                    offset: 1,
                                    color: '#94802b'
                                }
                            ],
                            globalCoord: false
                        },
                        label: {
                            normal: {
                                formatter: '',
                                textStyle: {
                                    fontSize: 16,
                                    // color: '#9AD7FF'
                                    color: '#9AD7FF'
                                }
                            }
                        },
                        outline: {
                            show: false
                        }
                    },
                    {
                        type: 'pie',
                        radius: ['68%', '82%'],
                        center: ['50%', '50%'],
                        color: {
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgb(38,162,255,0.2)'
                                },
                                {
                                    offset: 0.8,
                                    color: 'rgb(29,83,250,0.5)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgb(29,83,250,0.8)'
                                }
                            ],
                            globalCoord: false
                        },
                        labelLine: {
                            show: false
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                show: true,
                                formatter: '{title|{b}}\n{title|{c}}',
                                rich: {
                                    title: {
                                        // color: '#FFFFFF',
                                        // padding: [3, -70]
                                    }
                                }
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        labelLine: {
                            length: 10,
                            length2: 100
                        },
                        data: []
                    },
                    {
                        type: 'pie',
                        radius: ['70%', '82%'],
                        center: ['50%', '50%'],
                        color: 'rgb(255,255,255,0.2)',
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: []
                    }
                ]
            }
        };
    },
    // created() {
    //     this.initEcharts();
    // },
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
            this.requiresName = [];
            this.iterationList = [];
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
        initEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.bar);
            // let option = options;
            // myEcharts.clear();
            myEcharts.setOption(this.options);
        },
        async reportGenerate() {
            if (!this.params.pid) {
                this.$message.error('项目为必选项');
                return;
            }
            this.tableData = await this.getData();
            this.options.series[0].data = await this.getData();
            this.options.series[1].data = await this.getData();
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
                .defect_statistics(this.params)
                .then((res) => {
                    if (res.code == 0) {
                        // this.options.series.data = res.result;
                        // this.tableData = res.result;
                        if (res.result[0].group_name) {
                            data = res.result[0].data;
                        } else {
                            data = res.result;
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
            let parm = { key: e };
            if (this.projectKey != e) {
                this.projectKey = e;
                delete this.params.iter_id;
                this.requiresName = [];
                delete this.params.rid;
                this.getIterList(parm);
            }
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
        /**
         * 请求迭代列表
         * @param {Object} e 请求迭代列表参数
         */
        getIterList(e) {
            // this.requiresName = [];
            this.$api
                .get_iteration_list(e)
                .then((res) => {
                    if (res.code == 0) {
                        this.iterationList = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
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
        getRequireName(e) {
            // this.requiresName = [];
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
