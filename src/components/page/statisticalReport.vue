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
                <span class="public-title">人员:</span>
                <!-- group_users -->
                <el-select v-model="params.userid" class="public-form" placeholder="请输人员名称">
                    <el-option
                        v-for="item in users"
                        :key="item.id"
                        :label="item.username"
                        :value="item.id"
                    ></el-option>
                </el-select>

                <span class="public-title">图表类型:</span>
                <el-select v-model="params.graph_type" placeholder="图表类型" class="public-form">
                    <el-option
                        v-for="item in useCase"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
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
            <h4 style="color:#909399;line-height:40px;text-align:center;">{{ title }}</h4>-->
            <!-- <div class="select-public">
                    <span class="public-title">需求:</span>
                    <el-select v-model="value" placeholder="请选择需求" class="public-form">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
            </div>-->
            <!-- </div> -->
            <div ref="bar" class="bar"></div>
            <!-- <div v-if="params.group_id != '0' && !params.userid" ref="bars" class="bar"></div>
            <div v-if="params.userid" ref="bar" class="bar"></div>-->
            <!--  v-if="options.series.length > 0" -->
            <el-table
                :data="tableData"
                border
                size="mini"
                class="table"
                ref="multipleTable"
                v-if="params.group_id == '0' && !params.userid"
            >
                <el-table-column prop="time" label="时间" align="center">
                    <!-- <template slot-scope="scope">{{ scope.row.id }}</template> -->
                </el-table-column>
                <el-table-column prop="group_name" label="组名">
                    <!-- <template slot-scope="scope">{{ scope.row.project_name }}</template> -->
                </el-table-column>
                <el-table-column prop="num" label="总数">
                    <!-- <template slot-scope="scope">{{ scope.row.project_desc }}</template> -->
                </el-table-column>
            </el-table>
            <el-table
                :data="tableData"
                border
                size="mini"
                class="table"
                ref="multipleTable"
                v-if="params.group_id != '0' && !params.userid"
            >
                <!-- <el-table-column prop="time" label="时间" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>-->
                <el-table-column prop="username" label="人名">
                    <!-- <template slot-scope="scope">{{ scope.row.project_name }}</template> -->
                </el-table-column>
                <el-table-column prop="sum_all" label="数量">
                    <!-- <template slot-scope="scope">{{ scope.row.project_desc }}</template> -->
                </el-table-column>
            </el-table>
            <el-table
                :data="tableData"
                border
                size="mini"
                class="table"
                ref="multipleTable"
                v-if="params.userid"
            >
                <!-- <el-table-column prop="time" label="时间" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>-->
                <el-table-column prop="time" label="时间">
                    <!-- <template slot-scope="scope">{{ scope.row.project_name }}</template> -->
                </el-table-column>
                <el-table-column prop="num" label="执行个数">
                    <!-- <template slot-scope="scope">{{ scope.row.project_desc }}</template> -->
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
            iterationList: [], // 迭代列表
            dialogVisible: false,
            title: '各组编写用例情况图',
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
            params: {
                group_id: '0',
                graph_type: 1
            },
            options: {
                title: {
                    text: '各组编写用例情况图',
                    // subtext: '纯属虚构',

                    // top: '1%',

                    left: 'center',

                    textStyle: { color: '#909399' }
                },
                legend: {
                    // show: false,
                    left: '1%'
                },
                // legend: {
                //     left: '1%'
                // },
                toolbox: {
                    show: true,
                    feature: {
                        /* line是折线图，bar是柱形图*/
                        // magicType: { show: true, type: ['line', 'bar'] },
                        saveAsImage: {
                            show: true
                        }
                    }
                    // feature: {
                    //         //     saveAsImage: {
                    //         //         show: true
                    //         //     }
                    //         // }
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
                series: []
            }
            // optionsBar: {
            //     title: {
            //         text: '各组编写用例情况图',
            //         // subtext: '纯属虚构',

            //         // top: '1%',

            //         left: 'center',

            //         textStyle: { color: '#909399' }
            //     },
            //     legend: {
            //         show: false
            //         // left: '1%'
            //     },
            //     toolbox: {
            //         // feature: {
            //         //     saveAsImage: {
            //         //         show: true
            //         //     }
            //         // }
            //         show: true,
            //         feature: {
            //             /* line是折线图，bar是柱形图*/
            //             magicType: { show: true, type: ['line', 'bar'] }
            //         }
            //     },

            //     tooltip: {
            //         trigger: 'axis',
            //         axisPointer: {
            //             type: 'shadow'
            //         }
            //     },
            //     xAxis: {
            //         type: 'category',
            //         data: []
            //     },
            //     yAxis: {
            //         type: 'value'
            //     },
            //     series: {}
            // }
        };
    },
    mounted() {
        // 绑定enter事件
        // document.addEventListener('keyup', this.enterKey);
        // this.initEcharts();
        this.getProjectName();
        this.groupName();
        // this.initEcharts();
    },
    destroyed() {
        // 销毁enter事件
        // document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        onReset() {
            this.params = {};
            this.tableData = [];
            this.options = {
                title: {
                    text: '各组编写用例情况图',
                    // subtext: '纯属虚构',

                    // top: '1%',

                    left: 'center',

                    textStyle: { color: '#909399' }
                },
                legend: {
                    // show: false,
                    left: '1%'
                },
                // legend: {
                //     left: '1%'
                // },
                toolbox: {
                    show: true,
                    feature: {
                        /* line是折线图，bar是柱形图*/
                        // magicType: { show: true, type: ['line', 'bar'] },
                        saveAsImage: {
                            show: true
                        }
                    }
                    // feature: {
                    //         //     saveAsImage: {
                    //         //         show: true
                    //         //     }
                    //         // }
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
                series: []
            };
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
            console.log('options:', this.options);
            // this.$refs.bar.removeAttr('_echarts_instance_').empty();
            this.$refs.bar.removeAttribute('_echarts_instance_');
            setTimeout(() => {
                let myEcharts = this.$echarts.init(this.$refs.bar);

                myEcharts.setOption(this.options);
            }, 1000);
        },
        // cinitEcharts() {
        //     console.log('options:', this.optionsBar);
        //     setTimeout(() => {
        //         let myEcharts = this.$echarts.init(this.$refs.bars);
        //         myEcharts.setOption(this.optionsBar);
        //     }, 1000);
        // },
        async reportGenerate() {
            let arr = [];
            let arrs = [];
            let maps = new Map();
            let array = [];
            let data = await this.getData();
            if (this.params.group_id == '0' && !this.params.userid) {
                let seriesData = [
                    {
                        name: '测试一组',
                        type: 'line',
                        data: []
                    },
                    {
                        name: '测试二组',
                        type: 'line',
                        data: []
                    },
                    {
                        name: '测试三组',
                        type: 'line',
                        data: []
                    }
                ];
                data.d_g_c = data.d_g_c ? data.d_g_c : [];
                this.tableData = data.d_g_c;

                data.d_g_c.map(item => {
                    if (!maps.has(item.time)) {
                        maps.set(item.time, item);
                    }
                    console.log('maps.', maps.values());
                    array = [...maps.values()];

                    seriesData.map(ite => {
                        if (item.group_name == ite.name) {
                            ite.data.push(item.num);
                        }
                    });

                    // seriesData.push(item.num);
                });
                array.map(item => {
                    arr.push(item.time);
                });
                this.options.title.text = '各组编写用例情况图';
                this.options.xAxis.data = arr;
                this.options.series = [...seriesData];
                // this.options.legend = {};
            } else if (this.params.group_id != '0' && !this.params.userid) {
                let series = { name: '', type: 'bar', data: [] };
                data.d_g_c = [];
                let serdata = [];
                let names = '';
                this.tableData = data.gtj;
                data.gtj.map(ite => {
                    arrs.push(ite.username);
                    series.data.push(ite.sum_all);
                    names = ite.be_group;
                    // if (!maps.has(item.username)) {
                    //     maps.set(item.username, item);
                    // }
                    // array = [...maps.values()];
                });
                serdata.push(series);
                // array.map(item => {
                //     arr.push(item.username);

                // });
                // this.optionsBar.series = [];
                this.options.title.text = names;
                this.options.xAxis.data = [...arrs];
                this.options.series = [...serdata];
                // this.cinitEcharts();
            }
            if (this.params.userid) {
                let names = '';
                let series = { name: '', type: 'line', data: [] };
                let serdata = [];
                this.tableData = data.d_g_c;
                console.log(' arr', arr);
                // data.d_g_c.map(ite => {
                //     if (!maps.has(ite.time)) {
                //         maps.set(ite.time, item);
                //     }
                //     // arr.push(ite.time);
                //     array = [...maps.values()];
                //     console.log(' arr', arr);
                // });
                // arr = [];
                data.d_g_c.map(item => {
                    arr.push(item.time);
                    series.data.push(item.num);
                    names = item.group_name;
                });
                serdata.push(series);
                this.options.title.text = names;
                this.options.xAxis.data = arr;
                this.options.series = [...serdata];
                // this.initEcharts();
            }
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
            let parm = {};
            parm.graph_type = this.params.graph_type;
            parm.begin_time = this.params.begin_time;
            parm.end_time = this.params.end_time;
            if (!this.params.big_project) {
                this.$message.error('项目为必选项');
                return;
            }
            if (this.params.userid) {
                parm.userid = this.params.userid;
            } else {
                parm.group_id = this.params.group_id;
            }
            if (this.params.requid_id) {
                parm.requid_id = this.params.requid_id;
            } else if (this.params.project_id) {
                parm.project_id = this.params.project_id;
            } else {
                parm.big_project = this.params.big_project;
            }
            let data = [];
            await this.$api.apiChart
                .report_funcase(parm)
                .then(res => {
                    if (res.code == 0) {
                        // this.options.series.data = res.result;
                        // this.tableData = res.result;
                        data = res;

                        // this.pageTotal = res.count;
                        // this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
            return data;
        },
        // changeProject(e){

        // },
        changeRequire(e) {
            // console.log(this.params.rid, e);
            let parm = { rname: e, belong_project: this.params.project_id };
            // this.getRequireName(parm);
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
        changeRequirepid(e) {
            let parm = { key: e };
            if (this.projectKey != e) {
                this.projectKey = e;
                delete this.params.project_id;
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
                delete this.params.requid_id;
                this.getRequireName(parm);
            }
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
