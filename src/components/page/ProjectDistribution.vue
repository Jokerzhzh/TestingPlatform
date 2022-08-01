<template>
    <div>
        <el-card style="margin-bottom: 20px">
            <div class="handle-box">
                <span class="public-title">项目:</span>
                <el-select multiple collapse-tags v-model="params.pname_list" placeholder="请选择项目" class="public-form">
                    <el-option v-for="item in projectsName" :key="item.pid" :label="item.pname" :value="item.pid"></el-option>
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
        <el-card class="box-card" v-show="projectOptions.length == 0">
            <div ref="bar" v-loading="loading" class="bar"></div>
            <el-table v-loading="loading" border size="mini" class="table" ref="multipleTable"> </el-table>
        </el-card>
        <el-card class="box-card" v-for="(project, u) in projectOptions" :key="u">
            <div :ref="'bar' + u" v-loading="loading" class="bar"></div>
            <el-table v-loading="loading" :data="project.tableData" border size="mini" class="table" :ref="'multipleTable' + u">
                <el-table-column prop="project" label="" fixed align="center"></el-table-column>
                <el-table-column
                    v-for="(item, i) in project.options.xAxis[0].data"
                    :key="i"
                    :prop="item"
                    :label="item"
                    align="center"
                ></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'ProjectDistribution',
    data() {
        return {
            value: true,
            projectsName: [],
            tableData: [], // 列表数据
            params: { pname_list: [] },
            loading: false, // 加载
            options: {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis'
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
                        data: [ ]
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: []
            },
            projectOptions: []
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
        // 重置
        onReset() {
            this.params = { pname_list: [] };
            this.tableData = [];
            this.options.series = [];
        },
        // 初始化Echarts
        initEcharts() {
            setTimeout(() => {
                this.projectOptions.forEach((item, i) => {
                    let bar = 'bar' + i;
                    console.log(this.$refs[bar][0], bar);
                    this.loading = false;
                    let myEcharts = this.$echarts.init(this.$refs[bar][0]);
                    // let option = options;
                    // myEcharts.clear();
                    myEcharts.setOption(item.options);
                });
            }, 1000);
        },
        // 查询条件验证
        async reportGenerate() {
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
            this.getData();
        },
        // 获取报表数据
        getData() {
            let p_list = [];
            this.params.pname_list.forEach((item, i) => {
                this.projectsName.forEach((project) => {
                    project.pid == item &&
                        p_list.push({
                            id: item,
                            project_name: project.pname
                        });
                });
                if (i == this.params.pname_list.length - 1) {
                    let params = {
                        etime: this.params.etime,
                        stime: this.params.stime,
                        p_list: JSON.stringify(p_list)
                    };
                    this.loading = true;
                    this.projectOptions = [];
                    this.$api.apiChart
                        .get_project_and_require_bugs(params)
                        .then((res) => {
                            if (res.code == 0 && res.result) {
                                res.result.forEach((pro) => {
                                    let options = JSON.parse(JSON.stringify(this.options));
                                    options.title.text = pro.project_name;
                                    let requires = [];
                                    let bugs = [];
                                    let tableData = [];
                                    let obj = {};
                                    obj.project = pro.project_name;
                                    pro.require_names.forEach((require) => {
                                        requires.push(require.rname);
                                        bugs.push(require.bugs ? require.bugs : 0);
                                        obj[require.rname] = require.bugs ? require.bugs : 0;
                                    });
                                    tableData.push(obj);
                                    options.xAxis[0].data = requires;
                                    options.series = {
                                        name: pro.project_name,
                                        type: 'bar',
                                        data: bugs,
                                        markPoint: {
                                            data: [
                                                { type: 'max', name: 'Max' },
                                                { type: 'min', name: 'Min' }
                                            ]
                                        },
                                        markLine: {
                                            data: [{ type: 'average', name: 'Avg' }]
                                        },
                                        barMaxWidth: 75 // 设置柱状图最大宽度
                                    };
                                    this.projectOptions.push({
                                        options,
                                        tableData
                                    });
                                });
                                console.log(this.projectOptions);
                                this.initEcharts();
                            } else {
                                this.$message.error(res.msg);
                                this.loading = false;
                            }
                        })
                        .catch((error) => {
                            this.$message.error(error);
                            this.loading = false;
                        });
                }
            });
        },

        // 获取项目列表
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
                    this.$message.error(err);
                });
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
