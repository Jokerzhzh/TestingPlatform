<template>
    <div>
        <el-card style="margin-bottom: 10px">
            <div class="handle-box">
                <el-select v-model="params.project_list" placeholder="请选择项目" filterable clearable multiple collapse-tags>
                    <el-option v-for="item in tapdProjectList" :key="item.id" :label="item.tapd_project_name" :value="item.id"> </el-option>
                </el-select>
                <el-date-picker v-model="params.task_stime" type="date" value-format="yyyy-MM-dd" placeholder="开始时间"> </el-date-picker>
                -
                <el-date-picker v-model="params.task_etime" type="date" value-format="yyyy-MM-dd" placeholder="结束时间"> </el-date-picker>
                <el-button type="primary" @click="create">生成报表</el-button>
                <el-button @click="onReset">重 置</el-button>
            </div>
        </el-card>
        <el-card class="box-card">
            <div ref="bar" id="bar" class="bar" v-loading="loading"></div>
        </el-card>
        <!-- :title="title" -->
        <el-dialog :visible.sync="dialogVisible" width="90%" @opened="opens">
            <div ref="info" id="info" class="info" v-loading="loading"></div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ProjectDistribution',
    data() {
        return {
            params: {
                task_stime: '',
                task_etime: '',
                project_list: []
            },
            loading: false, // 加载
            options: {},
            options1: {},
            title: '',
            dialogVisible: false,
            tapdProjectList: []
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.getTapdProject();
    },
    methods: {
        // 生成报表
        create() {
            if (this.params.task_stime && !this.params.task_etime) {
                this.$message.error('请选择结束时间！！！');
                return;
            }
            if (!this.params.task_stime && this.params.task_etime) {
                this.$message.error('请选择开始时间！！！');
                return;
            }
            let stime = new Date(this.params.task_stime).getTime();
            let etime = new Date(this.params.task_etime).getTime();
            if (stime > etime) {
                this.$message.error('结束时间不得早于开始时间！！！');
                return;
            }
            let params = {};
            if (this.params.project_list.length == 0) {
                params = {
                    project_list: '',
                    stime: this.params.task_stime,
                    etime: this.params.task_etime
                };
            } else {
                let arr = [];
                this.tapdProjectList.forEach((item) => {
                    this.params.project_list.forEach((ele) => {
                        if (item.id == ele) {
                            let obj = {};
                            obj[item.id] = item.tapd_project_name;
                            arr.push(obj);
                        }
                    });
                });
                // console.log(arr);
                // console.log(JSON.stringify(arr));
                // console.log(JSON.stringify(arr).split('"').join(''));
                // console.log(JSON.stringify(arr).replace(/:/g, ',').replace(/{/g, '(').replace(/}/g, ')'));
                let str = JSON.stringify(arr).replace(/:/g, ',').replace(/{/g, '(').replace(/}/g, ')');
                // console.log('🚀 ~ str', str);
                params = {
                    project_list: str,
                    stime: this.params.task_stime,
                    etime: this.params.task_etime
                };
            }
            // console.log(params.project_list);
            this.loading = true;
            this.$api
                .tester_tasktime_search(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success('成功');

                        let echarts = this.$echarts;

                        // 开始时间
                        // let startTimeAll = new Date('2021-12-01').getTime();
                        let startTimeAll;
                        // 结束时间
                        // let endTimeAll = new Date('2021-12-31').getTime();
                        let endTimeAll;

                        // 不输入查询条件时 则默认是获取当前月的第一天开始 最后一天结束
                        if (this.params.task_stime == '' || this.params.task_etime == '') {
                            // 获取当前月的第一天 例如：2021-12-01
                            function getCurrentMonthFirst() {
                                var date = new Date();
                                date.setDate(1);
                                let year = date.getFullYear();
                                var month = parseInt(date.getMonth() + 1);
                                var day = date.getDate();
                                var hour = '00';
                                var minutes = '00';
                                var seconds = '00';
                                if (month < 10) {
                                    month = '0' + month;
                                }
                                if (day < 10) {
                                    day = '0' + day;
                                }
                                // return date.getFullYear() + '-' + month + '-' + day;
                                return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
                            }
                            // 获取当前月的最后一天 例如：2021-12-31
                            function getCurrentMonthLast() {
                                var date = new Date();
                                var currentMonth = date.getMonth();
                                var nextMonth = ++currentMonth;
                                var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
                                var oneDay = 1000 * 60 * 60 * 24;
                                var lastTime = new Date(nextMonthFirstDay - oneDay);
                                let year = date.getFullYear();
                                var month = parseInt(lastTime.getMonth() + 1);
                                var day = lastTime.getDate();
                                if (month < 10) {
                                    month = '0' + month;
                                }
                                if (day < 10) {
                                    day = '0' + day;
                                }
                                // return date.getFullYear() + '-' + month + '-' + day;
                                return '2022' + '-' + '1' + '-' + '1' + ' ' + '00' + ':' + '00' + ':' + '00';
                            }
                            /*获取下个月的第一天*/
                            function nextMonthFirstDay() {
                                var time = new Date();
                                var year = time.getFullYear();
                                var month = time.getMonth() + 2;
                                if (month > 12) {
                                    month = month - 12;
                                    year = year + 1;
                                }
                                var day = 1;
                                var hour = '00';
                                var minutes = '00';
                                var seconds = '00';
                                return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
                            }
                            let stime = getCurrentMonthFirst();
                            let etime = nextMonthFirstDay();
                            startTimeAll = new Date(stime).getTime();
                            endTimeAll = new Date(etime).getTime();
                        } else {
                            // 获取日期的具体时间 ：2021-12-15 10:53:00
                            function get(time) {
                                let year = time.getFullYear();
                                var month = parseInt(time.getMonth() + 1);
                                var day = time.getDate();
                                var hour = '00';
                                var minutes = '00';
                                var seconds = '00';
                                if (month < 10) {
                                    month = '0' + month;
                                }
                                if (day < 10) {
                                    day = '0' + day;
                                }
                                return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
                            }

                            // 输入查询条件时 时间为输入的开始时间和结束时间
                            startTimeAll = new Date(get(new Date(this.params.task_stime))).getTime();
                            // 获取输入日期的后一天
                            var nextDate = new Date(new Date(this.params.task_etime).getTime() + 24 * 60 * 60 * 1000 - 8 * 60 * 60 * 1000);
                            endTimeAll = new Date(get(nextDate)).getTime();

                            // startTimeAll = new Date(this.params.task_stime).getTime();
                            // endTimeAll = new Date(this.params.task_etime).getTime();
                        }

                        // y轴列表 人名
                        // let categories = ['A', 'B', 'C'];
                        let categories = [];
                        res.result.forEach((item) => {
                            // if (item.task_info) {
                            categories.push(item.owner);
                            // }
                        });
                        categories = Array.from(new Set(categories));

                        // 项目列表
                        // let series = ['故障', '换模', '换刀'];
                        let series = [];
                        res.result.forEach((item) => {
                            // console.log('🚀 ~ item', item.task_info);
                            // item.task_info.forEach((ele) => {
                            //     series.push(ele.project_name);
                            // });
                            if (item.task_info) {
                                item.task_info.forEach((ele) => {
                                    series.push(ele.project_name);
                                });
                            }
                        });
                        series = Array.from(new Set(series));

                        function getDate(time) {
                            let year = time.getFullYear(); // 年 2021
                            let month = parseInt(time.getMonth()) + 1; // 月 12
                            let day = time.getDate(); // 日 8
                            let hour = time.getHours(); // 小时 9
                            let minutes = time.getMinutes(); // 分钟 17
                            let seconds = time.getSeconds(); // 秒 30
                            if (hour < 10) {
                                hour = '0' + hour;
                            }
                            if (minutes < 10) {
                                minutes = '0' + minutes;
                            }
                            if (seconds < 10) {
                                seconds = '0' + seconds;
                            }
                            // 日期格式 2021-12-8 9:17:30
                            return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
                        }

                        // 数据列表
                        let jsonData = [];
                        res.result.forEach((item) => {
                            let owner = item.owner;
                            if (item.task_info) {
                                item.task_info.forEach((ele) => {
                                    // console.log('🚀 ~ ele', ele.task_stime);
                                    const start = new Date(new Date(ele.task_stime).getTime() - 8 * 60 * 60 * 1000);
                                    let task_stime = getDate(start);
                                    // console.log('🚀 ~ start', getDate(start));
                                    // console.log('🚀 ~ ele', ele.task_etime);

                                    const end = new Date(new Date(ele.task_etime).getTime() + 24 * 60 * 60 * 1000 - 8 * 60 * 60 * 1000 - 1);
                                    // console.log('🚀 ~ end', getDate(end));
                                    let task_etime = getDate(end);

                                    let project_name = ele.project_name;
                                    ele['owner'] = owner;
                                    let obj = { owner, project_name, task_stime, task_etime };
                                    jsonData.push(obj);
                                });
                            }
                            // item.task_info.forEach((ele) => {
                            //     // console.log('🚀 ~ ele', ele.task_stime);
                            //     const start = new Date(new Date(ele.task_stime).getTime() - 8 * 60 * 60 * 1000);
                            //     let task_stime = getDate(start);
                            //     // console.log('🚀 ~ start', getDate(start));
                            //     // console.log('🚀 ~ ele', ele.task_etime);

                            //     const end = new Date(new Date(ele.task_etime).getTime() + 24 * 60 * 60 * 1000 - 8 * 60 * 60 * 1000 - 1);
                            //     // console.log('🚀 ~ end', getDate(end));
                            //     let task_etime = getDate(end);

                            //     let project_name = ele.project_name;
                            //     ele['owner'] = owner;
                            //     let obj = { owner, project_name, task_stime, task_etime };
                            //     jsonData.push(obj);
                            // });
                        });
                        // 数据格式
                        // let jsonData = [
                        //     {
                        //         owner: '朱振泉',
                        //         project_name: '自动化测试平台一期',
                        //         task_stime: '2021-12-03',
                        //         task_etime: '2021-12-10'
                        //     },
                        //     {
                        //         owner: '朱振泉',
                        //         project_name: '自动化测试平台二期',
                        //         task_stime: '2021-12-6',
                        //         task_etime: '2021-12-16'
                        //     },
                        //     {
                        //         owner: '朱振泉',
                        //         project_name: '自动化测试平台二期',
                        //         task_stime: '2021-12-20',
                        //         task_etime: '2021-12-29'
                        //     },
                        //     {
                        //         owner: '王超',
                        //         project_name: '自动化测试平台一期',
                        //         task_stime: '2021-12-01',
                        //         task_etime: '2021-12-15'
                        //     },
                        //     {
                        //         owner: '王超',
                        //         project_name: '自动化测试平台一期',
                        //         task_stime: '2021-12-20',
                        //         task_etime: '2021-12-31'
                        //     },
                        //     {
                        //         owner: '任柯安',
                        //         project_name: '自动化测试平台一期',
                        //         task_stime: '2021-12-01',
                        //         task_etime: '2021-12-31'
                        //     },
                        //     {
                        //         owner: '杨思博',
                        //         project_name: '自动化测试平台二期',
                        //         task_stime: '2021-12-01',
                        //         task_etime: '2021-12-31'
                        //     }
                        // ];

                        let seriesValue = [];

                        // 获取x轴的时间 例如：12-1，12-2......
                        function getXDate(time) {
                            let year = time.getFullYear();
                            let month = parseInt(time.getMonth()) + 1;
                            let day = time.getDate();
                            let hour = time.getHours();
                            let minutes = time.getMinutes();
                            let seconds = time.getSeconds();
                            // return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
                            return month + '-' + day;
                        }

                        // 返回时间格式 例如：2021-12-3......
                        function getDateTime(time) {
                            let year = time.getFullYear();
                            let month = parseInt(time.getMonth()) + 1;
                            let day = time.getDate();
                            let hour = time.getHours();
                            let minutes = time.getMinutes();
                            let seconds = time.getSeconds();
                            // return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
                            return year + '-' + month + '-' + day;
                        }

                        // 随机生成颜色
                        function randomColor() {
                            var str = '#';
                            for (var i = 0; i < 6; i++) {
                                str += Math.floor(Math.random() * 16).toString(16);
                            }
                            return str;
                        }
                        let colorList = [];
                        for (let i = 0; i < series.length; i++) {
                            colorList.push(randomColor());
                        }

                        // Generate mock data
                        echarts.util.each(categories, function (owner, index) {
                            let cgory = categories[index];
                            series.forEach((itemS, indexS) => {
                                jsonData.forEach((itemj, indexj) => {
                                    if (itemj.owner == cgory) {
                                        let data = [];
                                        let task_stime = new Date(itemj.task_stime).getTime();
                                        let task_etime = new Date(itemj.task_etime).getTime();
                                        let duration = task_etime - task_stime;
                                        if (itemj.project_name == itemS) {
                                            data.push({
                                                name: itemj.project_name,
                                                value: [index, task_stime, task_etime, duration],
                                                itemStyle: {
                                                    // normal: {
                                                    //     //color: '#7b9ce1',
                                                    // }
                                                }
                                            });
                                            seriesValue.push({
                                                name: itemS,
                                                type: 'custom',
                                                renderItem: renderItem,
                                                barWidth: 30,
                                                itemStyle: {
                                                    // normal: {
                                                    opacity: 0.8 // 数据条的透明度
                                                    // }
                                                },
                                                encode: {
                                                    x: [1, 2],
                                                    y: 0
                                                },
                                                data: data
                                            });
                                        }
                                    }
                                });
                            });
                        });
                        function renderItem(params, api) {
                            let ownerIndex = api.value(0);
                            let start = api.coord([api.value(1), ownerIndex]);
                            let end = api.coord([api.value(2), ownerIndex]);
                            let height = api.size([0, 1])[1] * 0.6;

                            let rectShape = echarts.graphic.clipRectByRect(
                                {
                                    x: start[0],
                                    y: start[1] - height / 2,
                                    width: end[0] - start[0],
                                    height: height
                                },
                                {
                                    x: params.coordSys.x,
                                    y: params.coordSys.y,
                                    width: params.coordSys.width,
                                    height: params.coordSys.height
                                }
                            );

                            return (
                                rectShape && {
                                    type: 'rect',
                                    shape: rectShape,
                                    style: api.style()
                                }
                            );
                        }
                        var relVal;
                        this.options = {
                            legend: {
                                type: 'scroll',
                                data: series,
                                show: true,
                                // orient: 'vertical',
                                align: 'auto',
                                top: '1%',
                                right: '2%'
                            },
                            // tooltip: {
                            //     formatter: function (params) {
                            //         // console.log('🚀 ~ params', params);
                            //         return (
                            //             params.marker +
                            //             params.name +
                            //             ': ' +
                            //             params.value[3] / 1000 / 60 / 60 / 24 +
                            //             ' 天（' +
                            //             getDateTime(new Date(params.value[1])) +
                            //             '~' +
                            //             getDateTime(new Date(params.value[2])) +
                            //             '）'
                            //         );
                            //     }
                            // },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                },
                                formatter: function (params) {
                                    // console.log('🚀 ~ params', params);
                                    relVal = params;
                                    var html = '';
                                    if (params.length > 0) {
                                        var Xindex = params[0].dataIndex;
                                        for (var int = 0; int < params.length; int++) {
                                            html +=
                                                params[int].marker +
                                                params[int].name +
                                                ': ' +
                                                Math.ceil(params[int].value[3] / 1000 / 60 / 60 / 24) +
                                                ' 天（' +
                                                getDateTime(new Date(params[int].value[1])) +
                                                '~' +
                                                getDateTime(new Date(params[int].value[2])) +
                                                '）' +
                                                '<br/>';
                                        }
                                    }
                                    return html;
                                }
                            },
                            title: {
                                text: '任务时间统计',
                                // left: 'center'
                                left: 70
                            },
                            grid: {
                                height: categories.length * 30, // 容器宽度
                                x: 70,
                                y: 70,
                                x2: 30
                                // y2: 70

                                // containLabel: true
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    saveAsImage: { show: true }
                                }
                            },
                            // color: colorList,
                            xAxis: [
                                {
                                    min: startTimeAll,
                                    max: endTimeAll,
                                    interval: 3600 * 24 * 1000,
                                    axisLabel: {
                                        show: true,
                                        formatter: function (val) {
                                            let dateTime = new Date(val);
                                            return getXDate(dateTime);
                                        }
                                    }
                                },
                                {
                                    // data: ['2021-03-01', '2021-03-02', '2021-03-03']
                                    min: startTimeAll,
                                    max: endTimeAll,
                                    interval: 3600 * 24 * 1000,
                                    axisLabel: {
                                        show: true,
                                        formatter: function (val) {
                                            let dateTime = new Date(val);
                                            return getXDate(dateTime);
                                        }
                                    }
                                }
                            ],
                            yAxis: {
                                data: categories,
                                splitLine: {
                                    show: true
                                },
                                triggerEvent: true
                            },
                            series: seriesValue
                        };

                        function getdate(time) {
                            let year = time.getFullYear();
                            let month = parseInt(time.getMonth()) + 1;
                            let day = time.getDate();
                            if (month < 10) {
                                month = '0' + month;
                            }
                            if (day < 10) {
                                day = '0' + day;
                            }
                            return year + '-' + month + '-' + day;
                        }

                        // this.initEcharts();
                        // 清除上一次生成的图标数据
                        document.getElementById('bar').innerHTML = '';
                        document.getElementById('bar').removeAttribute('_echarts_instance_');

                        let myEcharts = this.$echarts.init(this.$refs.bar);
                        myEcharts.setOption(this.options, true);

                        this.loading = false;

                        myEcharts.on('click', () => {
                            var data = [];
                            let name = '';
                            relVal.forEach((item) => {
                                name = item.axisValue;

                                let seriesName = item.seriesName;

                                // let stime = getdate(new Date(item.value[1]));
                                // let etime = getdate(new Date(item.value[2]));

                                const start = new Date(new Date(getdate(new Date(item.value[1]))).getTime() - 8 * 60 * 60 * 1000);
                                let stime = getDate(start);

                                const end = new Date(
                                    new Date(getdate(new Date(item.value[2]))).getTime() - 8 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000 - 1
                                );
                                let etime = getDate(end);

                                let obj = { name, seriesName, stime, etime };

                                data.push(obj);
                            });

                            this.dialogVisible = true;
                            this.title = name + '的任务时间详情';

                            let echarts = this.$echarts;

                            let projectList = [];
                            data.forEach((item) => {
                                projectList.push(item.seriesName);
                            });
                            projectList = Array.from(new Set(projectList));

                            let series1 = [];
                            data.forEach((item) => {
                                series1.push(item.seriesName);
                            });
                            series1 = Array.from(new Set(series1));

                            let seriesValue1 = [];
                            // Generate mock data
                            echarts.util.each(projectList, function (seriesName, index) {
                                let cgory = projectList[index];
                                series1.forEach((itemS, indexS) => {
                                    data.forEach((itemj, indexj) => {
                                        if (itemj.seriesName == cgory) {
                                            let data = [];
                                            let task_stime = new Date(itemj.stime).getTime();
                                            let task_etime = new Date(itemj.etime).getTime();
                                            let duration = task_etime - task_stime;
                                            if (itemj.seriesName == itemS) {
                                                data.push({
                                                    name: itemj.seriesName,
                                                    value: [index, task_stime, task_etime, duration],
                                                    itemStyle: {
                                                        // normal: {
                                                        //     //color: '#7b9ce1',
                                                        // }
                                                    }
                                                });
                                                seriesValue1.push({
                                                    name: itemS,
                                                    type: 'custom',
                                                    renderItem: renderItem,
                                                    itemStyle: {
                                                        // normal: {
                                                        opacity: 0.8 // 数据条的透明度
                                                        // }
                                                    },
                                                    encode: {
                                                        x: [1, 2],
                                                        y: 0
                                                    },
                                                    data: data
                                                });
                                            }
                                        }
                                    });
                                });
                            });
                            let colorList1 = [];
                            for (let i = 0; i < series1.length; i++) {
                                colorList1.push(randomColor());
                            }
                            this.options1 = {
                                legend: {
                                    type: 'scroll',
                                    data: projectList,
                                    show: true,
                                    // orient: 'vertical',
                                    align: 'auto',
                                    top: '1%',
                                    right: '2%'
                                },
                                tooltip: {
                                    // formatter: function (params) {
                                    //     return (
                                    //         params.marker +
                                    //         params.name +
                                    //         ': ' +
                                    //         Math.ceil(params.value[3] / 1000 / 60 / 60 / 24) +
                                    //         ' 天（' +
                                    //         getDateTime(new Date(params.value[1])) +
                                    //         '~' +
                                    //         getDateTime(new Date(params.value[2])) +
                                    //         '）'
                                    //     );
                                    // }
                                    trigger: 'axis',
                                    axisPointer: {
                                        // 坐标轴指示器，坐标轴触发有效
                                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                    },
                                    formatter: function (params) {
                                        // console.log('🚀 ~ params', params);
                                        relVal = params;
                                        var html = '';
                                        if (params.length > 0) {
                                            var Xindex = params[0].dataIndex;
                                            for (var int = 0; int < params.length; int++) {
                                                html +=
                                                    params[int].marker +
                                                    params[int].name +
                                                    ': ' +
                                                    Math.ceil(params[int].value[3] / 1000 / 60 / 60 / 24) +
                                                    ' 天（' +
                                                    getDateTime(new Date(params[int].value[1])) +
                                                    '~' +
                                                    getDateTime(new Date(params[int].value[2])) +
                                                    '）' +
                                                    '<br/>';
                                            }
                                        }
                                        return html;
                                    }
                                },
                                title: {
                                    text: name + '的任务时间详情',
                                    // left: 'center'
                                    left: 60
                                },
                                grid: {
                                    height: projectList.length * 45, // 数据条高度
                                    x: 70,
                                    y: 100,
                                    x2: 30
                                    // y2: 70

                                    // containLabel: true
                                },
                                toolbox: {
                                    show: true,
                                    feature: {
                                        saveAsImage: { show: true }
                                    }
                                },
                                // color: colorList1,
                                xAxis: [
                                    {
                                        min: startTimeAll,
                                        max: endTimeAll,
                                        interval: 3600 * 24 * 1000,
                                        axisLabel: {
                                            show: true,
                                            formatter: function (val) {
                                                let dateTime = new Date(val);
                                                return getXDate(dateTime);
                                            }
                                        }
                                    },
                                    {
                                        // data: ['2021-03-01', '2021-03-02', '2021-03-03']
                                        min: startTimeAll,
                                        max: endTimeAll,
                                        interval: 3600 * 24 * 1000,
                                        axisLabel: {
                                            show: true,
                                            formatter: function (val) {
                                                let dateTime = new Date(val);
                                                return getXDate(dateTime);
                                            }
                                        }
                                    }
                                ],
                                yAxis: {
                                    data: projectList,
                                    splitLine: {
                                        show: true
                                    },
                                    triggerEvent: true
                                },
                                series: seriesValue1
                            };
                            this.opens();
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    this.$message.error(err.msg);
                });
        },
        opens() {
            this.$nextTick(() => {
                this.info1();
            });
        },
        info1() {
            // 清除上一次生成的图标数据
            document.getElementById('info').innerHTML = '';
            document.getElementById('info').removeAttribute('_echarts_instance_');

            let myEcharts = this.$echarts.init(this.$refs.info);
            myEcharts.setOption(this.options1, true);
        },
        // 初始化echarts
        initEcharts() {
            // 清除上一次生成的图标数据
            // document.getElementById('info').innerHTML = '';
            // document.getElementById('info').removeAttribute('_echarts_instance_');

            let myEcharts = this.$echarts.init(this.$refs.info);
            myEcharts.setOption(this.options1, true);

            // this.loading = false;

            myEcharts.getZr().on('click', (params) => {
                console.log('🚀 ~ params', params);
                var pointInPixel = [params.offsetX, params.offsetY];

                if (myEcharts.containPixel('grid', pointInPixel)) {
                    console.log('🚀 ~ pointInPixel', pointInPixel);
                    var xIndex = myEcharts.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
                    console.log('🚀 ~ xIndex', xIndex);
                }
            });

            // myEcharts.getZr().on('click', function (event) {
            //     // 没有 target 意味着鼠标/指针不在任何一个图形元素上，它是从“空白处”触发的。
            //     if (!event.target) {
            //         // 点击在了空白处，做些什么。
            //         console.log(event);
            //     }
            // });

            //点击x轴坐标
            // myEcharts.on('click', 'yAxis.category', function (params, node) {
            //     let time = params;
            //     myEcharts.resize();
            //     console.log(time);
            // });
            // let name;
            // 处理点击事件
            // myEcharts.on('click', function (params) {
            //     console.log('🚀 ~ params', params);
            //     name = params.value;
            //     console.log('🚀 ~ name', name);
            //     // // 根据毫秒值获取日期
            //     // function getdate(time) {
            //     //     let year = time.getFullYear();
            //     //     let month = parseInt(time.getMonth()) + 1;
            //     //     let day = time.getDate();
            //     //     if (month < 10) {
            //     //         month = '0' + month;
            //     //     }
            //     //     if (day < 10) {
            //     //         day = '0' + day;
            //     //     }
            //     //     return year + '-' + month + '-' + day;
            //     // }
            //     // console.log(params);
            //     // console.log(params.data);
            //     // console.log(params.data.name);
            //     // let name = params.data.name;
            //     // console.log(params.data.value);
            //     // console.log(getdate(new Date(params.data.value[1])));
            //     // let stime = getdate(new Date(params.data.value[1]));
            //     // console.log(getdate(new Date(params.data.value[2])));
            //     // let etime = getdate(new Date(params.data.value[2]));
            //     // let data = { name, stime, etime };
            //     // console.log('🚀 ~ data', data);
            // });
        },
        getTapdProject() {
            this.$api
                .get_tapd_project()
                .then((res) => {
                    if (res.code == 0) {
                        this.tapdProjectList = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    thhi.$message.error(err.msg);
                });
        },
        // 重置
        onReset() {
            this.params = {
                task_stime: '',
                task_etime: ''
            };
        }
    }
};
</script>
 
<style scoped lang="less">
.bar {
    width: 100%;
    height: 1100px;
    margin: auto;
    margin-top: 10px;
    // margin-bottom: 30px;
}
.info {
    width: 100%;
    height: 350px;
    margin: auto;
    margin-top: 10px;
    // margin-bottom: 30px;
}
.handle-box {
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

.box-card {
    flex: 1;
    .table-title {
        overflow: hidden;
        .select-public {
            float: right;
        }
    }
}
</style>
