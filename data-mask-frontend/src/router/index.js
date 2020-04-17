import Vue from 'vue'
import Router from 'vue-router'
/* 引入页面 */
import Home from '@/pages/home.vue'
import OffLine from '@/pages/offLineData.vue'
import StreamData from '@/pages/streamData.vue'
import DataSync from '@/pages/dataSync.vue'
import HistoryRecord from '@/pages/historyRecord.vue'
import Login from '@/pages/login.vue'

import MaskProcess from '@/pages/maskProcess.vue'
import StreamMaskProcess from '@/pages/streamMaskProcess.vue'

import MaskResult from '@/pages/maskResult.vue'
import StreamMaskResult from '@/pages/streamMaskResult'

import MaskResultExport from '@/pages/maskResultExport.vue'
import StreamMaskResultExport from '@/pages/streamMaskResultExport.vue'

Vue.use(Router)

/* 配置路由 */
export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/', // 主页面
      name: Home,
      component: Home
    },
    {
      path: '/offline', // 离线数据上传和脱敏配置页面
      name: 'offLineData',
      component: OffLine /* 上面import的部分 */
    },
    {
      path: '/stream', // 流数据消费者配置和脱敏配置页面
      name: 'streamData',
      component: StreamData
    },
    {
      path: '/data_sync', // 数据同步
      name: 'dataSync',
      component: DataSync
    },
    {
      path: '/history', // 历史脱敏记录查看页面
      name: 'historyRecord',
      component: HistoryRecord
    },
    {
      path: '/login', // 登录/注册/登出页面
      name: 'Login',
      component: Login /* 上面import的部分 */
    },
    {
      path: '/masking', // 文件数据脱敏过程展示页面
      name: 'maskProcess',
      component: MaskProcess
    },
    {
      path: '/stream/masking/:userStreamId', // 流数据脱敏过程展示页面
      name: 'streamMaskProcess',
      component: StreamMaskProcess
    },
    {
      path: '/result:/userFileId', // 文件数据脱敏结果列表展示页面
      name: 'maskResult',
      component: MaskResult
    },
    {
      path: '/export/:userFileId', // 文件数据脱敏结果导出成文件页面
      name: 'maskResultExport',
      component: MaskResultExport
    },
    {
      path: '/stream/result/:userStreamId', // 流数据脱敏结果列表展示页面
      name: 'streamMaskResult',
      component: StreamMaskResult
    },
    {
      path: 'stream/export/:userStreamId', // 文件数据脱敏结果导出成文件页面
      name: 'streamMaskResultExport',
      component: StreamMaskResultExport
    }
  ]
})
