<template>
    <div class="body">
        <el-card class="box-card">
            <div class="info">
                <span class="cycle">本期: {{ this.cycle }}</span>
                <el-table :data="prizesInfoList" border class="table" ref="table" max-height="350px" header-cell-class-name="table-header">
                    <el-table-column label="本 期 获 奖 名 单" align="center">
                        <el-table-column label="获 奖 人" align="center" width="150px">
                            <template slot-scope="scope">{{ scope.row.username }}</template>
                        </el-table-column>
                        <el-table-column label="奖 品" align="center" width="150px">
                            <template slot-scope="scope">{{ scope.row.prize_name }}</template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
            <div class="box-card1">
                <LuckyWheel
                    class="luckyWheel"
                    ref="LuckyWheel"
                    width="400px"
                    height="400px"
                    :prizes="prizes"
                    :default-style="defaultStyle"
                    :blocks="blocks"
                    :buttons="buttons"
                    @start="winPrizes"
                    @end="endCallBack"
                />
            </div>
            <div class="myLuckyDraw">
                <p>
                    <span class="username">{{ this.username }}</span> 的抽奖次数:
                </p>

                <p>一级: {{ this.myLuckyDrawList.first_level_num }}次</p>
                <p>二级: {{ this.myLuckyDrawList.second_level_num }}次</p>
                <p>三级: {{ this.myLuckyDrawList.third_level_num }}次</p>
            </div>
        </el-card>
        <!-- 展示奖品 -->
        <el-dialog title="恭喜您获得" @close="closeShow" custom-class="my-prize-dialog" :visible.sync="isShow" width="40%">
            <div class="myPrize" align="center">{{ this.myPrize }}</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closeShow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '', // 用户名称
            cycle: '', // 期数
            prizes: [], // 奖品列表
            heatPrizeList: [], // 热度奖品列表
            tableData: [], // 表格数据
            prizesInfoList: [], // 获奖人员信息
            winPrize: '', // 抽到的奖品名称
            myLuckyDrawList: [], // 我的抽奖次数信息
            isShow: false,
            myPrize: '',
            defaultStyle: {
                fontColor: '#d64737',
                fontSize: '14px'
            },
            blocks: [
                {
                    padding: '13px',
                    // background: '#d64737'
                    background: '#fff'
                    // imgs: [{ src: require('../../assets/img/background.png'), width: '115%', top: '-15px', rotate: true }]
                }
            ],
            buttons: [
                { radius: '50px', background: '#3f5c6d2c' },
                { radius: '45px', background: '#fff' },
                { radius: '41px', background: '#fff', pointer: true },
                {
                    radius: '35px',
                    background: '#3f5c6d2c',
                    imgs: [{ src: require('../../assets/img/Go.png'), width: '65%', top: '-50%' }]
                }
            ]
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.getHeatPrize();
        this.myLuckyDraw();
    },
    mounted() {
        // this.tableScroll();
    },
    methods: {
        // 查询我的抽奖次数
        myLuckyDraw() {
            this.$api
                .my_lucky_draw()
                .then((res) => {
                    if (res.msg == '您还没有抽奖资格,请继续努力!') {
                        this.myLuckyDrawList.first_level_num = 0;
                        this.myLuckyDrawList.second_level_num = 0;
                        this.myLuckyDrawList.third_level_num = 0;
                        this.username = res.result.user;
                    } else if (res.code == 0) {
                        this.myLuckyDrawList = res.result;
                        this.username = res.result.user;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 获取抽奖人和奖品信息
        winnersPrizesInfo() {
            let params = {
                cycle: ''
            };
            params.cycle = this.cycle;
            this.$api
                .winners_prizes_info(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.prizesInfoList = res.result;
                        this.tableScroll();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 获取热度奖品
        getHeatPrize() {
            this.$api
                .get_heat_prize()
                .then((res) => {
                    if (res.code == 0) {
                        this.heatPrizeList = res.result;
                        this.cycle = res.cycle;
                        this.getPrizesList();
                        this.winnersPrizesInfo();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 把热度奖品信息遍历到转盘上
        getPrizesList() {
            const prizes = [];
            this.heatPrizeList.forEach((item, index) => {
                prizes.push({
                    title: item.prize_name,
                    background: index % 2 ? '#D3D3D3' : '#F5F5F5',
                    fonts: [
                        {
                            text: item.prize_name,
                            top: '10%',
                            fontColor: 'red'
                        }
                    ],
                    imgs: [
                        {
                            src: item.prize_picture,
                            top: '35%',
                            width: '50px',
                            height: '50px'
                        }
                    ]
                });
            });
            this.prizes = prizes;
        },
        // 抽取奖品
        winPrizes() {
            let params = {
                cycle: '',
                data: []
            };
            params.cycle = this.cycle;
            params.data = this.heatPrizeList;
            this.$api
                .win_prizes(params)
                .then((res) => {
                    if (res.code == 3) {
                        this.$message.error(res.msg);
                    } else if (res.code == 0) {
                        this.winPrize = res.result.prize_name;
                        let prizeList = new Array();
                        this.heatPrizeList.forEach((item, i) => {
                            prizeList[i] = item.prize_name;
                        });
                        // 获取抽到的奖品在奖品列表中的 索引值
                        var winPrizeIndex = prizeList.indexOf(this.winPrize);
                        // 转盘开始转动
                        this.$refs.LuckyWheel.play();
                        setTimeout(() => {
                            // 根据索引 确定转盘指针的指向
                            this.$refs.LuckyWheel.stop(winPrizeIndex);
                        }, 3000);
                        // 刷新抽奖次数
                        this.myLuckyDraw();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 转盘停止时显示奖品信息
        endCallBack(prize) {
            // 打开获奖弹窗
            this.isShow = true;
            // alert(`恭喜你获得${prize.title}`);
            this.myPrize = prize.title;
            // 刷新获奖人名单
            this.winnersPrizesInfo();
        },
        // 关闭获奖弹窗
        closeShow() {
            this.isShow = false;
        },
        // 设置获奖名单自动滚动
        tableScroll() {
            // 拿到表格挂载后的真实DOM
            const table = this.$refs.table;
            // 拿到表格中承载数据的div元素
            const divData = table.bodyWrapper;
            // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
            setInterval(() => {
                // 元素自增距离顶部1像素
                divData.scrollTop += 1;
                // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
                if (divData.clientHeight + divData.scrollTop + 1 > divData.scrollHeight) {
                    // 重置table距离顶部距离
                    divData.scrollTop = 0;
                    // 滚动到最底部后执行刷新表格的方法
                    // this.winnersPrizesInfo();
                }
            }, 50);
            const that = this;
            window.onresize = () => {
                return (() => {
                    window.screenHeight = document.body.clientHeight;
                    that.clientHeight = window.screenHeight;
                })();
            };
        }
    }
};
</script>
<style scoped lang="less">
.box-card {
    width: 100%;
    height: 605px;
    background: url('../../assets/img/bj.jpg') center no-repeat;
    background-size: 100% auto;
    background-repeat: repeat;
}

.box-card1 {
    width: 500px;
    height: 440px;
    margin-top: -440px;
    margin-left: 390px;
}
.info {
    width: 440px;
    height: 440px;
    margin-top: 50px;
    margin-left: 40px;
}
.table {
    width: 301px;
    font-size: 14px;
    height: 500px;
}
.luckyWheel {
    margin: auto;
    width: 500px;
    height: 500px;
    /* margin-top: 50px; */
}
.el-tag {
    font-size: 14px;
    margin-left: 10px;
    margin-top: 10px;
}
.myLuckyDraw {
    margin-top: -400px;
    margin-left: 900px;
    line-height: 25px;
}
.cycle {
    margin-left: 20px;
}
.myPrize {
    align-content: center;
    font-weight: bold;
}
.username {
    font-weight: bold;
}
/deep/.el-dialog {
    width: 400px !important;
}
/deep/.el-dialog__body {
    // margin-left: 125px !important;
    font-size: 25px;
}
/*最外层透明*/
/deep/ .el-table,
/deep/ .el-table__expanded-cell {
    background-color: transparent;
}
/* 表格内背景颜色 */
/deep/ .el-table th,
/deep/ .el-table tr,
/deep/ .el-table td {
    // #3f5c6d2c 半透明颜色
    // transparent 完全透明
    background-color: transparent !important;
}
/* 去掉中间数据的分割线 */
/deep/.el-table__row > td {
    border: none;
}
/* 去掉表格上面和表头的线 */
/deep/.el-table th {
    border: none;
}
/* 去掉最表格下面的那一条线 */
.el-table::before {
    height: 0px;
}
// 表格最外边框
.el-table--border,
.el-table--group {
    border: none;
}
// 删除表格最右侧的表格线
.el-table--border::after,
.el-table--group::after {
    width: 0px;
    height: 0px;
}

// 只修改滚动条 + 不设置滚动条的滑块 = 隐藏滚动条
// 修改表格的滚动条
/deep/.el-table__body-wrapper::-webkit-scrollbar {
    // 设置滚动条的高度
    width: 10px;
    // 设置滚动条的宽度
    height: 10px;
}
// // 设置滚动条的滑块
/deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {
    // 设置滑块的颜色
    // background-color: #999ca534;
    background-color: #e1e5f134;
    // 设置滑块的边界半径
    border-radius: 10px;
}
</style>