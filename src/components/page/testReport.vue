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
                    :disabled="isCheck == true"
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
                    @change="changeRequire"
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
                    :disabled="!params.iter_id"
                    style="width:350px"
                    multiple
                    collapse-tags
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

                <el-button type="primary" @click="reportGenerate" :disabled="isCheck == true">生成报表</el-button>
                <el-button type="primary" @click="onReset" :disabled="isCheck == true">重置</el-button>
            </div>
        </el-card>
        <el-card class="box-card">
            <div class="item-time">
                <span>
                    项目负责人：
                    <div :key="index" v-for="(item, index) in usernames">
                        <span>{{ item }}</span>
                        <span v-if="usernames.length > 1">,</span>
                    </div>
                </span>
                <span style="float:right;margin-right:150px">生成日期：{{ date }}</span>
            </div>
            <div class="table-title">
                <h4 style="color:#909399;line-height:40px;text-align:center;">测试结果</h4>
            </div>
            <!-- <template v-if="showRequiresName"> -->
            <div ref="pie" class="bar"></div>
            <!-- </template> -->
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="ZID" label="需求id" align="center"></el-table-column>
                <el-table-column prop="rname" label="需求名称" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template slot-scope="scope">
                        <span
                            v-if="
                                Number(scope.row.status) == Number(5) ||
                                    Number(scope.row.status) == Number(6) ||
                                    Number(scope.row.status) == Number(7)
                            "
                        >测试已通过</span>
                        <span v-else>测试未通过</span>
                    </template>
                </el-table-column>
                <el-table-column label="需求负责人">
                    <!-- prop="username" -->
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.username" :key="index">{{ item }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="110" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="onEditDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-card class="box-card" style="margin-top:20px">
            <el-form ref="form" label-width="80px">
                <el-form-item>
                    <h4>{{ this.nowUrl }}</h4>
                </el-form-item>
                <el-form-item label="测试结论">
                    <el-input type="textarea" v-model="desc"></el-input>
                </el-form-item>
                <el-form-item class="report">
                    <el-button type="primary" @click="saveReport" :disabled="isCheck == true">生成报告</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import 'echarts-liquidfill';
export default {
    name: 'testreport',
    data() {
        return {
            dialogVisible: false,
            isCheck: false,
            ridsArray: [],
            scrollerWidth: '100%',
            scrollerHeight: '400px',
            title: '创建项目',
            desc: '',
            nowUrl: '',
            urlId: '',
            date: '',
            usernames: [],
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
            iterationList: [],
            terminal: ['IOS', 'Android', 'PC'],
            dutype: [
                { value: '1', label: 'reporter' },
                { value: '2', label: 'assignee' }
            ],
            status: '',
            params: {},
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
                tooltip: {
                    formatter: function(params) {
                        return params.name + '：' + params.percent + ' %';
                    }
                },
                angleAxis: {
                    max: 100,
                    clockwise: false,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                radiusAxis: {
                    type: 'category',
                    show: true,
                    axisLabel: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [
                    {
                        name: 'circleFill',
                        type: 'liquidFill',
                        radius: '70%',
                        z: 1,
                        center: ['50%', '50%'],
                        amplitude: 20,
                        itemStyle: {
                            normal: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 1,
                                            color: '#28E8FA'
                                        },
                                        {
                                            offset: 0,
                                            color: '#4FADFD'
                                        }
                                        // {
                                        //     offset: 0,
                                        //     color: 'rgba(31, 222, 225, 1)'
                                        // }
                                    ],
                                    globalCoord: false
                                }
                            }
                        },
                        data: [],
                        backgroundStyle: {
                            borderWidth: 1,
                            color: 'transparent'
                        },
                        label: {
                            normal: {
                                formatter: ''
                            }
                        },
                        outline: {
                            show: true,
                            itemStyle: {
                                borderWidth: 0
                            },
                            borderDistance: 0
                        }
                    },
                    {
                        name: 'circle',
                        type: 'pie',
                        clockWise: true,
                        radius: ['70%', '75%'],
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
                        // label: {
                        //     normal: {
                        //         show: true,
                        //         formatter: '{title|{b}}\n{title|{c}}',
                        //         rich: {
                        //             title: {
                        //                 // color: '#FFFFFF',
                        //                 // padding: [3, -70]
                        //             }
                        //         }
                        //     },
                        //     emphasis: {
                        //         show: true
                        //     }
                        // },
                        data: [
                            {
                                value: '0',
                                name: '',
                                itemStyle: {
                                    normal: {
                                        color: {
                                            // 颜色渐变
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 1,
                                            y2: 1,
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
                                value: '0',
                                itemStyle: {
                                    normal: {
                                        color: '#E1E8EE'
                                    }
                                }
                            }
                        ]
                    }
                ]
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
                tooltip: {
                    formatter: function(params) {
                        return params.name + '：' + params.percent + ' %';
                    }
                },
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
            }
        };
    },
    mounted() {
        if (this.$route.query.rid) {
            this.params.rid = this.$route.query.rid;
            console.log('this.params.rid:', this.params.rid);
        }
        console.log('urlId', window.location.href);
        // 绑定enter事件
        // document.addEventListener('keyup', this.enterKey);
        // this.getData();
        this.getProjectName();
        // this.groupName();
        this.getId();

        // this.enterKey();，，，，，，，
    },
    methods: {
        getParamer(paramer) {
            var url = window.location.href.split('?')[1]; /*获取url里"?"后面的值*/
            if (url == undefined) {
                return false;
            }
            if (url.indexOf('&') > 0) {
                /*判断是否是一个参数还是多个参数*/
                var urlParamArry = url.split('&'); /*分开每个参数，并放到数组里*/
                for (var i = 0; i < urlParamArry.length; i++) {
                    var paramerName = urlParamArry[i].split('='); /*把每个参数名和值分开，并放到数组里*/
                    if (paramer == paramerName[0]) {
                        /*匹配输入的参数和数组循环出来的参数是否一样*/
                        return paramerName[1]; /*返回想要的参数值*/
                    }
                }
            } else {
                /*判断只有个参数*/
                var paramerValue = url.split('=')[1];
                return paramerValue;
            }
        },
        selectProject(name) {
            // let key;
            // for (let i = 0; i < this.projectList.length; i++) {
            //     const ele = this.projectList[i];
            //     if (ele.pname == name) {
            //         key = ele.pid;
            //         // break;
            //     }
            // }
            this.$api
                .get_iter_name(name)
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
        getId() {
            // this.str.indexOf("S")
            // this.urlId = window.location.href;

            // var index = this.urlId.lastIndexOf('?id=');
            // var res = this.urlId.substring(index + 1, this.urlId.length);
            // // console.log('id', );测试
            console.log('aaaaa');
            let id = this.getParamer('id');
            if (!id) {
                return;
            }
            console.log('id', id);
            this.$api.apiChart.get_save_data({ id: id }).then(res => {
                console.log('res', res);
                var data2 = res.result;
                this.desc = data2[0].result;
                data2.splice(0, 1);
                this.tableData = data2;
                // this.options.series.data = data;
                let count = 0;
                let count2 = 0;
                data2.map((item, index) => {
                    console.log('item???', item);
                    this.ridsArray.push(item.ZID);
                    if (item.status == 6 || item.status == 5 || item.status == 7) {
                        count++;
                    } else {
                        count2++;
                    }
                });
                console.log('count', count, count2);
                this.options.series.data[0].value = count;
                this.options.series.data[1].value = count2;
                this.options.series.data[0].name = '测试已通过';
                this.options.series.data[1].name = '测试未通过';
                this.options.series.data[0].itemStyle = {
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
                this.options.series[1].data[1].itemStyle = {
                    normal: {
                        color: '#E1E8EE'
                    }
                };
                this.scrollerWidth = '100%';
                this.scrollerHeight = '400px';
                this.initEcharts();
                let parm = { pid: this.params.pid };
                this.params.rid = this.$route.query.rid.split(',');
                if (this.$route.query.date) {
                    this.date = this.$route.query.date;
                }
                // this.getRequireName(parm);
                this.reportGenerate();
                this.getInforName();
            });
        },
        saveReport() {
            this.$api.apiChart.check_require_analysis({ rids: '[' + this.ridsArray.join(',') + ']' }).then(res => {
                if (res.code == 0) {
                    this.$api.apiChart.get_save_result_data({ result: this.desc }).then(res => {
                        if (res.code == 0) {
                            //  nowUrl
                            this.date = res.result.create_time;
                            this.nowUrl =
                                window.location.href +
                                '?id=' +
                                res.result.id +
                                '&date=' +
                                this.date +
                                '&pid=' +
                                this.params.pid +
                                '&iter_id=' +
                                this.params.iter_id +
                                '&rid=' +
                                this.params.rid.join(',');
                            console.log('nowUrl', nowUrl);
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        onEditDetail(row) {
            // this.$router.push()
            let pass = -1;
            if (row.status == 5 || row.status == 6 || row.status == 7) {
                pass = 1;
            } else {
                pass = 0;
            }
            let query = {
                rname: row.rname,
                pass: pass,
                pid: this.params.pid,
                iter_id: this.params.iter_id,
                rid: row.ZID,
                isCheck: this.isCheck
            };
            this.$router.push({
                path: '/testReportDetail',
                query
            });
        },
        onReset() {
            this.params = { rid: [] };
            this.tableData = [];
            this.options.series = {
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
            };
            this.initEcharts();
            this.reportGenerate();
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
            let data = this.options.series[1].data;
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
                            color: {
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(255, 191, 0)' // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(224, 62, 76)' // 100% 处的颜色1
                                    }
                                ]
                            }
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
            let myEcharts = this.$echarts.init(this.$refs.pie);
            // let option = options;
            // myEcharts.clear();
            console.log('options:', this.options);
            myEcharts.setOption(this.options);
            // this.dialogVisible = false;
        },
        initPieEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.pie);
            // let option = options;
            // myEcharts.clear();
            myEcharts.setOption(this.pieOptions);
            // this.dialogVisible = false;
        },
        getProjectLeader() {
            this.$api.apiChart.get_project_leader();
        },
        async reportGenerate() {
            let data = await this.getData();
            this.tableData = data;
            console.log('this.tableData', data);
            // this.options.series.data = data;
            let count = 0;
            let count2 = 0;
            data.map((item, index) => {
                console.log('item', item);
                this.ridsArray.push(item.ZID);
                if (item.status == 5 || item.status == 6 || item.status == 7) {
                    count++;
                } else {
                    count2++;
                }
            });
            console.log('count', count, 'count2', count2);

            this.options.series[0].data[0] = count;
            this.options.series[0].data[1] = count2;
            this.options.series[1].data[0].value = count;
            this.options.series[1].data[1].value = count2;
            this.options.series[1].data[0].name = '测试已通过';
            this.options.series[1].data[1].name = '测试未通过';
            console.log('this.options.series[0].data', this.options.series[0].data);
            this.options.series[1].data[0].itemStyle = {
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
            if (count != 0) {
                this.options.series[0].itemStyle = {
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
            } else if (count2 != 0) {
                this.options.series[0].itemStyle = {
                    normal: {
                        color: {
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(255, 191, 0)' // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(224, 62, 76)' // 100% 处的颜色1
                                }
                            ]
                        }
                    }
                };
            }

            this.options.series[1].data[1].itemStyle = {
                normal: {
                    color: {
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(255, 191, 0)' // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(224, 62, 76)' // 100% 处的颜色1
                            }
                        ]
                    }
                }
            };
            this.scrollerWidth = '100%';
            this.scrollerHeight = '400px';
            this.initEcharts();
            this.getInforName();
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
            // this.params
            let data = [];
            var rid = typeof this.params.rid == 'string' ? this.params.rid : this.params.rid.join(',');
            var params = {
                pid: this.params.pid,
                iter_id: this.params.iter_id,
                rid: '[' + rid + ']'
            };
            await this.$api.apiChart
                .get_require_listinfo(params)
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
        getInforName() {
            this.$api.apiChart.get_project_leader({ pid: this.params.pid }).then(res => {
                // console.log('res', res);
                if (res.code == 0) {
                    this.usernames = res.result.username;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        changeRequirepid(e) {
            let parm = { pid: e };
            console.log('e', e);
            // this.getRequireName(parm);
            // this.params.rid = [];
            this.selectProject(parm);
        },
        changeRequire(e) {
            // console.log(this.params.rid, e);
            let parm = { iter_id: e };
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
                .projectName2({})
                .then(res => {
                    if (res.code == 0) {
                        this.projectsName = res.result;
                        if (this.$route.query.pid) {
                            this.isCheck = true;
                            this.params.pid = Number(this.$route.query.pid);
                            this.changeRequirepid(this.params.pid);
                            this.params.iter_id = Number(this.$route.query.iter_id);
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        getRequireName(e) {
            console.log('之贵姓了111', e);
            // 获取项目名称
            this.$api.apiChart
                .rname_id2(e)
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
.item-time {
    color: #909399;
    margin-bottom: 30px;
}
.report {
    // margin-top: 20px;
    float: right;
}
</style>
