<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="params.tids" multiple collapse-tags clearable filterable placeholder="请选择任务集名称">
                    <el-option v-for="item in taskNameList" :key="item.id" :label="item.task_name" :value="item.id"> </el-option>
                </el-select>
                <el-date-picker v-model="params.stime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间">
                </el-date-picker>
                <!-- <el-date-picker v-model="params.stime" type="date" value-format="yyyy-MM-dd" placeholder="开始时间"></el-date-picker> -->
                -
                <el-date-picker v-model="params.etime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间">
                </el-date-picker>
                <!-- <el-date-picker v-model="params.etime" type="date" value-format="yyyy-MM-dd" placeholder="结束时间"></el-date-picker> -->
                <el-button type="primary" @click="queryTestReport()">生成测试报告</el-button>
                <el-button @click="onReload()">重 置</el-button>
            </div>
        </div>
        <el-row class="mt10" :gutter="10">
            <el-col :span="7">
                <el-card class="caseSum">
                    <h3>执行结果：</h3>
                    <div class="info">
                        <p><span class="count">执 行 人：</span>{{ this.username }}</p>
                        <p><span class="count">用 例 总 数：</span>{{ this.caseCount }}</p>
                        <p><span class="count">成 功 个 数：</span>{{ this.casePass }}</p>
                        <p><span class="count">成 功 率：</span>{{ this.passRate }}%</p>
                        <p><span class="count">失 败 个 数：</span>{{ this.caseFail }}</p>
                        <p><span class="count">失 败 率：</span>{{ this.failRate }}%</p>
                    </div>
                    <h3>饼状图：</h3>
                    <div ref="pie" class="pie"></div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="table">
                    <h3>任务集详情：</h3>
                    <br />
                    <div class="tree">
                        <el-tree
                            :data="tableData"
                            :props="defaultProps"
                            @node-click="handleNodeClick"
                            :render-content="renderContent"
                            accordion
                        ></el-tree>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="9">
                <el-card class="stepInfo" :data="stepInfo">
                    <h3>步骤详情：</h3>
                    <br />
                    <p>
                        <span class="content">步骤名称：</span>
                        <el-popover placement="top" width="300" trigger="hover" :content="this.stepInfo.step_name">
                            <el-button type="text" slot="reference">{{ this.stepInfo.step_name }}</el-button>
                        </el-popover>
                    </p>
                    <p>
                        <span class="content">元素名称：</span>
                        <el-popover
                            placement="top"
                            width="300"
                            trigger="hover"
                            :content="this.stepInfo.element_name"
                            v-if="this.stepInfo.element_name"
                        >
                            <el-button type="text" slot="reference">{{ this.stepInfo.element_name }}</el-button>
                        </el-popover>
                    </p>
                    <p>
                        <span class="content">定位置字符串：</span>
                        <el-popover
                            placement="top"
                            width="300"
                            trigger="hover"
                            :content="this.stepInfo.action_info"
                            v-if="this.stepInfo.action_info"
                        >
                            <el-button type="text" slot="reference">{{ this.stepInfo.action_info }}</el-button>
                        </el-popover>
                    </p>
                    <p>
                        <span class="content">执行动作：</span>
                        <el-popover
                            placement="top"
                            width="300"
                            trigger="hover"
                            :content="this.stepInfo.action_method"
                            v-if="this.stepInfo.action_method"
                        >
                            <el-button type="text" slot="reference">{{ this.stepInfo.action_method }}</el-button>
                        </el-popover>
                    </p>
                    <p>
                        <span class="content">执行动作数据：</span>
                        <el-popover
                            placement="top"
                            width="300"
                            trigger="hover"
                            :content="this.stepInfo.action_value"
                            v-if="this.stepInfo.action_value"
                        >
                            <el-button type="text" slot="reference">{{ this.stepInfo.action_value }}</el-button>
                        </el-popover>
                    </p>
                    <p>
                        <span class="content">执行步骤断言：</span>
                        <el-popover
                            placement="top"
                            width="300"
                            trigger="hover"
                            :content="this.stepInfo.action_raise"
                            v-if="this.stepInfo.action_raise"
                        >
                            <el-button type="text" slot="reference">{{ this.stepInfo.action_raise }}</el-button>
                        </el-popover>
                    </p>
                    <p>
                        <span class="content">图片地址：</span>
                        <el-popover
                            placement="top"
                            trigger="hover"
                            width="500"
                            :title="this.stepInfo.action_image"
                            :content="this.stepInfo.action_image"
                            v-if="this.stepInfo.action_image"
                        >
                            <!-- type="text" 设置文字按钮 -->
                            <!-- <el-button type="text"></el-button> -->
                            <!-- el-popover 内容显示图片 -->
                            <div style="max-width: 500px; max-height: 500px">
                                <img :src="this.stepInfo.action_image" alt style="width: 100%; height: 100%" />
                            </div>
                            <el-button type="text" slot="reference">{{ this.stepInfo.action_image }}</el-button>
                        </el-popover>
                    </p>
                    <p>
                        <span class="content">执行结果：</span>
                        <el-tag :type="this.stepInfo.action_result == '0' ? 'success' : 'danger'">
                            {{ this.stepInfo.action_result == '0' ? '成功' : '失败' }}
                        </el-tag>
                    </p>
                    <p v-if="this.stepInfo.action_result == '1'">
                        <span class="content">异常信息：</span>
                        <el-popover placement="top" width="500" max-heigth="500" trigger="hover" :content="this.stepInfo.except_log">
                            <!-- type="text" 设置文字按钮 -->
                            <!-- <el-button type="text"></el-button> -->
                            <el-button type="text" slot="reference">{{ this.stepInfo.except_log }}</el-button>
                        </el-popover>
                    </p>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            params: {
                tids: [],
                stime: '',
                etime: ''
            },
            taskNameList: [], // 任务集名称
            tableData: [], // 报表的数据
            options: {}, // 报表配置
            caseCount: '0', // 用例总数
            casePass: '0', // 成功个数
            passRate: '0', // 成功率
            caseFail: '0', // 失败个数
            failRate: '0', // 失败率
            username: '...', // 执行人
            defaultProps: {
                // el-tree的数据
                children: 'children',
                label: 'label'
            },
            stepInfo: {
                // 默认数据
                step_name: '步骤详情',
                element_name: '元素名称',
                action_info: '定位置字符串',
                action_method: '执行动作',
                action_value: '执行动作数据',
                action_raise: '执行步骤断言',
                action_image: '图片地址',
                action_result: '0',
                except_log: '异常信息'
            }
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.getTaskName();
    },
    mounted() {
        // 绑定enter事件
        document.addEventListener('keyup', this.enterKey);
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener('keyup', this.enterKey);
    },
    methods: {
        // 点击步骤 查看步骤详情
        handleNodeClick(data) {
            // console.log(data);
            // console.log(typeof data);
            // 把 data 的 key 值，提取为数组
            var objKeys = Object.keys(data);
            // console.log('🚀 ~ objKeys', typeof objKeys);
            // console.log(objKeys);
            // console.log(objKeys.length);
            // console.log(objKeys.indexOf('except_log'));
            // objKeys.indexOf('except_log') = -1 时 表示数组中没有改字段，！= -1 时择有该字段
            if (objKeys.indexOf('except_log') != -1) {
                // console.log(data);
                // if (data.except_log) {
                //     console.log(data.except_log);
                // }
                this.stepInfo = JSON.parse(JSON.stringify(data).replace(/label/g, 'step_name'));
            }
        },
        // el-tree 各层级信息
        renderContent(h, { node, data, store }) {
            // console.log('🚀 ~ node', node.label);

            var arr = Object.keys(data);
            // 一级类目 一级类目的数组长度都为 2
            if (arr.length == 2) {
                return <span style="font-weight: bold; font-size: 15px; color: #606266">{node.label}</span>;
            }
            // 二级类目 二级类目都有 username
            if (data.username) {
                return (
                    <span style="font-size: 15px; color: #606266">
                        {node.label}---{data.username}
                    </span>
                );
            }
            // 三级类目 三级类目都有 action_result
            if (data.action_result == 0) {
                // action_result == 0 时，执行成功，字体为绿色，图标为success
                return (
                    <span style="font-size: 13px; color: #67C23A">
                        <i class="el-icon-success"> </i> {node.label}
                    </span>
                );
            } else {
                // 执行失败，字体为红色，图标为error
                return (
                    <span style="font-size: 13px; color: #EE3F3F;">
                        <i class="el-icon-error"></i> {node.label}
                    </span>
                );
            }
        },
        // 初始化Echarts
        initEcharts() {
            let myEcharts = this.$echarts.init(this.$refs.pie);
            // let option = options;
            // myEcharts.clear();
            myEcharts.setOption(this.options, true);
        },
        // 获取任务集名称
        getTaskName() {
            this.$api
                .get_task_name()
                .then((res) => {
                    if (res.code == 0) {
                        this.taskNameList = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 生成测试报告
        queryTestReport() {
            if (this.params.stime && !this.params.etime) {
                this.$message.error('请选择结束时间！！！');
                return;
            }
            if (!this.params.stime && this.params.etime) {
                this.$message.error('请选择开始时间！！！');
                return;
            }
            let stime = new Date(this.params.stime).getTime();
            let etime = new Date(this.params.etime).getTime();
            if (stime > etime) {
                this.$message.error('结束时间不得早于开始时间！！！');
                return;
            }
            console.log('🚀 ~ this.params.tids.length', this.params.tids.length);
            let params = {};
            if (this.params.tids.length == 0) {
                params = {
                    tids: '',
                    stime: this.params.stime,
                    etime: this.params.etime
                };
            } else {
                params = {
                    tids: JSON.stringify(this.params.tids),
                    stime: this.params.stime,
                    etime: this.params.etime
                };
            }
            this.$api
                .query_test_report(params)
                .then((res) => {
                    if (res.code == 0) {
                        // this.$message.success(res.msg);

                        if (res.result) {
                            this.caseCount = res.pass_or_fail_count.pass + res.pass_or_fail_count.fail;
                            this.casePass = res.pass_or_fail_count.pass;
                            this.caseFail = res.pass_or_fail_count.fail;

                            this.passRate = ((this.casePass / this.caseCount) * 100).toFixed(2);
                            this.failRate = ((this.caseFail / this.caseCount) * 100).toFixed(2);
                            // this.tableData = res.result;
                            // console.log(res.result.taskData.case_data);
                            // .replace(/case_data/g, 'children') 把数据中的 case_data 全部换成 children
                            // JSON.parse() 把字符串转换为json格式
                            var case_data = JSON.parse(JSON.stringify(res.result).replace(/case_data/g, 'children'));
                            var task_data = JSON.parse(JSON.stringify(case_data).replace(/task_data/g, 'children'));
                            var step_name = JSON.parse(JSON.stringify(task_data).replace(/step_name/g, 'label'));
                            var case_name = JSON.parse(JSON.stringify(step_name).replace(/case_name/g, 'label'));
                            var task_name = JSON.parse(JSON.stringify(case_name).replace(/task_name/g, 'label'));
                            this.tableData = task_name;

                            let arr = [];
                            res.result.forEach((item) => {
                                // console.log(item.task_data[0].username);
                                arr.push(item.task_data[0].username);
                            });
                            // Array.from(new Set(arr)) 取出数组中重复的数据
                            // console.log(Array.from(new Set(arr)));
                            // console.log(arr);
                            arr = Array.from(new Set(arr));
                            // console.log('🚀 ~ arr', arr);
                            // JSON.stringify(arr) 把数组原封不动的转换成字符串
                            // console.log(typeof JSON.stringify(arr));
                            // arr.join(',') 把数组里的数据转化为字符串且用 ',' 分割
                            // console.log(arr.join('、'));
                            this.username = arr.join('、');
                            // console.log('🚀 ~ this.username', this.username);

                            // var str = 'hello world!';
                            // var items = str.split('ll'); // ["he", "oWorld!"]
                            // console.log('🚀 ~ items', items);
                            // var newStr = items.join(','); // heoWorld!
                            // console.log('🚀 ~ newStr', newStr);

                            let pass = {
                                name: '成功',
                                value: res.pass_or_fail_count.pass
                            };
                            let fail = {
                                name: '失败',
                                value: res.pass_or_fail_count.fail
                            };
                            let data = [];
                            data.push(pass, fail);
                            this.options = {
                                tooltip: {
                                    trigger: 'item'
                                },
                                legend: {
                                    top: '5%',
                                    left: 'center'
                                },
                                color: ['#67C23A', '#EE3F3F'], // 设置每个扇形的颜色 #F56C6C
                                series: [
                                    {
                                        name: '用例数',
                                        type: 'pie',
                                        radius: ['0', '65%'],
                                        avoidLabelOverlap: false,
                                        label: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            label: {
                                                show: true,
                                                formatter: '{d}%',
                                                fontSize: '20'
                                                // fontWeight: 'bold'
                                            }
                                        },
                                        data: data
                                    }
                                ]
                            };
                            this.initEcharts();
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(err.msg);
                });
        },
        // 重置
        onReload() {
            this.params = {
                tids: []
            };
        },
        // 重新渲染 input 可编辑操作
        change() {
            this.$forceUpdate();
        }
    }
};
</script>

<style scoped lang="less">
.handle-box {
    // margin-bottom: 10px;
    // div {
    //     margin-bottom: 10px;
    // }
    .el-input {
        width: 200px;
    }
    .el-select {
        width: 200px;
        margin-right: 10px;
    }
    .el-button {
        margin-left: 10px;
    }
}
.container {
    padding: 20px 30px;
}
.el-card {
    // 设置 el-card 宽度根绝不同的电脑自适应
    min-width: 100%;
    height: 520px;
    transition: all 0.5s;
}
.caseSum {
    // background: wheat;
    .info {
        width: 100%;
        height: 200px;
        text-align: left;
        // background-color: aqua;
        padding: 30px 0px 0px 90px;
        line-height: 30px;
    }
    .count {
        font-weight: bold;
        margin-top: 10px;
    }
    .pie {
        width: 100%;
        height: 200px;
        margin: 0 auto;
        // margin-top: -150px;
        // margin-right: 100px;
        // margin-top: 40px;
        // margin-left: 75px;
        // background-color: aquamarine;
    }
}
.table {
    // background: aqua;
    height: 520px;
    .tree {
        height: 460px;
        // width: 100%;
        // overflow-x: hidden;
        // width: 200px;
        // overflow: auto;
        // background: yellow;
        // margin-left: 50px;
    }
    // .tree {
    //     overflow-y: hidden;
    //     overflow-x: scroll;
    //     width: 80px;
    //     height: 480px;
    // }
    // .el-tree {
    //     min-width: 100%;
    //     display: inline-block !important;
    // }
    .el-tree {
        height: 430px;
        // width: 200px;
        overflow: auto;
        // background: yellow;
        // margin-left: 50px;
    }
}
.stepInfo {
    // background: #89c2f7;
    height: 520px;
    .content {
        // font-size: 100px;
        font-weight: bold;
        margin-top: 10px;
        margin-left: -10px;
        line-height: 50px;
    }
    .el-button {
        font-size: 15px; // 设置按钮文字大小
        color: #606266; // 设置按钮文字颜色
        // background: white; // 设置按钮背景
        // border: none; // 取掉button的边框
        max-width: 290px;
        // CSS文字不换行，超出部分显示...
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
.mt10 {
    margin-top: 10px;
}
// el-tree 样式
/deep/.el-tree-node__content {
    &:hover {
        background: #a7cef3;
    }
}
/deep/.el-tree-node__label {
    font-family: 'Trebuchet MS', Arial, Helvetica, sans-serif !important; // 设置标点符号
    // font-size: 15px; // 字体大小
    // color: #030303; // 字体颜色
    line-height: 30px; // 行高
    // letter-spacing: 1px; // 字距
}
</style>
