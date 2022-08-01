<template>
    <div>
        <el-card style="margin-bottom: 20px">
            <div class="handle-box">
                <span class="public-title">项目:</span>
                <el-select
                    multiple
                    collapse-tags
                    clearable
                    filterable
                    v-model="chooseData"
                    placeholder="请选择项目"
                    class="public-form"
                    @change="selectAll"
                >
                    <el-option v-for="item in projectsName" :key="item.pid" :label="item.pname" :value="item.pname"></el-option>
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
                <el-button type="primary" @click="outputData">导出</el-button>
            </div>
        </el-card>

        <el-card class="box-card">
            <div ref="bar" v-loading="loading" class="bar"></div>
            <el-table v-loading="loading" :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="project" label="" fixed align="center"></el-table-column>
                <el-table-column
                    v-for="(item, i) in options.xAxis[0].data"
                    :key="i"
                    :prop="item"
                    :label="item"
                    align="center"
                ></el-table-column>
            </el-table>
        </el-card>
        <!-- <el-card class="box-card" v-if="tableData1.length != 0">
            <el-table :data="tableData1" style="width: 100%" class="table">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table :data="scope.row.info" style="width: 100%">
                            <el-table-column label="" prop="group_member_name" align="center"></el-table-column>
                            <el-table-column label="BUG总数" prop="issue_avg_seloved_time" align="center"></el-table-column>
                            <el-table-column label="BUG平均解决时间/小时" prop="member_count" align="center"></el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column label="组名" prop="group_name" align="center"></el-table-column>
                <el-table-column label="BUG总数" prop="bugs" align="center"></el-table-column>
            </el-table>
        </el-card> -->
        <!-- <el-card class="box-card">
            <div ref="bug" v-loading="loading" class="bug"></div>
            <el-table v-loading="loading" :data="bugInfoList" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="group_member_name" label="" fixed align="center"></el-table-column>
                <el-table-column prop="member_count" label="BUG总数" fixed align="center"></el-table-column>
                <el-table-column prop="issue_avg_seloved_time" label="BUG平均解决时间/小时" fixed align="center"></el-table-column>
            </el-table>
        </el-card> -->
        <el-card class="box-card">
            <div ref="sum" v-loading="loading" class="sum"></div>
            <el-table v-loading="loading" :data="suntableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="name" label="" fixed align="center"></el-table-column>
                <el-table-column prop="seloved_bugs_count" label="BUG总数" fixed align="center"></el-table-column>
                <el-table-column prop="avg_bug_resolved" label="BUG平均解决时间/小时" fixed align="center"></el-table-column>
            </el-table>
        </el-card>
        <el-card class="box-card" v-for="(project, u) in projectOptions" :key="u">
            <!-- <el-button type="primary" @click="test(u)">{{ project.options.title.text }}</el-button> -->
            <!-- <span style="line-height: 36px; font-size: 17px; color: #666"> {{ project.options.title.text }} </span>
            <i
                style="float: right; color: #20a0ff; line-height: 36px; cursor: pointer"
                class="el-icon-caret-bottom"
                v-on:click="test(u)"
            ></i> -->
            <!-- <div> -->
            <div :ref="'bug' + u" v-loading="loading" class="bug"></div>
            <el-table v-loading="loading" :data="project.tableData" border size="mini" class="table" :ref="'multipleTable' + u">
                <el-table-column prop="group_member_name" label="" fixed align="center"></el-table-column>
                <el-table-column prop="member_count" label="BUG总数" fixed align="center"></el-table-column>
                <el-table-column prop="issue_avg_seloved_time" label="BUG平均解决时间/小时" fixed align="center"></el-table-column>
            </el-table>
            <!-- </div> -->
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'BugDistribution',
    data() {
        return {
            value: true,
            // show: true,
            projectsName: [],
            tableData: [], // 列表数据
            // tableData1: [], // 列表数据
            params: { pname_list: [] },
            loading: false, // 加载
            options: {
                title: {
                    text: '研发组bug分布图'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: []
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        // prettier-ignore
                        data: [ ],

                        axisLabel: {
                            show: true,
                            interval: 0,
                            rotate: 45
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: []
            },
            // bugInfoList: [],
            // bugOptions: {
            //     title: {
            //         text: '',
            //         textStyle: { color: '#909399' }
            //     },
            //     tooltip: {
            //         trigger: 'axis'
            //     },
            //     legend: {
            //         data: []
            //     },
            //     toolbox: {
            //         show: true,
            //         feature: {
            //             dataView: { show: true, readOnly: false },
            //             magicType: { show: true, type: ['line', 'bar'] },
            //             restore: { show: true },
            //             saveAsImage: { show: true }
            //         }
            //     },
            //     calculable: true,
            //     xAxis: [
            //         {
            //             type: 'value'
            //         }
            //     ],
            //     yAxis: [
            //         {
            //             type: 'category',
            //             data: []
            //         }
            //     ],
            //     series: [],
            //     legend: [{}]
            // },
            projectOptions: [],
            sumOptions: [],
            suntableData: [],

            oldChooseData: [], // 旧的选择数据
            chooseData: [] // 新的选择数据
        };
    },
    created() {
        this.getProjectName();
    },
    mounted() {},
    destroyed() {
        // 销毁enter事件
        // document.removeEventListen`er('keyup', this.enterKey);
    },
    methods: {
        // 导出
        outputData() {
            this.$api.apiChart
                .output_data()
                .then((res) => {
                    if (res.code == 0) {
                        window.location.href = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // test(u) {
        //     if (this.show == 0) {
        //         this.show = 1;
        //     }
        //     if (this.show == 1) {
        //         this.show = 0;
        //     }
        //     console.log('show' + u);
        // },
        // 重置
        onReset() {
            this.params = { pname_list: [] };
            this.chooseData = [];
            this.tableData = [];
            this.options.series = [];
        },
        // 初始化Echarts
        initEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.bar);
            // let option = options;
            // myEcharts.clear();
            myEcharts.setOption(this.options);
            this.loading = false;
            setTimeout(function () {
                window.onresize = function () {
                    myEcharts.resize();
                };
            }, 200);
        },
        suminitEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.sum);
            // let option = options;
            // myEcharts.clear();
            myEcharts.setOption(this.sumOptions);
            this.loading = false;
        },
        buginitEcharts() {
            setTimeout(() => {
                this.projectOptions.forEach((item, i) => {
                    let bug = 'bug' + i;
                    console.log(this.$refs[bug][0], bug);
                    this.loading = false;
                    let myEcharts = this.$echarts.init(this.$refs[bug][0]);
                    myEcharts.setOption(item.options);
                    // console.log('🚀 ~ item', item);
                });
            }, 1000);
        },
        // 查询条件验证
        async reportGenerate() {
            if (this.chooseData.includes('全选')) {
                this.chooseData.splice(0, 1);
                this.params.pname_list = this.chooseData;
            } else {
                this.params.pname_list = this.chooseData;
            }
            if (this.params.pname_list.length == 0) {
                this.$message.error('项目为必选项');
                return;
            }
            if (!this.params.stime) {
                this.$message.error('开始时间为必选项');
                return;
            }
            if (!this.params.etime) {
                this.$message.error('结束时间为必选项');
                return;
            }
            let stime = new Date(this.params.stime).getTime();
            let etime = new Date(this.params.etime).getTime();
            if (stime > etime) {
                this.$message.error('结束时间不得早于结束时间');
                return;
            }
            console.log(this.tableData, this.options);
            this.getData();
        },
        // 获取报表数据
        getData() {
            let params = {
                etime: this.params.etime,
                stime: this.params.stime,
                pname_list: JSON.stringify(this.params.pname_list)
            };
            this.loading = true;
            this.projectOptions = [];
            this.$api.apiChart
                .get_project_per_group_bugs(params)
                .then((res) => {
                    if (res.code == 0) {
                        // 研发组BUG分布图
                        this.options.legend.data = this.params.pname_list;
                        this.options.xAxis[0].data = res.group_name_list;
                        this.options.series = [];
                        this.tableData = [];
                        // this.tableData1 = [];
                        res.result.forEach((item, index) => {
                            let flag = false;
                            let obj = {};
                            for (const key in item) {
                                let arr = [];
                                obj.project = key;
                                item[key].forEach((ele, u) => {
                                    for (const k in ele) {
                                        arr.push(ele[k]);
                                        obj[k] = ele[k];
                                        // let list = {};
                                        // list.group_name = k;
                                        // list.bugs = obj[k];
                                        // this.tableData1.push(list);
                                        // console.log('🚀 ~ this.tableData1', this.tableData1);
                                    }
                                    flag = u == item[key].length - 1;
                                });
                                this.options.series.push({
                                    name: key,
                                    type: 'bar',
                                    data: arr,
                                    markPoint: {
                                        data: [
                                            { type: 'max', name: 'Max' },
                                            { type: 'min', name: 'Min' }
                                        ]
                                    },
                                    markLine: {
                                        data: [{ type: 'average', name: 'Avg' }]
                                    },
                                    barMaxWidth: 50 // 设置柱状图最大宽度
                                });
                                if (index == res.result.length - 1 && flag) {
                                    this.initEcharts();
                                    // console.log(this.tableData);
                                }
                            }
                            this.tableData.push(obj);
                            // this.tableData1.push(obj);
                        });

                        // 所有项目所有组的每人BUG平均解决时间
                        let names = [];
                        let seriesData = [];
                        this.suntableData = res.member_all_bugs;
                        res.member_all_bugs.forEach((item) => {
                            names.push(item.name);
                            seriesData.push(item.avg_bug_resolved);
                            this.sumOptions = {
                                title: {
                                    text: '每个人的BUG平均解决时间',
                                    textStyle: { color: '#909399' }
                                },
                                tooltip: {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data: []
                                },
                                toolbox: {
                                    show: true,
                                    feature: {
                                        dataView: { show: true, readOnly: false },
                                        magicType: { show: true, type: ['line', 'bar'] },
                                        restore: { show: true },
                                        saveAsImage: { show: true }
                                    }
                                },
                                calculable: true,
                                xAxis: [
                                    {
                                        type: 'value'
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'category',
                                        data: names
                                    }
                                ],
                                legend: [{}],
                                series: [
                                    {
                                        name: 'BUG平均解决时间/小时',
                                        type: 'bar',
                                        data: seriesData,
                                        markPoint: {
                                            data: [
                                                { type: 'max', name: 'Max' },
                                                { type: 'min', name: 'Min' }
                                            ]
                                        },
                                        markLine: {
                                            data: [{ type: 'average', name: 'Avg' }]
                                        },
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
                                        }
                                    }
                                ]
                            };
                        });
                        this.suminitEcharts();

                        // 每个项目每个组的每人BUG平均解决时间
                        res.member_resloved_time.forEach((item) => {
                            // console.log('🚀 ~ item', item);
                            // this.tableData1.forEach((it) => {
                            //     console.log('🚀 ~ it', it);
                            //     // console.log('🚀 ~ index', index);
                            //     // console.log('🚀 ~ item', item);
                            //     // // it.push(item.group_member_avg_seloved_count);
                            //     // console.log('🚀 ~ item.group_name == it.group_name', item.group_name == it.group_name);
                            //     // console.log('🚀 ~ it.group_name', it.group_name);
                            //     // console.log('🚀 ~ item.group_name', item.group_name);
                            //     if (item.group_name == it.group_name) {
                            //         it.info = item.group_member_avg_seloved;
                            //     }
                            // });
                            // console.log('🚀 ~ item', item);
                            // console.log('🚀 ~ this.tableData1.group_name', this.tableData1.group_name);
                            // console.log('🚀 ~ item.group_name', item.group_name);

                            let options = JSON.parse(JSON.stringify(this.options));
                            // options.title.text = item.group_name;
                            let seriesData = [];
                            let names = [];
                            let tableData = item.group_member_avg_seloved;
                            // console.log('🚀 ~ tableData', tableData);
                            item.group_member_avg_seloved.forEach((ele) => {
                                names.push(ele.group_member_name);
                                // console.log('🚀 ~ names', names);
                                seriesData.push(ele.issue_avg_seloved_time);
                                // console.log('🚀 ~ seriesData', seriesData);
                            });
                            // console.log('🚀 ~ this.tableData1', this.tableData1);
                            // console.log('🚀 ~ this.tableData1', this.tableData1.info);
                            options = {
                                title: {
                                    text: item.project_name + '-' + item.group_name,
                                    textStyle: { color: '#909399' }
                                },
                                tooltip: {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data: []
                                },
                                toolbox: {
                                    show: true,
                                    feature: {
                                        dataView: { show: true, readOnly: false },
                                        magicType: { show: true, type: ['line', 'bar'] },
                                        restore: { show: true },
                                        saveAsImage: { show: true }
                                    }
                                },
                                calculable: true,
                                xAxis: [
                                    {
                                        type: 'value'
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'category',
                                        data: names
                                    }
                                ],
                                legend: [{}],
                                series: [
                                    {
                                        name: 'BUG平均解决时间/小时',
                                        type: 'bar',
                                        data: seriesData,
                                        markPoint: {
                                            data: [
                                                { type: 'max', name: 'Max' },
                                                { type: 'min', name: 'Min' }
                                            ]
                                        },
                                        markLine: {
                                            data: [{ type: 'average', name: 'Avg' }]
                                        },
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
                                        }
                                    }
                                ]
                            };
                            // options.series = {
                            //     name: 'BUG平均解决时间/小时',
                            //     type: 'bar',
                            //     data: seriesData,
                            //     markPoint: {
                            //         data: [
                            //             { type: 'max', name: 'Max' },
                            //             { type: 'min', name: 'Min' }
                            //         ]
                            //     },
                            //     markLine: {
                            //         data: [{ type: 'average', name: 'Avg' }]
                            //     },
                            //     barWidth: 10,
                            //     zlevel: 1,
                            //     itemStyle: {
                            //         barBorderRadius: [0, 6, 6, 0],
                            //         color: {
                            //             type: 'linear',
                            //             x: 0,
                            //             y: 0,
                            //             x2: 1,
                            //             y2: 1,
                            //             colorStops: [
                            //                 {
                            //                     offset: 0,
                            //                     color: '#3D9FFF' // 0% 处的颜色
                            //                 },
                            //                 {
                            //                     offset: 1,
                            //                     color: '#41D7F3' // 100% 处的颜色
                            //                 }
                            //             ],
                            //             global: false // 缺省为 false
                            //         }
                            //     }
                            // this.bugOptions.title.text = item.group_name;
                            // this.bugInfoList = item.group_member_avg_seloved_count;
                            // let seriesData = [];
                            // item.group_member_avg_seloved_count.forEach((item, i) => {
                            //     let nameList = new Array();
                            //     nameList[i] = item.group_member_name;
                            //     this.bugOptions.yAxis[0].data = nameList;
                            //     seriesData.push(item.issue_avg_seloved_time);
                            // });
                            // this.bugOptions.series.push({
                            //     name: 'BUG平均解决时间/小时',
                            //     type: 'bar',
                            //     data: seriesData,
                            //     markPoint: {
                            //         data: [
                            //             { type: 'max', name: 'Max' },
                            //             { type: 'min', name: 'Min' }
                            //         ]
                            //     },
                            //     markLine: {
                            //         data: [{ type: 'average', name: 'Avg' }]
                            //     },
                            //     barWidth: 10,
                            //     zlevel: 1,
                            //     itemStyle: {
                            //         barBorderRadius: [0, 6, 6, 0],
                            //         color: {
                            //             type: 'linear',
                            //             x: 0,
                            //             y: 0,
                            //             x2: 1,
                            //             y2: 1,
                            //             colorStops: [
                            //                 {
                            //                     offset: 0,
                            //                     color: '#3D9FFF' // 0% 处的颜色
                            //                 },
                            //                 {
                            //                     offset: 1,
                            //                     color: '#41D7F3' // 100% 处的颜色
                            //                 }
                            //             ],
                            //             global: false // 缺省为 false
                            //         }
                            //     }
                            // });
                            // this.buginitEcharts();
                            // };
                            this.projectOptions.push({
                                options,
                                tableData
                            });
                        });
                        this.buginitEcharts();
                    } else {
                        this.$message.error(res.msg);
                        this.loading = false;
                    }
                })
                .catch((error) => {
                    this.$message.error(error);
                    this.loading = false;
                });
            // this.tableData = data;
            // this.options.series[0].data = data;
            // this.options.series[1].data = data;
        },
        // 获取项目列表
        getProjectName() {
            // 获取项目名称
            this.$api.apiChart
                .projectName({})
                .then((res) => {
                    if (res.code == 0) {
                        this.projectsName = res.project_name;
                        this.projectsName.splice(0, 0, { pname: '全选', pid: '全选' });
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err);
                });
        },
        selectAll(val) {
            const allValues = this.projectsName.map((item) => {
                return item.pname;
            });
            // 用来储存上一次选择的值，可进行对比
            const oldVal = this.oldChooseData.length > 0 ? this.oldChooseData : [];

            // 若选择全部
            if (val.includes('全选')) {
                this.chooseData = allValues;
            }

            // 取消全部选中， 上次有， 当前没有， 表示取消全选
            if (oldVal.includes('全选') && !val.includes('全选')) {
                this.chooseData = [];
            }

            // 点击非全部选中，需要排除全部选中 以及 当前点击的选项
            // 新老数据都有全部选中
            if (oldVal.includes('全选') && val.includes('全选')) {
                const index = val.indexOf('全选');
                val.splice(index, 1); // 排除全选选项
                this.chooseData = val;
            }

            // 全选未选，但是其他选项都全部选上了，则全选选上
            if (!oldVal.includes('全选') && !val.includes('全选')) {
                if (val.length === allValues.length - 1) {
                    this.chooseData = ['全选'].concat(val);
                }
            }

            // 储存当前选择的最后结果 作为下次的老数据
            this.oldChooseData = this.chooseData;
        }
    }
};
</script>
<style scoped lang="less">
.bar {
    width: 100%;
    height: 400px;
    margin: auto;
    margin-top: 30px;
}
.bug {
    width: 100%;
    height: 400px;
    margin: auto;
    margin-top: 30px;
}
.sum {
    width: 100%;
    height: 2000px;
    margin: auto;
    margin-top: 30px;
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
    margin-top: 10px;
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
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>
