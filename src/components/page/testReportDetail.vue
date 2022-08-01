<template>
    <div>
        <el-card class="box-card" style="margin-bottom:20px">
            <h4>{{ titleText }}</h4>
            <div ref="pie" class="bar"></div>
            <el-button type="primary" @click="onDetail(1)" style="margin-bottom:10px">查看详情</el-button>
            <el-table v-if="type == 1" :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="ID" label="Bugid" align="center"> </el-table-column>
                <el-table-column prop="summary" label="Bug摘要" align="center"> </el-table-column>
                <el-table-column prop="priority" label="Bug优先级" align="center">
                    <!-- <template slot-scope="scope">
                        <span>{{ priority }}</span>
                    </template> -->
                </el-table-column>
                <el-table-column prop="status" label="Bug状态" align="center"> </el-table-column>
                <el-table-column prop="reporter" label="Bug创建人" align="center"> </el-table-column>
                <el-table-column prop="assignee" label="Bug责任人" align="center"> </el-table-column>
            </el-table>
        </el-card>
        <el-card class="box-card" style="margin-bottom:20px">
            <div ref="pieTest" class="bar"></div>
            <el-button type="primary" @click="onDetail(2)" style="margin-bottom:10px">查看详情</el-button>
            <el-table v-if="type == 2" :data="caseData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="cname" label="用例名称" align="center"> </el-table-column>
                <el-table-column prop="case_statu" label="用例执行状态" align="center" :formatter="stateFormat">
                    <!-- <template slot-scope="scope" >
                        <span>{{ }}</span>
                    </template> -->
                </el-table-column>
                <el-table-column prop="assignee" label="用例责任人" align="center"> </el-table-column>
                <el-table-column prop="rname" label="需求名称" align="center"> </el-table-column>
                <!-- <el-table-column prop="assess_status" label="评审状态" align="center" :formatter="assStateFormat"> </el-table-column> -->
                <!-- <el-table-column prop="assess_time" label="评审时间" align="center"> </el-table-column> -->
                <!-- <el-table-column prop="note" label="备注" align="center"> </el-table-column> -->
            </el-table>
        </el-card>
        <el-card class="box-card">
            <div ref="bar" class="bar"></div>
            <el-table :data="barData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="owner" label="人名" align="center">
                    <!-- <template slot-scope="scope">{{ scope.row.id }}</template> -->
                </el-table-column>
                <el-table-column prop="total_bugs" label="BUG总数">
                    <!-- <template slot-scope="scope">{{ scope.row.project_name }}</template> -->
                </el-table-column>
                <el-table-column prop="avg_close_time" label="BUG平均关闭时间/小时">
                    <!-- <template slot-scope="scope">{{ scope.row.project_desc }}</template> -->
                </el-table-column>
            </el-table>
        </el-card>
        <el-card class="box-card" style="margin-top:20px">
            <el-form ref="form" label-width="80px">
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="remarks"></el-input>
                </el-form-item>
                <el-form-item label="风险分析">
                    <el-input type="textarea" v-model="analysis"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="savedetail" :disabled="isCheck == 'true'">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            barData: [],
            caseData: [],
            remarks: '',
            analysis: '',
            titleText: '',
            caseStatus: [
                { statu: 0, name: '未执行' },
                { statu: 1, name: '执行中' },
                { statu: 2, name: '失败' },
                { statu: 3, name: '线下通过' },
                { statu: 4, name: '线上通过' },
                { statu: 5, name: '只线上通过' },
                { statu: 6, name: '挂起或delay' }
            ],
            rname: '',
            pass: -1,
            type: 0,
            barOptions: {
                title: {
                    // text: '缺陷年龄统计',
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
                    name: 'BUG平均关闭时间/小时',
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
            },
            weioption: {
                tooltip: {
                    trigger: 'item'
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: {
                    data: [],
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }
            },
            weipieOptions: {
                tooltip: {
                    trigger: 'item'
                },
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [120, 200, 150, 80, 70, 110, 130],
                        type: 'bar',
                        color: '#fa8459',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        }
                    }
                ]
            },
            options: {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '1%',
                    left: 'center'
                },
                series: [
                    {
                        name: '测试状态',
                        type: 'pie',
                        radius: ['50%', '80%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: []
                    }
                ]
            },
            pieOptions: {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '1%',
                    left: 'center'
                },
                series: [
                    {
                        name: '测试状态',
                        type: 'pie',
                        radius: ['50%', '80%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
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
    created() {
        this.rname = this.$route.query.rname;
        this.pass = this.$route.query.pass;
    },
    mounted() {
        this.getBugStats();
        this.getTitle();
        this.getbugdetail();
        this.getRequireCasestate();
        this.getrequirecasedetail();
        this.reverse_display_require_data();
        this.getDefectAgeStatistics();
        if (this.$route.query.isCheck) {
            this.isCheck = this.$route.query.isCheck;
        }
    },
    watch: {
        $route(to, from) {
            this.$router.go(0);
        }
    },
    filters: {
        getCaseStatuType(type) {
            const map = new Map([
                [0, '未执行'],
                [1, '执行中'],
                [2, '失败'],
                [3, '线下通过'],
                [4, '线上通过'],
                [5, '只线上通过'],
                [6, '挂起或delay']
            ]);
            return map.get(type);
        }
    },
    methods: {
        savedetail() {
            let params = {};
            params.rid = this.$route.query.rid;
            params.pid = this.$route.query.pid;
            params.remarks = this.remarks;
            params.analysis = this.analysis;
            this.$api.apiChart.get_save_require_data(params).then(res => {
                console.log('res保存', res);
                if (res.code == 0) {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                }
            });
        },
        stateFormat(row, column) {
            if (row.case_statu == 0) {
                return '未执行';
            } else if (row.case_statu == 1) {
                return '执行中';
            } else if (row.case_statu == 2) {
                return '失败';
            } else if (row.case_statu == 3) {
                return '线下通过';
            } else if (row.case_statu == 4) {
                return '线上通过';
            } else if (row.case_statu == 5) {
                return '只线上通过';
            } else if (row.case_statu == 6) {
                return '挂起或delay';
            }
        },
        assStateFormat(row, column) {
            if (row.assess_status == 0) {
                return '未评审';
            } else if (row.assess_status == 1) {
                return '评审通过';
            } else if (row.assess_status == 2) {
                return '评审失败待修改';
            }
        },
        initEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.pie);
            // let option = options;
            // myEcharts.clear();
            if (this.$route.query.pass == 1) {
                console.log('option:', this.option);
                myEcharts.setOption(this.options);
            } else {
                myEcharts.setOption(this.weioption);
            }

            // this.dialogVisible = false;
        },
        initPieEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.pieTest);
            // let option = options;
            // myEcharts.clear();
            if (this.$route.query.pass == 1) {
                myEcharts.setOption(this.pieOptions);
            } else {
                console.log('???', this.weipieOptions.series[0].data[3]);
                let data1 = [...this.weipieOptions.series[0].data];
                this.weipieOptions.series[0].data[3] = {
                    value: data1[3],
                    itemStyle: {
                        color: '#93cb79'
                    }
                };
                console.log('weipieOptions:', this.weipieOptions);
                myEcharts.setOption(this.weipieOptions);
            }
            // this.dialogVisible = false;
        },
        barInitEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.bar);

            myEcharts.setOption(this.barOptions);
        },
        onDetail(type) {
            this.type = type;
        },
        getBugStats() {
            let xyarrx = [];
            let seriesData = [];
            this.$api.apiChart.get_require_bugstate({ rname: this.rname }).then(res => {
                if (res.code == 0) {
                    if (this.$route.query.pass == 0) {
                        for (let key in res.result) {
                            xyarrx.push(key);
                            seriesData.push(res.result[key]);
                        }
                        this.weioption.xAxis.data = xyarrx;
                        this.weioption.series.data = seriesData;
                        console.log('xyarrx', this.weioption.xAxis.data, 'seriesData', this.weioption.series.data);
                    } else {
                        for (let key in res.result) {
                            this.options.series[0].data.push({
                                value: res.result[key],
                                name: key
                            });
                            xyarrx.push(key);
                            seriesData.push(res.result[key]);
                        }
                    }
                    this.initEcharts();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getbugdetail() {
            this.$api.apiChart.get_require_bugdetail({ rname: this.rname }).then(res => {
                if (res.code == 0) {
                    this.tableData = res.result;
                    console.log('res', res);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getrequirecasedetail() {
            this.$api.apiChart.get_require_casedetail({ rname: this.rname }).then(res => {
                if (res.code == 0) {
                    this.caseData = res.result;
                    console.log('res!!!', res);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        reverse_display_require_data() {
            this.$api.apiChart.reverse_display_require_data({ rname: this.rname }).then(res => {
                if (res.code == 0) {
                    console.log('res!!!', res);
                    if (res.result[0]) {
                        this.remarks = res.result[0].remarks;
                        this.analysis = res.result[0].analysis;
                    }
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getRequireCasestate() {
            var xyarrx = [];
            var seriesData = [];
            this.$api.apiChart.get_require_casestate({ rname: this.rname }).then(res => {
                if (res.code == 0) {
                    console.log('22222222', res);
                    if (this.$route.query.pass == 0) {
                        for (let key in res.result) {
                            xyarrx.push(key);
                            seriesData.push(res.result[key]);
                        }
                        console.log('xyarrx', xyarrx, 'seriesData', seriesData);
                        this.weipieOptions.xAxis.data = xyarrx;
                        this.weipieOptions.series[0].data = seriesData;
                    } else {
                        for (let key in res.result) {
                            this.pieOptions.series[0].data.push({
                                value: res.result[key],
                                name: key
                            });
                            xyarrx.push(key);
                            seriesData.push(res.result[key]);
                        }
                    }
                    this.initPieEcharts();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        getDefectAgeStatistics() {
            let params = {};
            params.rid = this.$route.query.rid;
            params.iter_id = this.$route.query.iter_id;
            params.pid = this.$route.query.pid;
            let data = [];
            let arr = [];
            let seriesData = [];
            this.$tesReport
                .resolve_time(params)
                .then(res => {
                    if (res.code == 0) {
                        // this.options.series.data = res.result;
                        // this.tableData = res.result;
                        data = res.result;
                        this.barData = data;
                        console.log('this.barData', this.barData);
                        data.map(item => {
                            arr.push(item.owner);
                            seriesData.push(item.avg_close_time);
                        });
                        this.barOptions.yAxis.data = arr;
                        this.barOptions.series.data = seriesData;
                        this.barInitEcharts();

                        // this.pageTotal = res.count;
                        // this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        getTitle() {
            if (this.$route.query.pass == 1) {
                this.titleText = '已通过需求';
            } else {
                this.titleText = '未通过需求';
            }
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
    margin-bottom: 30px;
}
</style>
