<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="params.prize_name" placeholder="奖品名称" class="handle-input mr10"></el-input>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-search" class="handle-del mr10" @click="getData">搜索</el-button>
                    <el-button type="primary" @click="onReload" class="handle-del mr10">重置</el-button>
                    <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addPrize">添加奖品</el-button>
                    <el-button type="primary" v-if="is_superuser == true" class="handle-del mr10" @click="emptyPrizeHeat()"
                        >手动清空奖品热度
                    </el-button>
                </el-button-group>
                <el-button-group class="mySet" v-if="is_superuser == true">
                    <el-button type="primary" v-if="mark == 0" class="handle-del mr10" @click="autoEmptyPrizeHeat((flag = 1))">
                        设置自动清空奖品热度
                    </el-button>
                    <el-button type="primary" v-if="mark == 1" class="handle-del mr10" @click="autoEmptyPrizeHeat((flag = 2))">
                        取消自动清空奖品热度
                    </el-button>
                </el-button-group>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" align="center" width="60">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="奖品名称" align="center">
                    <template slot-scope="scope">{{ scope.row.prize_name }}</template>
                </el-table-column>
                <el-table-column label="备注" align="center">
                    <template slot-scope="scope">{{ scope.row.prize_remarks }}</template>
                </el-table-column>
                <el-table-column label="价格" align="center" width="100">
                    <template slot-scope="scope">{{ scope.row.price }}</template>
                </el-table-column>
                <el-table-column label="权重" align="center">
                    <el-table-column label="一类" align="center" width="60">
                        <template slot-scope="scope">{{ scope.row.first_kind_weight }}</template>
                    </el-table-column>
                    <el-table-column label="二类" align="center" width="60">
                        <template slot-scope="scope">{{ scope.row.second_kind_weight }}</template>
                    </el-table-column>
                    <el-table-column label="三类" align="center" width="60">
                        <template slot-scope="scope">{{ scope.row.third_kind_weight }}</template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="奖品热度" align="center" width="100">
                    <template slot-scope="scope">{{ scope.row.prize_heat }}</template>
                </el-table-column>
                <el-table-column prop="date" label="添加时间" align="center" width="160">
                    <template slot-scope="scope">{{ format(scope.row.create_time) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="220" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="modifyPrize(scope.$index, scope.row)">编 辑</el-button>
                        <el-button type="danger" size="mini" @click="deletePrize(scope.row.id)">删 除</el-button>
                        <el-button type="warning" size="mini" @click="prizeVote(scope.row.id)">投 票</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params.page"
                    :page-size="params.page_size"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 添加奖品 -->
        <el-dialog title="添加奖品" @close="closeAddPrize" custom-class="add-el-dialog" :visible.sync="isAddPrize" width="40%">
            <el-form ref="form" label-width="70px">
                <el-form-item label="奖品名称">
                    <el-input placeholder="请输入奖品名称" v-model="prizeData.prize_name" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="奖品价格">
                    <el-input placeholder="请输入奖品价格" v-model="prizeData.price" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="一级权重">
                    <el-input placeholder="请输入一级权重" v-model="prizeData.first_kind_weight" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="二级权重">
                    <el-input placeholder="请输入二级权重" v-model="prizeData.second_kind_weight" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="三级权重">
                    <el-input placeholder="请输入三级权重" v-model="prizeData.third_kind_weight" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="奖品备注">
                    <el-input placeholder="请输入奖品备注" v-model="prizeData.prize_remarks" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="选择图片" prop="file">
                    <input type="file" id="filepicker" accept="image/*" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAddPrize">取 消</el-button>
                <el-button type="primary" @click="submitAdd">提 交</el-button>
            </span>
        </el-dialog>
        <!-- 修改奖品 -->
        <el-dialog title="修改奖品" @close="closeModifyPrize" custom-class="add-el-dialog" :visible.sync="isModifyPrize" width="40%">
            <el-form :model="modifyData" ref="form" label-width="70px">
                <el-form-item label="奖品名称">
                    <el-input placeholder="请输入奖品名称" v-model="modifyData.prize_name" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="奖品价格">
                    <el-input placeholder="请输入奖品价格" v-model="modifyData.price" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="一级权重">
                    <el-input placeholder="请输入一级权重" v-model="modifyData.first_kind_weight" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="二级权重">
                    <el-input placeholder="请输入二级权重" v-model="modifyData.second_kind_weight" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="三级权重">
                    <el-input placeholder="请输入三级权重" v-model="modifyData.third_kind_weight" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="奖品备注">
                    <el-input placeholder="请输入奖品备注" v-model="modifyData.prize_remarks" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="选择图片" prop="file">
                    <input type="file" id="updatePicture" accept="image/*" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeModifyPrize">取 消</el-button>
                <el-button type="primary" @click="submitModify">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            params: {
                page: 1,
                page_size: 10
            },
            pageTotal: 0, // 数据总条数
            paginationIndex: 1, //分页默认 第1页
            tableData: [], // 表格数据
            prizeData: {}, // 添加奖品
            modifyData: {}, // 修改奖品
            voteData: {}, // 投票奖品
            isAddPrize: false, // 添加奖品弹窗
            isModifyPrize: false, // 修改奖品弹窗
            mark: '', // Mark值
            is_superuser: '' // 是否为管理员 true为管理员
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.getData();
        this.getMark();
    },
    mounted() {
        // 绑定enter事件
        document.addEventListener('keyup', this.enterKey);
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener('keyup', this.enterKey);
    },
    computed: {
        format() {
            return (originVal) => {
                const dt = new Date(originVal);

                const y = dt.getFullYear();
                const m = (dt.getMonth() + 1 + '').padStart(2, '0');
                const d = (dt.getDate() + '').padStart(2, '0');

                const hh = (dt.getHours() + '').padStart(2, '0');
                const mm = (dt.getMinutes() + '').padStart(2, '0');
                const ss = (dt.getSeconds() + '').padStart(2, '0');

                return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
            };
        }
    },
    methods: {
        // 查询奖品信息
        getData() {
            this.$api
                .query_prize(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.result;
                        this.pageTotal = res.count;
                        this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.results.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.results.msg);
                });
        },
        // 添加奖品
        submitAdd() {
            let prizeData = new FormData();
            // 奖品名称
            let prize_name = this.prizeData.prize_name;
            prizeData.append('prize_name', prize_name);
            // 奖品价格
            let price = this.prizeData.price;
            prizeData.append('price', price);
            // 一级权重
            let first_kind_weight = this.prizeData.first_kind_weight;
            prizeData.append('first_kind_weight', first_kind_weight);
            // 二级权重
            let second_kind_weight = this.prizeData.second_kind_weight;
            prizeData.append('second_kind_weight', second_kind_weight);
            // 三级权重
            let third_kind_weight = this.prizeData.third_kind_weight;
            prizeData.append('third_kind_weight', third_kind_weight);
            // 奖品备注
            let prize_remarks = this.prizeData.prize_remarks;
            prizeData.append('prize_remarks', prize_remarks);
            // 奖品图片
            let prize_picture = document.getElementById('filepicker').files[0];
            prizeData.append('prize_picture', prize_picture);
            this.$api
                .prize_register(prizeData)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: '添加成功！',
                            type: 'success'
                        });
                        this.getData();
                        this.isAddPrize = false;
                    } else if (res.code == 3) {
                        this.$message({
                            message: '您没有执行该操作的权限！',
                            type: 'error'
                        });
                        this.isAddPrize = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 添加奖品弹窗
        addPrize() {
            this.isAddPrize = true;
        },
        // 关闭添加奖品弹窗
        closeAddPrize() {
            this.isAddPrize = false;
            this.prizeData = [];
        },
        // 删除奖品
        deletePrize(id) {
            let params = {
                ids: [id]
            };
            this.$api
                .delete_prize(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.getData();
                    } else if (res.code == 3) {
                        this.$message({
                            message: '您没有执行该操作的权限！',
                            type: 'error'
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 修改奖品
        submitModify() {
            let modifyData = new FormData();
            // ID
            let id = this.modifyData.id;
            modifyData.append('id', id);
            // 奖品名称
            let prize_name = this.modifyData.prize_name;
            modifyData.append('prize_name', prize_name);
            // 奖品价格
            let price = this.modifyData.price;
            modifyData.append('price', price);
            // 一级权重
            let first_kind_weight = this.modifyData.first_kind_weight;
            modifyData.append('first_kind_weight', first_kind_weight);
            // 二级权重
            let second_kind_weight = this.modifyData.second_kind_weight;
            modifyData.append('second_kind_weight', second_kind_weight);
            // 三级权重
            let third_kind_weight = this.modifyData.third_kind_weight;
            modifyData.append('third_kind_weight', third_kind_weight);
            // 奖品备注
            let prize_remarks = this.modifyData.prize_remarks;
            modifyData.append('prize_remarks', prize_remarks);
            // 奖品图片
            let prize_picture = document.getElementById('updatePicture').files[0];
            modifyData.append('prize_picture', prize_picture);
            this.$api
                .modify_prize(modifyData)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.isModifyPrize = false;
                        this.getData();
                    } else if (res.code == 3) {
                        this.$message({
                            message: '您没有执行该操作的权限！',
                            type: 'error'
                        });
                        this.isModifyPrize = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 修改奖品弹窗
        modifyPrize(index, row) {
            // 执行显示弹出层
            this.isModifyPrize = true;
            // 获取当前的修改的内容项
            this.listIndex = index;
            // 给弹出层内容赋值
            this.modifyData.id = row.id;
            this.modifyData.prize_name = row.prize_name;
            this.modifyData.price = row.price;
            this.modifyData.first_kind_weight = row.first_kind_weight;
            this.modifyData.second_kind_weight = row.second_kind_weight;
            this.modifyData.third_kind_weight = row.third_kind_weight;
            this.modifyData.prize_remarks = row.prize_remarks;
        },
        // 关闭修改奖品弹窗
        closeModifyPrize() {
            this.isModifyPrize = false;
        },
        // 奖品投票
        prizeVote(id) {
            this.voteData.id = id;
            this.$api
                .prize_vote(this.voteData)
                .then((res) => {
                    if (res.msg == '成功') {
                        this.$message({
                            message: '投票成功！',
                            type: 'success'
                        });
                        this.getData();
                    } else if (res.msg == '请勿重复选择!') {
                        this.$message({
                            message: '请勿重复投票!',
                            type: 'error'
                        });
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 手动清空奖品热度
        emptyPrizeHeat() {
            this.$api
                .empty_prize_heat()
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        this.getData();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.results.msg);
                });
        },
        // 查询Mark 根据Mark的值显示，mark == 0 设置自动清空奖品热度/ mark == 1 取消自动清空奖品热度
        getMark() {
            let params = {
                flag: 0
            };
            this.$api
                .auto_empty_prize_heat(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.mark = res.mark;
                        this.is_superuser = res.is_superuser;
                    } else {
                        // this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.results.msg);
                });
        },
        // 设置自动清空奖品热度
        autoEmptyPrizeHeat(flag) {
            let params = {
                flag: flag
            };
            this.$api
                .auto_empty_prize_heat(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        this.getMark();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.results.msg);
                });
        },
        // 全局回车搜索
        enterKey(event) {
            const code = event.keyCode;
            const path = this.$route.path;
            if (code == 13 && path == '/prizeInfo') {
                this.getData();
            }
        },
        // 重置按钮
        onReload() {
            this.params.prize_name = '';
            this.getData();
        },
        // 重新渲染 input 可编辑操作
        change() {
            this.$forceUpdate();
        },
        // 分页导航
        handlePageChange(val) {
            this.paginationIndex = val;
            this.$set(this.params, 'page', val);
            this.getData();
        }
    }
};
</script>
<style scoped lang="less">
.handle-box {
    margin-bottom: 10px;
    .el-input {
        width: 200px;
    }
    .el-select {
        width: 150px;
    }
}
.el-form {
    width: 100%;
    overflow: hidden;
}

.add-el-dialog {
    .el-select {
        width: 100%;
    }
    .el-date-editor {
        width: 100%;
    }
}
.head-box {
    .el-form-item {
        margin-bottom: 10px;
        float: left;
    }
    .el-input {
        width: 300px;
    }
    .el-select {
        width: 120px;
    }
}

.handle-select {
    width: 120px;
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
.mySet {
    margin-left: -10px;
}
</style>
