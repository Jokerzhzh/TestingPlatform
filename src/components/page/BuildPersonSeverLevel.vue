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

                <span class="public-title">用户组:</span>
                <el-select
                    v-model="params.group"
                    placeholder="用户组"
                    class="public-form"
                    @change="getchangeGroup"
                >
                    <el-option
                        v-for="item in dutype"
                        :key="item.id"
                        :label="item.group_name"
                        :value="item.group_name"
                    ></el-option>
                </el-select>

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
            <h4 style="color:#909399;line-height:40px;text-align:center;">缺陷创建人/严重级别分布图</h4>-->
            <!-- <div class="select-public">
                    <span class="public-title">需求:</span>
                    <el-select v-model="value" placeholder="请选择需求" class="public-form">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
            </div>-->
            <!-- </div> -->
            <div ref="bar" class="bar"></div>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="owner" label="创建人" align="center">
                    <template slot-scope="scope">{{ scope.row.owner }}</template>
                </el-table-column>
                <el-table-column label="总数">
                    <template slot-scope="scope">{{ scope.row.sum_bugs }}</template>
                </el-table-column>
                <el-table-column prop="Highest" label="Highest">
                    <template slot-scope="scope">{{ scope.row.Highest }}</template>
                </el-table-column>
                <el-table-column label="High">
                    <template slot-scope="scope">{{ scope.row.High }}</template>
                </el-table-column>
                <!-- <el-table-column label="High">
                    <template slot-scope="scope">{{ scope.row.High }}</template>
                </el-table-column>-->
                <el-table-column label="Medium">
                    <template slot-scope="scope">{{ scope.row.Medium }}</template>
                </el-table-column>
                <el-table-column label="Low">
                    <template slot-scope="scope">{{ scope.row.Low }}</template>
                </el-table-column>
                <el-table-column label="Lowest">
                    <template slot-scope="scope">{{ scope.row.Lowest }}</template>
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
            dutyped: [],
            status: [],
            terminal: ['IOS', 'Android', 'PC'],
            dutype: [],
            value: '',
            params: {},
            options: {
                title: {
                    text: '缺陷创建人/严重级别分布图',
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
                        // 坐标轴指示器，坐标轴触发有效
                        type: 'none' // 默认为直线，可选为：'line' | 'shadow'
                        // show: false
                    },
                    textStyle: {
                        color: '#D7E3FF'
                    },
                    backgroundColor: '#0F1225',
                    padding: [10, 18, 20, 12],
                    formatter: function(obj) {
                        var str = '';
                        str = '<div style="font-size: 12px;"><p style="color:#8DA2D3;lineHeight:18px;height:18px;">' + obj[0].name + '</p>';
                        obj.map(item => {
                            let subStr =
                                "<div style='lineHeight:22px;height:24px;'><div style='display:inline-block;width:5px;height:5px;margin-right:6px;background:" +
                                item.color +
                                ";border-radius:50%;margin-bottom:2px;'></div>" +
                                item.seriesName +
                                '：' +
                                item.value +
                                '</div>';
                            str += subStr;
                        });
                        str += '</div>';
                        return str;
                    }
                },
                backgroundColor: '#ffffff',
                legend: {
                    // data: ['超上限报警', '超上上限报警', '超下限报警', '超下下限报警'],
                    icon: 'circle',
                    itemGap: 24,
                    itemWidth: 10,
                    itemHeight: 10,
                    icon: 'circle',
                    orient: 'horizontal',
                    // right: 10,
                    bottom: 'bottom',
                    textStyle: {
                        color: '#5D6C8E',
                        fontSize: 14,
                        padding: [0, 0, 0, 6],
                        fontFamily: 'SourceHanSansCN-Regular'
                        // lineHeight: 30
                    }
                },
                // grid: {
                //     left: '3%',
                //     right: '4%',
                //     bottom: '3%',
                //     containLabel: true,
                //     // show: true,
                //     borderColor: '#F3F5F7'
                // },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLabel: {
                        textStyle: {
                            color: '#5D6C8E',
                            fontSize: 14
                        },
                        margin: 18
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                },
                yAxis: [
                    {
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
                            lineStyle: {
                                type: 'solid',
                                color: '#F3F5F7'
                            }
                        },
                        splitNumber: 2
                    }
                ],

                // color: ['#5F9CFE', '#A8CDFF', '#F4686D', '#FF9A9D'],
                series: [
                    // {
                    //     name: '超上限报警',
                    //     type: 'bar',
                    //     barWidth: 30,
                    //     stack: '搜索引擎',
                    //     showBackground: true,
                    //     backgroundStyle: {
                    //         color: '#F9FAFD'
                    //     },
                    //     data: []
                    // },
                    // {
                    //     name: '超上上限报警',
                    //     type: 'bar',
                    //     stack: '搜索引擎',
                    //     barWidth: 30,
                    //     data: []
                    // },
                    // {
                    //     name: '超下限报警',
                    //     type: 'bar',
                    //     stack: '搜索引擎',
                    //     barWidth: 30,
                    //     data: []
                    // },
                    // {
                    //     name: '超下下限报警',
                    //     type: 'bar',
                    //     stack: '搜索引擎',
                    //     barWidth: 30,
                    //     data: []
                    // }
                    // {
                    //     // name: '超上限报警',
                    //     // type: 'bar',
                    //     // barWidth: 30,
                    //     // stack: '搜索引擎',
                    //     // data: [620, 732, 701, 734, 1090, 1130, 1120]
                    //     type: 'bar',
                    //     itemStyle: {
                    //         color: 'rgba(0,0,0,0.05)'
                    //     },
                    //     barGap: '-100%',
                    //     barCategoryGap: '40%',
                    //     data: [300],
                    //     animation: false
                    // }
                ]
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
        groupName() {
            // dutype
            this.$api.apiChart
                .test_group_name({})
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
        getchangeGroup(e) {
            let id = 0;
            this.dutype.map(item => {
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
                .then(res => {
                    if (res.code == 0) {
                        this.dutyped = res.result;
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
        // handleClose() {
        //     this.dialogVisible = false;
        // },
        // 新增
        onAdd() {
            this.dialogVisible = true;
        },
        onReset() {
            this.params = {};
            this.tableData = [];
            this.options.series = [];
        },
        async reportGenerate() {
            let data = await this.getData();
            this.tableData = data;
            let arr = [],
                series = [
                    {
                        name: 'Highest',
                        type: 'bar',
                        barWidth: 30,
                        stack: '搜索引擎',
                        showBackground: true,
                        backgroundStyle: {
                            color: '#F9FAFD'
                        },
                        data: []
                    },
                    {
                        name: 'High',
                        type: 'bar',
                        stack: '搜索引擎',
                        barWidth: 30,
                        data: []
                    },
                    {
                        name: 'Medium',
                        type: 'bar',
                        stack: '搜索引擎',
                        barWidth: 30,
                        data: []
                    },
                    {
                        name: 'Low',
                        type: 'bar',
                        stack: '搜索引擎',
                        barWidth: 30,
                        data: []
                    },
                    {
                        name: 'Lowest',
                        type: 'bar',
                        barWidth: 30,
                        stack: '搜索引擎',
                        data: []
                    }
                ];
            if (data) {
                data.map((ite, index) => {
                    arr.push(ite.owner);
                    for (var key in ite) {
                        console.log('key', key);
                        series.map((item, i) => {
                            //  data.hasOwnProperty('code')
                            if (item.name == key) {
                                item.data.push(ite[key]);
                                // console.log('ite.key', );
                                // item.data.push(ite.key);
                            }
                        });
                    }
                    // series.map((item, i) => {
                    //     //  data.hasOwnProperty('code')
                    //     if (item.name == Object.keys(ite)[index]) {
                    //         item.data.push()
                    //     }
                    // });
                });
            }

            this.options.xAxis.data = arr;
            this.options.series = [...series];
            console.log('this.options.series.data', this.options.series.data);
            this.initEcharts();
        },
        async getData() {
            // 项目检索状态+列表
            // let par = {assignee: '张三'};
            // this.params
            if (!this.params.pid) {
                this.$message.error('项目为必选项');
                return;
            }
            let data = [];
            await this.$api.apiChart
                .submit_bugs(this.params)
                .then(res => {
                    if (res.code == 0) {
                        // this.options.series.data = res.result;
                        // this.tableData = res.result;
                        data = res.result;

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
            // this.requiresName = [];
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
