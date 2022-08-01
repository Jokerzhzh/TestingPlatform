import Router from 'vue-router';
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/testProject'
        },
        {
            path: '/',
            component: resolve => require(['@/components/common/Home'], resolve),
            hidden: true,
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/404',
                    component: resolve => require(['@/components/page/404'], resolve),
                    hidden: true,
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['@/components/page/403'], resolve),
                    hidden: true,
                    meta: { title: '403' }
                },
                {
                    path: '/testProject',
                    component: resolve => require(['@/components/page/TestProject'], resolve),
                    hidden: true,
                    meta: { title: '项目' }
                },
                {
                    path: '/testModule',
                    component: resolve => require(['@/components/page/TestModule'], resolve),
                    hidden: true,
                    meta: { title: '模块' }
                },
                {
                    path: '/testApi',
                    component: resolve => require(['@/components/page/TestApi'], resolve),
                    hidden: true,
                    meta: { title: '测试接口' }
                },
                {
                    path: '/testCase',
                    component: resolve => require(['@/components/page/TestCase'], resolve),
                    hidden: true,
                    meta: { title: '测试用例' }
                },
                {
                    path: '/testEnvironment',
                    component: resolve => require(['@/components/page/TestEnvironment'], resolve),
                    hidden: true,
                    meta: { title: '测试环境' }
                },
                {
                    path: '/testDatabase',
                    component: resolve => require(['@/components/page/TestDatabase'], resolve),
                    hidden: true,
                    meta: { title: '链接数据库' }
                },
                {
                    path: '/testTaskSet',
                    component: resolve => require(['@/components/page/TestTaskSet'], resolve),
                    hidden: true,
                    meta: { title: '查看任务集' }
                },
                {
                    path: '/testCarryOutCase',
                    component: resolve => require(['@/components/page/TestCarryOutCase'], resolve),
                    hidden: true,
                    meta: { title: '执行用例' }
                },
                {
                    path: '/testTaskSetResult',
                    component: resolve => require(['@/components/page/TestTaskSetResult'], resolve),
                    hidden: true,
                    meta: { title: '执行任务集' }
                },
                {
                    path: '/testTaskSetHistory',
                    component: resolve => require(['@/components/page/TestTaskSetHistory'], resolve),
                    hidden: true,
                    meta: { title: '任务集历史' }
                },
                {
                    path: '/testTaskDetails',
                    component: resolve => require(['@/components/page/TestTaskDetails'], resolve),
                    hidden: true,
                    meta: { title: '任务集详情' }
                },
                {
                    path: '/testExecutiveProject',
                    component: resolve => require(['@/components/page/TestExecutiveProject'], resolve),
                    hidden: true,
                    meta: { title: '项目页' }
                },
                {
                    path: '/testVersionProject',
                    component: resolve => require(['@/components/page/TestVersionProject'], resolve),
                    hidden: true,
                    meta: { title: '版本项目' }
                },
                {
                    path: '/testNeed',
                    component: resolve => require(['@/components/page/TestNeed'], resolve),
                    hidden: true,
                    meta: { title: '需求页' }
                },
                {
                    path: '/testWork',
                    component: resolve => require(['@/components/page/TestWork'], resolve),
                    hidden: true,
                    meta: { title: '任务页' }
                },
                {
                    path: '/projectManage',
                    component: resolve => require(['@/components/page/ProjectManage'], resolve),
                    hidden: true,
                    meta: { title: '用例' }
                },
                {
                    path: '/projectKind',
                    component: resolve => require(['@/components/page/ProjectKind'], resolve),
                    hidden: true,
                    meta: { title: '类目管理' }
                },
                {
                    path: '/testUsecase',
                    component: resolve => require(['@/components/page/TestUsecase'], resolve),
                    hidden: true,
                    meta: { title: '用例执行' }
                },
                {
                    path: '/submitBug',
                    component: resolve => require(['@/components/page/SubmitBug'], resolve),
                    hidden: true,
                    meta: { title: '独立提交bug' }
                },
                {
                    path: '/testReport',
                    component: resolve => require(['@/components/page/testReport'], resolve),
                    hidden: true,
                    meta: { title: '测试报告' }
                },
                {
                    path: '/testReportDetail',
                    component: resolve => require(['@/components/page/testReportDetail'], resolve),
                    hidden: true,
                    meta: { title: '测试报告详情页' }
                },
                {
                    path: '/testUsecaseDetails',
                    component: resolve => require(['@/components/page/testUsecaseDetail'], resolve),
                    hidden: true,
                    meta: { title: '用例执行详情页' }
                },
                {
                    path: '/statusDistribution',
                    component: resolve => require(['@/components/page/StatusDistribution'], resolve),
                    hidden: true,
                    meta: { title: '缺陷状态分布图' }
                },
                {
                    path: '/BugDistribution',
                    component: resolve => require(['@/components/page/BugDistribution'], resolve),
                    hidden: true,
                    meta: { title: '研发组bug分布图' }
                },
                {
                    path: '/ProjectDistribution',
                    component: resolve => require(['@/components/page/ProjectDistribution'], resolve),
                    hidden: true,
                    meta: { title: '项目需求bug分布图' }
                },
                {
                    path: 'severLevel',
                    component: resolve => require(['@/components/page/SeverLevel'], resolve),
                    hidden: true,
                    meta: { title: '缺陷严重级别分布图' }
                },
                {
                    path: 'buildPersonSeverLevel',
                    component: resolve => require(['@/components/page/BuildPersonSeverLevel'], resolve),
                    hidden: true,
                    meta: { title: '缺陷创建人严重级别分布图' }
                },
                {
                    path: 'handPersonSeverLevel',
                    component: resolve => require(['@/components/page/HandPersonSeverLevel'], resolve),
                    hidden: true,
                    meta: { title: '缺陷处理人严重级别分布图' }
                },
                {
                    path: 'trendDayStatistics',
                    component: resolve => require(['@/components/page/TrendDayStatistics'], resolve),
                    hidden: true,
                    meta: { title: '缺陷每日变化趋势' }
                },
                {
                    path: 'trendTotalStatistics',
                    component: resolve => require(['@/components/page/TrendTotalStatistics'], resolve),
                    hidden: true,
                    meta: { title: '缺陷累计变化趋势' }
                },
                {
                    path: 'defectAgeStatistics',
                    component: resolve => require(['@/components/page/DefectAgeStatistics'], resolve),
                    hidden: true,
                    meta: { title: '缺陷年龄统计' }
                },
                {
                    path: 'defectResetStatistics',
                    component: resolve => require(['@/components/page/DefectResetStatistics'], resolve),
                    hidden: true,
                    meta: { title: '缺陷重新打开次数统计' }
                },
                {
                    path: 'taskTimeDistribution',
                    component: resolve => require(['@/components/page/TaskTimeDistribution'], resolve),
                    hidden: true,
                    meta: { title: '任务时间统计' }
                },
                // {
                //     path: 'regressinDistribution',
                //     component: resolve => require(['@/components/page/RegressinDistribution'], resolve),
                //     hidden: true,
                //     meta: { title: '缺陷回归分布' }
                // },
                {
                    path: '/defectForm',
                    component: resolve => require(['@/components/page/DefectForm'], resolve),
                    hidden: true,
                    meta: { title: '缺陷解决表' }
                },
                {
                    path: '/statisticalReport',
                    component: resolve => require(['@/components/page/statisticalReport'], resolve),
                    hidden: true,
                    meta: { title: '用例统计表' }
                },
                {
                    path: '/UsecaseForm',
                    component: resolve => require(['@/components/page/UsecaseForm'], resolve),
                    hidden: true,
                    meta: { title: '用例复用统计图' }
                },
                {
                    path: '/usecaseExecution',
                    component: resolve => require(['@/components/page/usecaseExecution'], resolve),
                    hidden: true,
                    meta: { title: '用例执行次数统计图' }
                },
                {
                    path: '/uiTestStep',
                    component: resolve => require(['@/components/page/UiAuto/UiTestStep'], resolve),
                    hidden: true,
                    meta: { title: 'UI动作库' }
                },
                {
                    path: '/uiTestCase',
                    component: resolve => require(['@/components/page/UiAuto/UiTestCase/UiTestCase'], resolve),
                    hidden: true,
                    meta: { title: '测试用例' }
                },
                {
                    path: '/uiTestCaseDetails',
                    component: resolve => require(['@/components/page/UiAuto/UiTestCase/UiTestCaseDetails'], resolve),
                    hidden: true,
                    meta: { title: '测试用例详情' }
                },
                {
                    path: '/uiTestTaskSet',
                    component: resolve => require(['@/components/page/UiAuto/UiTestTaskSet/index'], resolve),
                    hidden: true,
                    meta: { title: '测试流程' }
                },
                {
                    path: '/uiTestTaskSetDetals',
                    component: resolve => require(['@/components/page/UiAuto/UiTestTaskSet/components/index'], resolve),
                    hidden: true,
                    meta: { title: '测试流程详情' }
                },
                {
                    path: '/uiLibrary',
                    component: resolve => require(['@/components/page/UiAuto/UiLibrary'], resolve),
                    hidden: true,
                    meta: { title: '元素库' }
                },
                {
                    path: '/uiTestReport',
                    component: resolve => require(['@/components/page/UiAuto/UiTestReport'], resolve),
                    hidden: true,
                    meta: { title: '测试报告' }
                },
                {
                    path: '/testProject5',
                    component: resolve => require(['@/components/page/performanceTesting/index'], resolve),
                    hidden: true,
                    meta: { title: '性能1' }
                },
                {
                    path: '/serverList',
                    component: resolve => require(['@/components/page/performanceTesting/ServerList'], resolve),
                    hidden: true,
                    meta: { title: '服务器列表' }
                },
                {
                    path: '/clusterInfo',
                    component: resolve => require(['@/components/page/performanceTesting/ClusterInfo'], resolve),
                    hidden: true,
                    meta: { title: '集群信息' }
                },
                {
                    path: '/testKnowledgeVideo',
                    component: resolve => require(['@/components/page/TestKnowledgeVideo'], resolve),
                    hidden: true,
                    meta: { title: '视频' }
                },
                {
                    path: '/testKnowledgeFile',
                    component: resolve => require(['@/components/page/TestKnowledgeFile'], resolve),
                    hidden: true,
                    meta: { title: '文档' }
                },
                {
                    path: '/prizeInfo',
                    component: resolve => require(['@/components/page/PrizeInfo'], resolve),
                    hidden: true,
                    meta: { title: '奖品' }
                },
                {
                    path: '/luckDraw',
                    component: resolve => require(['@/components/page/LuckDraw'], resolve),
                    hidden: true,
                    meta: { title: '抽奖' }
                },
                {
                    path: '/luckRules',
                    component: resolve => require(['@/components/page/LuckRules'], resolve),
                    hidden: true,
                    meta: { title: '规则' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['@/components/page/Login'], resolve),
            hidden: true,
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
