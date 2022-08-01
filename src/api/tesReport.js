import { api } from './serviceUntoken';
export default {
    /**
     *
     * 缺陷bug图表
     */

    //缺陷年龄
    // resolve_time(data) {
    //     return api.get('/api/v1/funcapp/bug_average_resolve_time/', data);
    // },
    resolve_time(data) {
        return api.get('/api/v1/funcapp/bug_average_closed_time/', data);
    }
};
