<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    ref="select3"
                    @visible-change="changeFocus3"
                    v-model="formData1.type_id"
                    filterable
                    @input="change($event)"
                    placeholder="请选择分类"
                    class="handle-select mr10"
                >
                    <el-option v-for="item in typeInfoName" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
                </el-select>
                <el-input v-model="formData1.name" placeholder="文件名称" class="handle-input mr10"></el-input>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-search" class="handle-del mr10" @click="queryData">搜索</el-button>
                    <el-button type="primary" @click="onReload" class="handle-del mr10">重置</el-button>
                </el-button-group>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-upload2" class="handle-del mr10" @click="addFile">上传文件</el-button>
                    <el-button type="primary" icon="el-icon-reading" class="handle-del mr10" @click="readHistory">浏览记录</el-button>
                    <el-button type="primary" icon="el-icon-collection-tag" class="handle-del mr10" @click="isCollectionFile"
                        >我的收藏</el-button
                    >
                    <el-button type="primary" icon="el-icon-download" class="handle-del mr10" @click="isDownloadFile">我的下载</el-button>
                    <el-button type="primary" icon="el-icon-user" class="handle-del mr10" @click="isUploadFile">我的文件</el-button>
                    <!-- <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="isUpdate">创建文章</el-button> -->
                </el-button-group>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="文档名称" align="center">
                    <template slot-scope="scope">
                        <!-- {{ scope.row.file_name }} -->
                        <div class="file-name" @click="readFile(scope.row.id, scope.row.s3_addr)">
                            {{ scope.row.file_name }}
                        </div>
                        <!-- 文字链接 -->
                        <!-- <el-link @click="readFile(scope.row.id, scope.row.s3_addr)">{{ scope.row.file_name }}</el-link> -->
                    </template>
                </el-table-column>
                <el-table-column label="文档描述" align="center">
                    <template slot-scope="scope">{{ scope.row.file_desc }}</template>
                </el-table-column>
                <el-table-column label="文档大小" width="110" align="center">
                    <template slot-scope="scope">{{ scope.row.file_size }}KB</template>
                </el-table-column>
                <el-table-column label="上传人员" width="100" align="center">
                    <template slot-scope="scope">{{ scope.row.file_up_user }}</template>
                </el-table-column>
                <!-- <el-table-column label="浏览次数" width="100" align="center">
                    <template slot-scope="scope">{{ scope.row.read_sum }}</template>
                </el-table-column> -->
                <el-table-column label="下载次数" width="100" align="center">
                    <template slot-scope="scope">{{ scope.row.download_sum }}</template>
                </el-table-column>
                <el-table-column prop="date" label="上传时间" align="center">
                    <template slot-scope="scope">{{ format(scope.row.file_up_time) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right" align="center">
                    <template slot-scope="scope">
                        <!-- <el-tooltip class="item" effect="dark" content="预览" placement="top">
                            <el-button
                                icon="el-icon-caret-right"
                                type="primary"
                                circle
                                @click="readFile(scope.row.id, scope.row.s3_addr)"
                            ></el-button>
                        </el-tooltip> -->
                        <!-- <div>
                            @click="download(scope.row.id, scope.row.s3_addr)"
                            <a href="https://jtmm.s3.cn-north-1.amazonaws.com.cn/2021/09/972167192E18486AA0F635C25319A088.pdf">下 载</a>
                        </div> -->
                        <el-tooltip class="item" effect="dark" content="下载" placement="top">
                            <el-button icon="el-icon-download" circle @click="download(scope.row.id)">
                                <!-- <a href="https://jtmm.s3.cn-north-1.amazonaws.com.cn/2021/09/CBBCBF210BB54DAA87276AA3F27AF1B6.mp4"></a> -->
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="收藏" placement="top">
                            <el-button
                                type="warning"
                                icon="el-icon-star-off"
                                circle
                                @click="collectionFile(scope.row.id, (collection = 1))"
                            ></el-button>
                        </el-tooltip>
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
        <!-- 上传文件 -->
        <el-dialog title="上传文件" @close="closeHost" custom-class="add-el-dialog" :visible.sync="isAddFile" width="40%">
            <el-form ref="form" :model="formData" label-width="70px">
                <el-form-item label="选择文件" prop="file">
                    <input type="file" id="filepicker" accept="" @change="chooseVideoInput" class="uploadVideo_input" />
                </el-form-item>
                <el-form-item label="一级类目">
                    <el-select
                        ref="select1"
                        @visible-change="changeFocus1"
                        v-model="formData.category_name"
                        filterable
                        @change="changeFirstCategoryName"
                        placeholder="请选择一级类目"
                        class="handle-select mr10"
                    >
                        <el-option
                            v-for="item in firstCategoryName"
                            :key="item.id"
                            :label="item.category_name"
                            :value="item.category_name"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级类目">
                    <el-select
                        ref="select2"
                        @visible-change="changeFocus2"
                        v-model="formData.type"
                        filterable
                        @input="change($event)"
                        placeholder="请选择二级类目"
                        class="handle-select mr10"
                    >
                        <el-option v-for="item in secondCategoryName" :key="item.id" :label="item.type_name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文档描述">
                    <el-input placeholder="请输入文档描述" v-model="formData.file_desc" @input="change($event)"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isAddFile = false">取 消</el-button>
                <el-button type="primary" :disabled="isDisabled" @click="submitAdd">提 交</el-button>
            </span>
        </el-dialog>
        <!-- 浏览记录 -->
        <el-dialog title="浏览记录" @close="closeReadHistory" custom-class="add-el-dialog" :visible.sync="isReadHistory" width="70%">
            <el-table :data="readFileName" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="文档名称" align="center">
                    <template slot-scope="scope">
                        <div class="file-name" @click="readFile(scope.row.id, scope.row.s3_addr)">
                            {{ scope.row.file_name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="文档描述" align="center">
                    <template slot-scope="scope">{{ scope.row.file_desc }}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right" align="center">
                    <template slot-scope="scope">
                        <!-- <el-tooltip class="item" effect="dark" content="预览" placement="top">
                            <el-button
                                icon="el-icon-caret-right"
                                type="primary"
                                circle
                                @click="readFile(scope.row.id, scope.row.s3_addr)"
                            ></el-button>
                        </el-tooltip> -->
                        <el-tooltip class="item" effect="dark" content="收藏" placement="top">
                            <el-button
                                type="warning"
                                icon="el-icon-star-off"
                                circle
                                @click="collectionFile(scope.row.id, (collection = 1))"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params1.page"
                    :page-size="params1.page_size"
                    :total="pageTotal1"
                    @current-change="handleHistoryPageChange"
                ></el-pagination>
            </div>
        </el-dialog>
        <!-- 我的收藏 -->
        <el-dialog title="我的收藏" @close="closeCollectionFile" custom-class="add-el-dialog" :visible.sync="isCollection" width="70%">
            <el-table :data="collectionFileName" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="文档名称" align="center">
                    <template slot-scope="scope">
                        <div class="file-name" @click="readFile(scope.row.id, scope.row.s3_addr)">
                            {{ scope.row.file_name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="文档描述" align="center">
                    <template slot-scope="scope">{{ scope.row.file_desc }}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right" align="center">
                    <template slot-scope="scope">
                        <!-- <el-tooltip class="item" effect="dark" content="预览" placement="top">
                            <el-button
                                icon="el-icon-caret-right"
                                type="primary"
                                circle
                                @click="readFile(scope.row.id, scope.row.s3_addr)"
                            ></el-button>
                        </el-tooltip> -->
                        <el-tooltip class="item" effect="dark" content="取消收藏" placement="top">
                            <el-button
                                icon="el-icon-star-on"
                                type="warning"
                                circle
                                @click="collectionFile(scope.row.id, (collection = 0))"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params2.page"
                    :page-size="params2.page_size"
                    :total="pageTotal2"
                    @current-change="handleCollectionPageChange"
                ></el-pagination>
            </div>
        </el-dialog>
        <!-- 我的下载 -->
        <el-dialog title="我的下载" @close="closeDownloadFile" custom-class="add-el-dialog" :visible.sync="isDownload" width="70%">
            <el-table :data="downloadFileName" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="文档名称" align="center">
                    <template slot-scope="scope">
                        <div class="file-name" @click="readFile(scope.row.id, scope.row.s3_addr)">
                            {{ scope.row.file_name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="文档描述" align="center">
                    <template slot-scope="scope">{{ scope.row.file_desc }}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right" align="center">
                    <template slot-scope="scope">
                        <!-- <el-tooltip class="item" effect="dark" content="预览" placement="top">
                            <el-button
                                icon="el-icon-caret-right"
                                type="primary"
                                circle
                                @click="readFile(scope.row.id, scope.row.s3_addr)"
                            ></el-button>
                        </el-tooltip> -->
                        <el-tooltip class="item" effect="dark" content="收藏" placement="top">
                            <el-button
                                type="warning"
                                icon="el-icon-star-off"
                                circle
                                @click="collectionFile(scope.row.id, (collection = 1))"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params3.page"
                    :page-size="params3.page_size"
                    :total="pageTotal3"
                    @current-change="handleDownloadPageChange"
                ></el-pagination>
            </div>
        </el-dialog>
        <!-- 我的文件 -->
        <el-dialog title="我的文件" @close="closeUploadFile" custom-class="add-el-dialog" :visible.sync="isUpload" width="70%">
            <el-table :data="uploadFileName" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" width="66" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="文档名称" align="center">
                    <template slot-scope="scope">
                        <div class="file-name" @click="readFile(scope.row.id, scope.row.s3_addr)">
                            {{ scope.row.file_name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="文档描述" align="center">
                    <template slot-scope="scope">{{ scope.row.file_desc }}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right" align="center">
                    <template slot-scope="scope">
                        <!-- <el-tooltip class="item" effect="dark" content="预览" placement="top">
                            <el-button
                                icon="el-icon-caret-right"
                                type="primary"
                                circle
                                @click="readFile(scope.row.id, scope.row.s3_addr)"
                            ></el-button>
                        </el-tooltip> -->
                        <el-tooltip class="item" effect="dark" content="收藏" placement="top">
                            <el-button
                                type="warning"
                                icon="el-icon-star-off"
                                circle
                                @click="collectionFile(scope.row.id, (collection = 1))"
                            ></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <el-button icon="el-icon-delete" type="danger" circle @click="deleteVideoOrFile(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next,jumper"
                    :current-page="params4.page"
                    :page-size="params4.page_size"
                    :total="pageTotal4"
                    @current-change="handleUplpadPageChange"
                ></el-pagination>
            </div>
        </el-dialog>
        <!-- 创建文章 -->
        <el-dialog title="创建文章" @close="closeUpdata" custom-class="add-el-dialog" :visible.sync="isEstablish" width="60%">
            <el-form ref="form" :model="updateData" label-width="70px">
                <el-card class="box-card">
                    <el-form-item label="文件名称">
                        <div class="box-line" style="margin-bottom: 10px">
                            <input
                                type="text"
                                placeholder="请输入文件名称"
                                v-model="updateData.file_name"
                                class="project-input"
                                style="width: 80%"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item label="文件内容">
                        <div ref="wangeditor" id="wangeditor"></div>
                    </el-form-item>
                    <el-form-item label="一级类目">
                        <el-select
                            ref="select1"
                            @visible-change="changeFocus1"
                            v-model="formData.category_name"
                            filterable
                            @change="changeFirstCategoryName"
                            placeholder="请选择一级类目"
                            class="handle-select mr10"
                        >
                            <el-option
                                v-for="item in firstCategoryName"
                                :key="item.id"
                                :label="item.category_name"
                                :value="item.category_name"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="二级类目">
                        <el-select
                            ref="select2"
                            @visible-change="changeFocus2"
                            v-model="updateData.type"
                            filterable
                            @input="change($event)"
                            placeholder="请选择二级类目"
                            class="handle-select mr10"
                        >
                            <el-option
                                v-for="item in secondCategoryName"
                                :key="item.id"
                                :label="item.type_name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文档描述">
                        <el-input placeholder="请输入文档描述" v-model="updateData.file_desc" @input="change($event)"></el-input>
                    </el-form-item>
                </el-card>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isEstablish = false">取 消</el-button>
                <el-button type="primary" @click="createFile">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import E from 'wangeditor';
// 1.引入动画组件
import { Loading } from 'element-ui';
export default {
    name: 'basetable',
    data() {
        return {
            params: {
                page: 1,
                page_size: 10
            },
            params1: {
                page: 1,
                page_size: 10
            },
            params2: {
                page: 1,
                page_size: 10
            },
            params3: {
                page: 1,
                page_size: 10
            },
            params4: {
                page: 1,
                page_size: 10
            },
            formData1: {
                type: 0, // 0=文件查询；1=视频查询
                name: '', // 视频或文件名称
                type_id: '' // 二级分类
            },
            deleteDate: {
                id: '', // 需要删除的id
                type: '' // 视频：type=1 文件：type=0
            },
            updateData: {
                content: '',
                type: '',
                file_desc: '',
                file_name: ''
            },
            tableData: [], // 列表数据
            formData: {},
            updateData: {},
            firstCategoryName: [], // 一级类目列表
            secondCategoryName: [], // 二级类目列表
            typeInfoName: [], // 全部的二级分类列表
            readFileName: [], // 浏览记录列表
            collectionFileName: [], // 我的收藏列表
            downloadFileName: [], // 我的下载列表
            uploadFileName: [], // 我的文件列表
            isAddFile: false, // 上传文件
            isReadHistory: false, // 浏览历史
            isCollection: false, // 收藏记录
            isDownload: false, // 我的下载
            isUpload: false, // 我的文件
            isEstablish: false, // 创建文章
            isDisabled: false,
            pageTotal: 0,
            pageTotal1: 0,
            pageTotal2: 0,
            pageTotal3: 0,
            pageTotal4: 0,
            paginationIndex: 1, //分页默认 第1页
            paginationIndex1: 1, //分页默认 第1页
            paginationIndex2: 1, //分页默认 第1页
            paginationIndex3: 1, //分页默认 第1页
            paginationIndex4: 1, //分页默认 第1页
            editor: null, // 富文本对象
            editorContent: '', // 富文本内容
            content_img: [], // 图片src集合
            // 2.定义实例
            loadingInstance: null
        };
    },
    created() {
        console.log('初次进入页面渲染接口数据');
        this.getData();
        this.getFirstCategory();
        this.getTypeInfo();
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
    watch: {
        isEstablish(val) {
            if (val && !this.editor) {
                setTimeout(() => {
                    // 新增上传文件的富文本编辑器
                    this.editor = new E(this.$refs.wangeditor);
                    this.editor.config.uploadImgShowBase64 = true;
                    this.editor.config.placeholder = '请输入文件内容';
                    // 编辑器的事件，每次改变会获取其html内容
                    this.editor.config.onchange = (html) => {
                        this.content_img = this.getSrc(html);
                        let textJson = this.editor.txt.getJSON();
                        this.updateData.content = '';
                        textJson.forEach((item) => {
                            if (item.tag == 'p' && typeof item.children[0] == 'string') {
                                this.updateData.content = this.updateData.content
                                    ? this.updateData.content + '\n\n' + item.children[0]
                                    : item.children[0];
                            }
                        });
                    };

                    // this.editor.config.linkImgCallback = (src, alt, href) => {
                    //     console.log('图片 src ', src);
                    // };
                    this.editor.config.menus = [
                        'image', // 插入图片
                        'undo', // 撤销
                        'redo' // 重复
                    ];
                    this.editor.create(); // 创建富文本实例
                }, 0);
            } else if (!val && this.editor) {
                this.editor.destroy();
                this.editor = null;
            }
        }
    },
    methods: {
        // 创建文章 提交
        createFile() {
            let formData = new FormData();
            // console.log(this.updateData.type);
            // console.log(this.updateData.file_desc);
            // console.log(this.updateData.file_name);
            // console.log(this.editor);
            let type = this.updateData.type;
            formData.append('type', type);
            let file_desc = this.updateData.file_desc;
            formData.append('file_desc', file_desc);
            let file_name = this.updateData.file_name;
            formData.append('file_name', file_name);
            let content = this.updateData.content;
            formData.append('content', content);
            formData.append('content_img', JSON.stringify(this.content_img));
            console.log(formData);
            this.$api
                .create_file(formData)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: '创建成功!',
                            type: 'success'
                        });
                        this.isEstablish = false;
                        this.getData();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        /**
         * 取出区域内所有img的src
         * @param {String} html html字符串
         */
        getSrc(html) {
            var imgReg = /<img.*?(?:>|\/>)/gi;
            // 匹配src属性
            var srcReg = /src=[\\"]?([^\\"]*)[\\"]?/i;
            var arr = html.match(imgReg);
            let imgs = [];
            if (arr) {
                for (let i = 0; i < arr.length; i++) {
                    var src = arr[i].match(srcReg)[1];
                    imgs.push(src);
                }
            }
            return imgs;
        },
        // 获取文件信息
        getData() {
            this.$api
                .get_fileinfo(this.params)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.result;
                        this.pageTotal = res.count;
                        this.params.page_size = res.results.page_size;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 获取一级类目信息
        getFirstCategory() {
            this.$api
                .first_category({})
                .then((res) => {
                    if (res.code == 0) {
                        this.firstCategoryName = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.result.msg);
                });
        },
        // 列表选择一级类目名称监听
        changeFirstCategoryName(e) {
            this.$delete(this.params, 'category_name');
            this.formData.category_name = e;
            let id;
            this.firstCategoryName.forEach((item) => {
                if (e == item.category_name) {
                    id = item.id;
                }
            });
            this.getSecondCategory(id);
        },
        // 获取二级类目信息
        getSecondCategory(id) {
            this.$api
                .second_category({ id })
                .then((res) => {
                    if (res.code == 0) {
                        this.secondCategoryName = res.result;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 获取全部的二级分类
        getTypeInfo() {
            this.$api
                .get_type_info()
                .then((res) => {
                    if (res.code == 0) {
                        this.typeInfoName = res.result;
                    } else {
                        this.$message.erroe(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 监听选择文件信息
        chooseVideoInput(event) {
            var files = document.getElementById('filepicker').files[0];
            var url = URL.createObjectURL(files);
            // this.video_url = url;
        },
        // 上传文件 弹出层
        addFile() {
            this.isAddFile = true;
        },
        // 浏览记录 弹出层
        readHistory() {
            this.isReadHistory = true;
            this.myReadFile();
        },
        // 我的收藏 弹出层
        isCollectionFile() {
            this.isCollection = true;
            this.myCollectionFile();
        },
        // 我的下载 弹出层
        isDownloadFile() {
            this.isDownload = true;
            this.myDownloadFile();
        },
        // 我的文件 弹出层
        isUploadFile() {
            this.isUpload = true;
            this.myUploadFile();
        },
        // 创建文章 弹窗
        isUpdate() {
            this.isEstablish = true;
        },
        // 关闭创建弹窗
        closeUpdata() {
            this.isEstablish = false;
            this.secondCategoryName = [];
            this.updateData = {};
            this.formData = {};
        },
        // 关闭我的收藏弹窗
        closeCollectionFile() {
            this.isCollection = false;
        },
        // 关闭我的下载弹窗
        closeDownloadFile() {
            this.isDownload = false;
        },
        // 关闭我的文件弹窗
        closeUploadFile() {
            this.isUpload = false;
        },
        // 关闭播放历史弹窗
        closeReadHistory() {
            this.isReadHistory = false;
        },
        readFile(id, s3_addr) {
            // console.log(id);
            // console.log(s3_addr);
            // this.downloadSumFile(id);
            this.getFileAddr(id);
            window.open(s3_addr);
        },
        // 提交 上传弹出层
        submitAdd() {
            let formData = new FormData();
            // 获取选择的文件信息
            let file = document.getElementById('filepicker').files[0];
            formData.append('file', file);
            let type = this.formData.type;
            formData.append('type', type);
            let file_desc = this.formData.file_desc;
            formData.append('file_desc', file_desc);
            this.isDisabled = true;
            // 3. 生成动画
            this.loadingInstance = Loading.service({
                // 动画中的文字
                text: '正在上传',
                // 要加载动画的容器-上传弹窗
                target: '.el-dialog'
            });
            this.$api
                .file_upload(formData)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message({
                            message: '上传成功',
                            type: 'success'
                        });
                        this.closeHost();
                        this.getData();
                        // 4. 请求完成后关闭动画
                        this.loadingInstance.close();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        closeHost() {
            this.isAddFile = false;
            this.formData = {};
            this.isDisabled = false;
        },
        // 获取S3上文件地址
        getFileAddr(id) {
            this.$api
                .get_file_addr({ id })
                .then((res) => {
                    if (res.code == 0) {
                        // this.$message.success(res.result[0].s3_addr);
                        // this.file_url = res.result[0].s3_addr;
                        this.getData();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 我阅读过的文件
        myReadFile() {
            this.$api
                .my_read_file(this.params1)
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.error(res.msg);
                    } else if (res.results.code == 0) {
                        this.readFileName = res.results.result;
                        this.pageTotal1 = res.count;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 我收藏的文件
        myCollectionFile() {
            this.$api
                .my_collection_file(this.params2)
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.error(res.msg);
                        this.collectionFileName = [];
                    } else if (res.results.code == 0) {
                        this.collectionFileName = res.results.result;
                        this.pageTotal2 = res.count;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 收藏/取消收藏 1-收藏/0-取消收藏
        collectionFile(id, collection) {
            this.formData.id = id;
            this.formData.collection = collection;
            this.$api
                .collection_file(this.formData)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        this.myCollectionFile();
                    } else {
                        this.$message.success(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 我下载的文件
        myDownloadFile() {
            this.$api
                .my_download_file(this.params3)
                .then((res) => {
                    if (res.code == 1) {
                        this.$message.error(res.msg);
                        // this.collectionFileName = [];
                    } else if (res.results.code == 0) {
                        this.downloadFileName = res.results.result;
                        this.pageTotal3 = res.count;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 删除我的视频
        deleteVideoOrFile(id) {
            this.deleteDate.id = id;
            this.deleteDate.type = 0;
            this.$api
                .delete_video_or_file(this.deleteDate)
                .then((res) => {
                    if (res.code == 0) {
                        this.$message.success(res.msg);
                        this.getData();
                        this.myUploadFile();
                    } else {
                        this.$message.erroe(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 我的文件
        myUploadFile() {
            this.$api
                .my_upload_file(this.params4)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.uploadFileName = res.results.result;
                        this.pageTotal4 = res.count;
                    } else {
                        this.$message.success(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 下载视频
        download(id) {
            this.tableData.forEach((item) => {
                if (item.id == id) {
                    this.s3_addr = item.s3_addr;
                    this.file_name = item.file_name;
                }
            });
            fetch(this.s3_addr)
                .then((res) => res.blob())
                .then((blob) => {
                    const a = document.createElement('a');
                    document.body.appendChild(a);
                    a.style.display = 'none';
                    const url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = this.file_name;
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                });
            this.downloadSumFile(id);
        },
        // 获取文件下载次数
        downloadSumFile(id) {
            this.$api
                .download_sum_file({ id })
                .then((res) => {
                    if (res.code == 0) {
                        // this.$message.success(res.msg);
                        this.getData();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 全局回车搜索
        enterKey(event) {
            const code = event.keyCode;
            const path = this.$route.path;
            if (code == 13 && path == '/testKnowledgeFile') {
                this.queryData();
            }
        },
        // 数据查询
        queryData() {
            this.$api
                .query_data(this.formData1)
                .then((res) => {
                    if (res.results.code == 0) {
                        this.tableData = res.results.result;
                        this.pageTotal = res.count;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.$message.error(res.msg);
                });
        },
        // 重置按钮
        onReload() {
            this.formData1.type_id = '';
            this.formData1.name = '';
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
        },
        // 浏览记录的分页导航
        handleHistoryPageChange(val) {
            this.paginationIndex1 = val;
            this.$set(this.params1, 'page', val);
            this.myReadFile();
        },
        // 我的收藏的分页导航
        handleCollectionPageChange(val) {
            this.paginationIndex2 = val;
            this.$set(this.params2, 'page', val);
            this.myCollectionFile();
        },
        // 我的下载的分页导航
        handleDownloadPageChange(val) {
            this.paginationIndex3 = val;
            this.$set(this.params3, 'page', val);
            this.myDownloadFile();
        },
        // 我的文件的分页导航
        handleUplpadPageChange(val) {
            this.paginationIndex4 = val;
            this.$set(this.params4, 'page', val);
            this.myUploadFile();
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
        },
        changeFocus3(val) {
            if (val) {
                this.$refs.select3.focus();
            } else {
                this.$refs.select3.blur();
            }
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
.file-name {
    color: Blue;
    cursor: pointer;
}
.box-card {
    flex: 1;
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
</style>
