<template>
    <div>
        <el-card style="margin-bottom:20px">
            <div class="handle-box">
                <span class="public-title">项目:</span>
                <el-select v-model="value" placeholder="请选择项目" class="public-form">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>

                <span class="public-title">需求:</span>
                <el-select v-model="value" placeholder="请选择需求" class="public-form">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>

                <span class="public-title">终端:</span>
                <el-select v-model="value" placeholder="请选择终端" class="public-form">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>

                <span class="public-title">人员:</span>
                <el-input class="public-form" placeholder="请输人员名称"></el-input>
                <br />
                <span class="public-title">起始时间:</span>
                <el-date-picker class="public-form" type="date" placeholder="选择日期"> </el-date-picker>
                -
                <el-date-picker class="public-form" type="date" placeholder="选择日期"> </el-date-picker>
                <el-button type="primary">生成报表</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
                <el-button type="primary">导出</el-button>
            </div>
        </el-card>

        <el-card class="box-card">
            <div class="table-title">
                <h4 style="color:#909399;line-height:40px;text-align:center;">缺陷状态分布图</h4>
                <!-- <div class="select-public">
                    <span class="public-title">需求:</span>
                    <el-select v-model="value" placeholder="请选择需求" class="public-form">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </div> -->
            </div>
            <div ref="bar" class="bar"></div>
            <el-table :data="tableData" border size="mini" class="table" ref="multipleTable">
                <el-table-column prop="id" label="人名" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="name" label="已解决">
                    <template slot-scope="scope">{{ scope.row.project_name }}</template>
                </el-table-column>
                <el-table-column label="未解决">
                    <template slot-scope="scope">{{ scope.row.project_desc }}</template>
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
            title: '创建项目',
            projectsName: [], // 项目名称搜索
            tableData: [], // 列表数据
            pageTotal: 0, // 数据总条数
            disabled: false,
            options: [],
            value: ''
        };
    },
    mounted() {
        // 绑定enter事件
        document.addEventListener('keyup', this.enterKey);
        this.initEcharts();
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        onReset() {
            this.params = {};
            this.tableData = [];
            this.options.series = [];
        },
        initEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.bar);
            let option = {
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                title: {
                    text: '按需引入'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: ['周一', '周二', '周三', '周四', '周五']
                },
                yAxis: {
                    type: 'value'
                },
                legend: {},
                series: [
                    {
                        name: '星期',
                        type: 'bar',
                        data: [23, 33, 45, 56, 78]
                    }
                ]
            };
            myEcharts.setOption(option);
        },
        handleClose() {
            this.dialogVisible = false;
        },
        // 新增
        onAdd() {
            this.dialogVisible = true;
        },
        getData() {
            // 项目检索状态+列表
            this.$api
                .search_projects(this.params)
                .then(res => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.data;
                        this.pageTotal = res.count;
                        this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        getProjectName() {
            // 获取项目名称
            this.$api
                .get_project_name({})
                .then(res => {
                    if (res.code == 0) {
                        this.projectsName = res.projects_name;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(err => {
                    this.$message.error(res.msg);
                });
        },
        // 全局回车搜索
        enterKey(event) {
            const code = event.keyCode;
            const path = this.$route.path;
            if (code == 13 && path == '/testProject') {
                this.handleSearch();
            }
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.params, 'page', 1);
            this.getData();
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
