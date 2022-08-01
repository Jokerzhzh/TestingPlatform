<template>
    <div>
        <div class="container">

            <!-- <div class="head-box">
                <el-form :model="formSearch" label-width="70px">
                    <el-form-item label="环境站点" class="mr10">
                        <el-input v-model="formSearch.site"></el-input>
                    </el-form-item>
                    <el-form-item label="域名名称" class="mr10">
                        <el-input v-model="formSearch.urlName"></el-input>
                    </el-form-item>
                    <el-form-item label="开启状态" class="mr10">
                        <el-select v-model="formSearch.type" placeholder="请选择">
                            <el-option label="启用" value="启用"></el-option>
                            <el-option label="禁用" value="禁用"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" style="float: left;" @click="handleSearch">搜索</el-button>
                </el-form>
                
            </div> -->

            <div class="handle-box">
                <el-button-group>
                    <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                    >批量删除</el-button>
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        class="handle-del mr10"
                        @click="addHost"
                    >创建</el-button>
                </el-button-group>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                    align="center"
                ></el-table-column>
                <el-table-column label="ID" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                 <el-table-column label="环境名称">
                    <template slot-scope="scope">{{scope.row.env_name}}</template>
                </el-table-column>
                <el-table-column label="环境地址">
                    <template slot-scope="scope">{{scope.row.host}}</template>
                </el-table-column>
                <el-table-column
                    label="执行地址"
                    align="center"
                    width="120"
                >
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status == 1?'success':'danger'">{{scope.row.status == 1 ? '启用' : '禁用'}}</el-tag>
                    </template>
                </el-table-column>

                 <el-table-column label="更新时间" >
                    <template slot-scope="scope">{{scope.row.update_time}}</template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">{{scope.row.create_time}}</template>
                </el-table-column>

                <el-table-column
                    label="删除标志"
                    align="center"
                    width="120"
                >
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.deleted == 1?'success':'danger'">{{scope.row.deleted == 1 ? '启用' : '禁用'}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="primary" 
                            size="mini"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="danger" 
                            size="mini"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
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


        <!-- 创建host -->
        <el-dialog title="创建host" @close="closeHost" custom-class="add-el-dialog" :visible.sync="isAddHost" width="40%">
            <el-form ref="form" :model="formAdd" label-width="70px">
                <el-form-item label="环境名称">
                    <el-input placeholder="环境名称" v-model="formAdd.env_name" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="环境地址">
                    <el-input placeholder="环境地址" v-model="formAdd.host" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="执行地址">
                    <el-select v-model="formAdd.status" placeholder="请选择">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="更新时间">
                    <el-date-picker
                        v-model="formAdd.update_time"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                        v-model="formAdd.create_time"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="isAddHost = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑环境信息弹出框 -->
        <el-dialog title="编辑环境信息" @close="closeHost" custom-class="add-el-dialog" :visible.sync="isEdit" width="40%">
            <el-form ref="form" :model="formEdit" label-width="70px">
                <el-form-item label="环境名称">
                    <el-input placeholder="环境名称" v-model="formEdit.env_name" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="环境地址">
                    <el-input placeholder="环境地址" v-model="formEdit.host" @input="change($event)"></el-input>
                </el-form-item>
                <el-form-item label="执行地址">
                    <el-select v-model="formEdit.status" placeholder="请选择" @input="change($event)">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="更新时间">
                    <el-date-picker
                        v-model="formEdit.update_time"
                        @input="change($event)"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                        v-model="formEdit.create_time"
                        @input="change($event)"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isEdit = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            params :{
                page:1,
                page_size:10,
            },
            formAdd:{}, //创建 host
            tableData: [],
            multipleSelection: [],
            isEdit: false, // 是都显示编辑弹层
            isAddHost:false, // 创建HOST
            pageTotal: 0,
            // formSearch:{}, // 搜索填写信息
            formEdit:{}, // 编辑信息
            listIndex: -1,
            paginationIndex:1, //分页默认 第1页
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.getData();
    },
	mounted() {
        // 绑定enter事件
        // document.addEventListener("keyup", this.enterKey);
	},
	destroyed() {
        // 销毁enter事件
        // document.removeEventListener("keyup", this.enterKey);
	},
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
			// 请求参数
			this.$api.get_host(this.params)
            .then((res) => {
                if (res.code == 0) {
                    this.tableData = res.data;
                    this.pageTotal = res.data.length;
                }else{
                    this.$message.error(res.msg);
                }
            })
            .catch((err) => {
                this.$message.error(res.msg);
            });
        },
        // 添加host 弹出层
        addHost(){
            this.isAddHost = true;
        },
        // 提交 host弹出层
        submitAdd(){
            console.log(this.formAdd,'添加参数')
            this.add_host(this.formAdd);
            this.closeHost();
        },
        // 创建 host 接口
        add_host(e){
            this.$api.add_host(e).then(res => {
                if(res.code == 0){
                    this.$set(this.params, 'page', 1);
                    this.getData();
                    this.$message.success(res.msg);
                }else{
                    this.$message.error(res.msg);
                }
            }).catch(err=> {
                this.$message.error(res.msg);
            });
        },
        // 删除 单条操作
        handleDelete(index, row) {
            let params = [];
            params.push(row.id);
            console.log(row,'删除监听')
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.delete_host(params);
                this.tableData.splice(index, 1);
            })
            .catch(() => {});
        },
		//  批量删除
		delAllSelection() {
			// 获取选中表格的长度
			const length = this.multipleSelection.length;
			// 设置一个空数组
			let str = [];
			// 循环表格的长度，把每个表格的id装进str空数组里
			for (let i = 0; i < length; i++) {
				str.push(this.multipleSelection[i].id);
			}
			// 判断如果有选中（str不为空）执行弹出框
			if(str != ""){
                console.log(str,'删除的项目')
                // 二次确认删除
                this.$confirm('确定要删除这'+length+'条吗？', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    this.delete_host(str);
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});     
				// this.$message.success(`成功删除了${length}条项目`);
			}else{
				this.$message({
                    message: '请选择要删除的项目',
                    type: 'warning'
                });
			}
		},
        // 删除接口
        delete_host(e){
            let params = {
                "ids":e
            }
            this.$api.delete_host(params).then(res => {
                if(res.code == 0){
                    this.$message.success(res.msg);
                    this.$set(this.params, 'page', this.paginationIndex);
                    this.getData(); 
                }else{
                    this.$message.error(res.msg);
                }
            }).catch(err=> {
                this.$message.error(res.msg);
            });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        closeHost(){
            this.isEdit = false;
            this.isAddHost = false;
            this.formEdit = {};
            this.formAdd = {};
        },
        // 重新渲染 input 可编辑操作
        change() {
            this.$forceUpdate();
        },
        // 编辑操作
        handleEdit(index, row) {
            this.listIndex = index;

            this.formEdit.host_id = row.id;
            this.formEdit.env_name = row.env_name;
            this.formEdit.host = row.host;
            this.formEdit.status = row.status == 1?'启用':'禁用'
            this.formEdit.update_time = row.update_time;
            this.formEdit.create_time = row.create_time;
            this.isEdit = true;

            console.log(this.formEdit,'修改前的编辑');
        },
        // 保存编辑
        submitEdit() {
            console.log(this.formEdit,'修改后的编辑');
            this.isEdit = false;

            if(this.formEdit.status == '启用'){
                this.formEdit.status = 1;
            }else{
                this.formEdit.status = 0;
            }

            console.log(this.formEdit,'修改后的编辑11111111111');
            // this.$message.success(`修改第 ${this.listIndex + 1} 行成功`);

            this.modify_host(this.formEdit);

        },
        modify_host(e){
            this.$api.modify_host(e).then(res => {
                if(res.code == 0){
                    // this.$set(this.params, 'page', 1);
                    this.getData();
                    this.$message.success(res.msg);
                }else{
                    this.$message.error(res.msg);
                }
            }).catch(err=> {
                this.$message.error(res.msg);
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.paginationIndex = val;
            this.$set(this.params, 'page', val);
            this.getData();
        },
    }
};
</script>

<style scoped lang="less">

.handle-box {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    div{
        margin-bottom: 10px;
    }
    .el-input{
        width: 200px;
    }
    .el-select{
        width: 150px;
    }
}

.el-form{
    width: 100%;
    overflow: hidden;
}

.add-el-dialog{
    .el-select{
        width: 100%;
    }
    .el-date-editor{
        width: 100%;
    }
}
.head-box {
    .el-form-item{
        margin-bottom: 10px;
        float: left;
    }
    .el-input{
        width: 300px;
    }
    .el-select{
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
