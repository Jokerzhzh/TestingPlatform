<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <template v-for="(threeItem, i) in subItem.subs">
                                    <el-submenu v-if="threeItem.subs" :index="threeItem.index" :key="threeItem.index">
                                        <template slot="title">{{ threeItem.title }}</template>
                                        <el-menu-item v-for="(fourItem, i) in threeItem.subs" :key="i" :index="fourItem.index">
                                            {{ fourItem.title }}
                                        </el-menu-item>
                                    </el-submenu>
                                    <el-menu-item v-else :key="i" :index="threeItem.index">
                                        {{ threeItem.title }}
                                    </el-menu-item>
                                </template>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-cascades',
                    index: '1',
                    title: '功能测试',
                    subs: [
                        {
                            index: 'testExecutiveProject',
                            title: '项目'
                        },
                        {
                            index: 'testVersionProject',
                            title: '项目迭代'
                        },
                        {
                            index: 'testNeed',
                            title: '需求'
                        },
                        {
                            index: 'testWork',
                            title: '任务'
                        },
                        {
                            index: 'testManagepool',
                            title: '用例管理池',
                            subs: [
                                {
                                    index: 'projectManage',
                                    title: '用例管理'
                                },
                                {
                                    index: 'projectKind',
                                    title: '类目管理'
                                }
                            ]
                        },
                        {
                            index: 'testUsecase',
                            title: '用例执行'
                        },
                        {
                            index: 'submitBug',
                            title: '独立提交bug'
                        },
                        {
                            index: 'testReport',
                            title: '测试报告'
                        },
                        {
                            index: 'reportForms',
                            title: '报表',
                            subs: [
                                {
                                    index: 'defectStatistics',
                                    title: '缺陷统计报表',
                                    subs: [
                                        {
                                            index: 'statusDistribution',
                                            title: '缺陷状态分布图'
                                        },
                                        {
                                            index: 'severLevel',
                                            title: '缺陷严重级别分布图'
                                        },
                                        {
                                            index: 'buildPersonSeverLevel',
                                            title: '缺陷创建人严重级别分布图'
                                        },
                                        {
                                            index: 'handPersonSeverLevel',
                                            title: '缺陷处理人状态分布图'
                                        },
                                        {
                                            index: 'BugDistribution',
                                            title: '研发组bug分布图'
                                        },
                                        {
                                            index: 'ProjectDistribution',
                                            title: '项目需求bug分布图'
                                        }
                                    ]
                                },
                                {
                                    index: 'trendStatistics',
                                    title: '缺陷趋势统计图',
                                    subs: [
                                        {
                                            index: 'trendDayStatistics',
                                            title: '缺陷每日变化趋势'
                                        },
                                        {
                                            index: 'trendTotalStatistics',
                                            title: '缺陷累计变化趋势'
                                        }
                                    ]
                                },
                                {
                                    index: 'defectAgeStatistics',
                                    title: '缺陷年龄统计'
                                },
                                {
                                    index: 'defectResetStatistics',
                                    title: '缺陷重新打开次数统计'
                                },
                                {
                                    index: 'taskTimeDistribution',
                                    title: '任务时间统计'
                                },
                                // {
                                //     index: 'reportotherForm',
                                //     title: '其他缺陷报告',
                                //     subs: [
                                //         // {
                                //         //     index: 'regressinDistribution',
                                //         //     title: '缺陷回归分布'
                                //         // },c
                                //         {
                                //             index: 'defectForm',
                                //             title: '缺陷解决表'
                                //         }
                                //     ]
                                // },
                                {
                                    index: 'censusForm',
                                    title: '用例统计报表',
                                    subs: [
                                        {
                                            index: 'statisticalReport',
                                            title: '用例统计表'
                                        },
                                        {
                                            index: 'usecaseForm',
                                            title: '用例复用统计图'
                                        },
                                        {
                                            index: 'usecaseExecution',
                                            title: '用例执行次数统计图'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-link',
                    index: '2',
                    title: '接口测试',
                    subs: [
                        {
                            index: 'testProject',
                            title: '项目'
                        },
                        {
                            index: 'testModule',
                            title: '模块'
                        },
                        {
                            index: 'testApi',
                            title: '测试接口'
                        },
                        {
                            index: 'testCase',
                            title: '测试用例'
                        },
                        {
                            index: 'testEnvironment',
                            title: '测试环境'
                        },
                        {
                            index: 'testDatabase',
                            title: '链接数据库'
                        },
                        {
                            index: 'testTaskSet',
                            title: '任务集',
                            subs: [
                                {
                                    index: 'testTaskSet',
                                    title: '操作任务集'
                                },
                                {
                                    index: 'testTaskSetHistory',
                                    title: '任务集历史'
                                }
                            ]
                        }
                    ]
                },
                {
                    icon: 'el-icon-brush',
                    index: '6',
                    title: 'UI AUTO',
                    subs: [
                        {
                            index: 'uiTestStep',
                            title: 'UI动作库'
                        },
                        {
                            index: 'uiTestCase',
                            title: '测试用例'
                        },
                        {
                            index: 'uiTestTaskSet',
                            title: '测试流程'
                        },
                        {
                            index: 'uiLibrary',
                            title: '元素库'
                        },
                        {
                            index: 'uiTestReport',
                            title: '测试报告'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-settings',
                    index: '3',
                    title: '性能测试',
                    subs: [
                        {
                            index: 'testProject5',
                            title: '性能1'
                        },
                        {
                            index: 'serverList',
                            title: '服务器列表'
                        },
                        {
                            index: 'clusterInfo',
                            title: '集群信息'
                        }
                    ]
                },
                {
                    icon: 'el-icon-collection',
                    index: '4',
                    title: '知识库',
                    subs: [
                        // {
                        //     index: 'testKnowledgeVideo',
                        //     title: '技术专区',
                        //     subs: [
                        {
                            index: 'testKnowledgeVideo',
                            title: '视频'
                        },
                        {
                            index: 'testKnowledgeFile',
                            title: '文件'
                        }
                        //     ]
                        // }
                    ]
                },
                {
                    icon: 'el-icon-sugar',
                    index: '5',
                    title: '抽奖福利',
                    subs: [
                        {
                            index: 'prizeInfo',
                            title: '奖品'
                        },
                        {
                            index: 'luckDraw',
                            title: '抽奖'
                        },
                        {
                            index: 'luckRules',
                            title: '规则'
                        }
                    ]
                }
                // {
                //     icon: 'el-icon-lx-home',
                //     index: 'dashboard',
                //     title: '系统首页'
                // },
                // {
                //     icon: 'el-icon-lx-cascades',
                //     index: 'table',
                //     title: '基础表格'
                // },
                // {
                //     icon: 'el-icon-lx-copy',
                //     index: 'tabs',
                //     title: 'tab选项卡'
                // },
                // {
                //     icon: 'el-icon-lx-calendar',
                //     index: '4',
                //     title: '表单相关',
                //     subs: [
                //         {
                //             index: 'form',
                //             title: '基本表单'
                //         },
                //         {
                //             index: '4-2',
                //             title: '三级菜单',
                //             subs: [
                //                 {
                //                     index: 'editor',
                //                     title: '富文本编辑器'
                //                 },
                //                 {
                //                     index: 'markdown',
                //                     title: 'markdown编辑器'
                //                 }
                //             ]
                //         },
                //         {
                //             index: 'upload',
                //             title: '文件上传'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-emoji',
                //     index: 'icon',
                //     title: '自定义图标'
                // },
                // {
                //     icon: 'el-icon-pie-chart',
                //     index: 'charts',
                //     title: 'schart图表'
                // },
                // {
                //     icon: 'el-icon-rank',
                //     index: '6',
                //     title: '拖拽组件',
                //     subs: [
                //         {
                //             index: 'drag',
                //             title: '拖拽列表'
                //         },
                //         {
                //             index: 'dialog',
                //             title: '拖拽弹框'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-global',
                //     index: 'i18n',
                //     title: '国际化功能'
                // },
                // {
                //     icon: 'el-icon-lx-warn',
                //     index: '7',
                //     title: '错误处理',
                //     subs: [
                //         {
                //             index: 'permission',
                //             title: '权限测试'
                //         },
                //         {
                //             index: '404',
                //             title: '404页面'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-redpacket_fill',
                //     index: '/donate',
                //     title: '支持作者'
                // }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', (msg) => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
}
.sidebar > ul {
    height: 100%;
}
.el-submenu .el-menu-item {
    height: 50px;
    line-height: 50px;
    padding: 0 45px;
    min-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.el-menu-item:focus,
.el-menu-item:hover {
    outline: 0;
    background-color: #ecf5ff;
}
</style>
