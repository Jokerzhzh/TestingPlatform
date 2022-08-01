<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-button-group>
                    <el-button type="primary" class="handle-del mr10" @click="addUser">设置抽奖人名单</el-button>
                </el-button-group>
            </div>
        </div>
        <!-- 设置抽奖人名单 -->
        <el-dialog title="设置抽奖人名单" @close="closeAddUser" custom-class="add-el-dialog" :visible.sync="isAddUser" width="40%">
            <el-form ref="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-select
                        style="margin-right: 20px"
                        v-model="addData.user_id"
                        collapse-tags
                        filterable
                        :clearable="true"
                        placeholder="请选择人员"
                    >
                        <el-option v-for="item in userList" :key="item.username" :label="item.username" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="一类次数">
                    <el-input placeholder="请输入一等奖抽奖级别" v-model="addData.first_level_num" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="二类次数">
                    <el-input placeholder="请输入二等奖抽奖级别" v-model="addData.second_level_num" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="三类次数">
                    <el-input placeholder="请输入三等奖抽奖级别" v-model="addData.third_level_num" @input="change($event)"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeAddUser">取 消</el-button>
                <el-button type="primary" @click="submitAdd">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            addData: {},
            isAddUser: false, // 添加奖品
            userList: [] // 人员
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.getUsernames();
    },
    methods: {
        // 获取用户名称
        getUsernames() {
            this.$api
                .get_usernames()
                .then((res) => {
                    if (res.code == 0) {
                        this.userList = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 设置抽奖次数
        submitAdd() {
            console.log(this.addData);
            this.$api
                .set_lucky_draw_count(this.addData)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: '设置成功！！！',
                            type: 'success'
                        });
                        this.isAddUser = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 设置抽奖人名单弹窗
        addUser() {
            this.isAddUser = true;
        },
        // 关闭设置抽奖人名单弹窗
        closeAddUser() {
            this.isAddUser = false;
            this.addData = [];
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
</style>
