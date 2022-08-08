<template>
  <div class="content">
    <div class="header">
      <div class="title">质量&资源分析</div>
    </div>
    <div class="body">
      <div class="body-left">
        工单分析
        <div class="solid"></div>
        <div id="solve" class="solve"></div>
        <div id="response" class="response"></div>
      </div>
      <div class="body-right">
        <div class="dataSum">
          <div>数据概要</div>
          <div class="dataList">
            <div class="dataInfo projectNum">
              <div class="info">
                <p class="infoTitle">本周在途项目数</p>
                <p class="infoNum">10个</p>
                <img class="infoImg" src="../../assets/img/日程.png" alt="">
              </div>
            </div>
            <div class="dataInfo bugNum">
              <div class="info">
                <p class="infoTitle">本周新增缺陷总数</p>
                <p class="infoNum">234个</p>
                <img class="infoImg" src="../../assets/img/window.png" alt="">
              </div>
            </div>
            <div class="dataInfo solveNum">
              <div class="info">
                <p class="infoTitle">本周缺陷修复率</p>
                <p class="infoNum">77.1%</p>
                <img class="infoImg" src="../../assets/img/time.png" alt="">
              </div>
            </div>
            <div class="dataInfo orderNum">
              <div class="info">
                <p class="infoTitle">本周新增工单数</p>
                <p class="infoNum">0</p>
                <img class="infoImg" src="../../assets/img/money_bag.png" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="chartList">
          <div>
            <div class="analyzeDiv">
              <div class="analyzeTitle">缺陷趋势分析</div>
              <div id="analyzeChart" class="analyzeChart"></div>
            </div>
            <div class="barList">
              <div class="details">
                <div class="detailsTitle">本周新增&修复明细</div>
                <div id="detailsChart" class="detailsChart"></div>
              </div>
              <div class="ranking">
                <div class="rankingTitle">缺陷产出排名</div>
                <div id="rankingChart" class="rankingChart"></div>
              </div>
            </div>
          </div>
          <div class="resource">
            <div class="resourceTitle">产研测资源</div>
            <div v-for="(item, index) in resourceList" :key="item.name" :class="'resourceBody' + index">
              <div class="infoTitle">{{ item.name }}剩余电量</div>
              <div class="resourceInfo">
                <div :id="'resourceChart' + index" :class="'resourceChart' + index"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import echarts from '../../utils/echartsUi'

export default {
  name: 'ChartList',
  components: {},
  mixins: [],
  data() {
    return {
      resourceList: [
        {
          name: '产品',
          value: 40
        },
        {
          name: '研发',
          value: 6
        },
        {
          name: '测试',
          value: 20
        },
      ]
    }
  },
  created() {
    console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  },
  mounted() {
    this.initSolveChart();
    this.initResponseChart();
    this.initAnalyzeChart();
    this.initDetailsChart();
    this.initRankingChart();
    this.initResourceChart();
  },
  methods: {
    initSolveChart() {
      let solveChart = echarts.init(document.getElementById('solve'))
      let option = {
        title: {
          text: '双周解決率',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#35468D',
            fontSize: 25
          }
        },
        label: {
          show: false,
          position: 'center'
        },
        legend: {
          bottom: 10,
          left: 'center',
        },
        color: ['rgb(234,165,104)', 'rgb(51,133,216)'],
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: '1' },
              { value: 434, name: '2' }
            ],
            clockwise: false,
            label: {
              show: true,
              position: 'inside',
              formatter: (data) => {
                return (parseInt(data.percent)) + '%'
              },
              color: '#fff'
            }
          },

        ]
      };
      solveChart.setOption(option);
    },
    initResponseChart() {
      let responseChart = echarts.init(document.getElementById('response'))
      let option = {
        title: {
          text: '24H响应率',
          left: 'center',
          top: 30,
          textStyle: {
            fontSize: 25
          }
        },
        label: {
          show: false,
          position: 'center'
        },
        legend: {
          bottom: 10,
          left: 'center',
        },
        color: ['#A690EA', '#63B7B7'],
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: '1' },
              { value: 434, name: '2' }
            ],
            clockwise: false,
            label: {
              show: true,
              position: 'inside',
              formatter: (data) => {
                return (parseInt(data.percent)) + '%'
              }
            },
          },

        ]
      };
      responseChart.setOption(option);
    },
    initAnalyzeChart() {
      let analyzeChart = echarts.init(document.getElementById('analyzeChart'))
      let option = {
        title: {
          text: '新增缺陷趋势',
          left: 'center',
          top: 10,
          textStyle: {
            color: '#589D9C',
            fontSize: 20
          }
        },
        label: {
          // show:true,
        },
        legend: {
          show: true,
          top: 35,
          left: 'center',
          data: ['在途项目']
        },
        grid: {
          left: 50,
          right: 50,
          bottom: 50
        },
        xAxis: {
          type: 'category',
          data: ['2022-1', '2022-2', '2022-3', '2022-4', '2022-5', '2022-6', '2022-7', '2022-8', '2022-9', '2022-10', '2022-11', '2022-12'],
          axisTick: {
            // show: false,
            alignWithLabel: true
          },
          minorTick: {
            show: false
          },
          axisLabel: {
            show: true,
            // rotate:45,
            width: 50,
            align: 'center',
            margin: 10,
            overflow: 'truncate',
            ellipsis: '...',
          }
        },
        yAxis: {
          type: 'value'
        },
        color: ['#589D9C'],
        series: [
          {
            name: '在途项目',
            data: [10, 20, 30, 50, 30, 60, 1, 40, 20, 60, 20, 10],
            type: 'line'
          }
        ]
      };
      analyzeChart.setOption(option)
    },
    initDetailsChart() {
      let detailsChart = echarts.init(document.getElementById('detailsChart'))
      let option = {
        title: {
          text: '新建&关闭',
          left: 'center',
          top: 15
        },
        tooltip: {
        },
        legend: {
          show: true,
          bottom: 10
        },
        grid: {
          // left: '3%',
          right: 20,
          bottom: 60,
        },
        color: ['#F23A4A', '#3C403D'],
        xAxis: {
          type: 'category',
          axisTick: {
            show: false,
            // alignWithLabel: true
          },
          axisLabel: {
            show: true,
            rotate: 45,
            width: 30,
            align: 'center',
            margin: 15,
            overflow: 'truncate',
            ellipsis: '...',
          },
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '已关闭',
            type: 'bar',
            stack: 'total',
            label: {
              // show: true
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: '未解决',
            type: 'bar',
            stack: 'total',
            label: {
              // show: true
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
        ]
      };
      detailsChart.setOption(option)
    },
    initRankingChart() {
      let rankingChart = echarts.init(document.getElementById('rankingChart'))
      let option = {
        title: {
          text: '本周新增缺陷',
          left: 'center',
          top: 15
        },
        tooltip: {
        },
        legend: {
          show: true,
          top: 45
        },
        grid: {
          top: 80,
          left: 60,
          right: 60,
          bottom: 30,
        },
        color: ['#F23A4A', '#3C403D'],
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          axisTick: {
            show: true,
            // alignWithLabel: true
          },
          axisLabel: {
            show: true,
            width: 40,
            align: 'center',
            margin: 20,
            overflow: 'truncate',
            ellipsis: '...',
          },
          data: ['Mon1111111111111', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        series: [
          {
            name: '本周新增',
            type: 'bar',
            stack: 'total',
            label: {
              // show: true
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
        ]
      };
      rankingChart.setOption(option)
    },
    initResourceChart() {
      this.resourceList.forEach((item, index) => {
        let resourceChart = echarts.init(document.getElementById('resourceChart' + index))
        let option = {
          grid: {
            top: 0,
            bottom: 0,
            left: 0,
          },
          xAxis: {
            show: false,
            type: 'value',
            max: 100

          },
          yAxis: {
            show: false,
            type: 'category',

          },
          series: [
            {
              type: 'bar',
              data: [item.value],
              barWidth: '100%',
              // barWidth: 10,
              label: {
                show: true,
                position: 'inside',
                formatter: '{c}%',
                color: '#fff',
                align: 'center',
                verticalAlign: 'middle'
              }
            },
          ]
        };

        if (item.value > 20) {
          option.color = ['rgb(144,209,80)']
        } else {
          option.color = ['rgb(255,149,168)'],
            option.series[0].label.position = [12, '50%'],
            option.series[0].label.color = 'black'
        }
        resourceChart.setOption(option)
      });
    }
  }
}
</script>

<style scoped lang='less'>
.content {
  width: 100%;
  height: 100%;
  background-color: rgb(243, 243, 243);
  // overflow-y: visible;
  overflow-y: auto;

  .title {
    font-size: 30px;
    text-indent: 10px;
    color: rgb(83, 83, 83);
    margin-top: 10px;
    height: 50px;
    display: flex;
    align-items: center;
  }

  .title::before {
    content: '';
    width: 20px;
    height: 50px;
    left: 100px;
    background-color: rgb(238, 61, 69);
  }
}

.body {
  padding: 0 10px;
  display: flex;
  flex-direction: row;

  .body-left {
    width: 510px;
    padding: 0 10px;
    font-size: 18px;
    font-weight: 600;
    margin-top: 10px;

    .solid {
      margin-top: 5px;
      width: 100%;
      height: 10px;
      background-color: rgb(45, 138, 245);
    }

    .solve {
      width: 100%;
      height: 400px;
      background-color: white;
      margin-top: 10px;
    }

    .response {
      width: 100%;
      height: 400px;
      background-color: white;
      margin-top: 20px;
    }
  }

  .body-right {
    width: 1200px;
    font-size: 18px;
    font-weight: 600;
    padding: 0 10px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;

    .dataSum {
      .dataList {
        margin-top: 5px;

        width: 1180px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .dataInfo {
          width: 285px;
          height: 120px;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;

          .info {
            color: white;
            width: 200px;

            .infoTitle {
              font-weight: 100;
            }

            .infoNum {
              font-size: 30px;
            }

            .infoImg {
              // width: 50px;
              // height: 50px;
              position: absolute;
              top: 30px;
              right: 35px;
            }
          }
        }

        .projectNum {
          background-color: #5b6efe;
          background-image: linear-gradient(90deg, #5b6efe 0%, #967cf8 50%, #bf7dee 100%);
        }

        .bugNum {
          background-color: #43aaf4;
          background-image: linear-gradient(90deg, #43aaf4 0%, #669ef6 50%, #7681f8 100%);
        }

        .solveNum {
          background-color: #ec6a81;
          background-image: linear-gradient(90deg, #ec6a81 0%, #ef8a77 50%, #f49e68 100%);
        }

        .orderNum {
          background-color: #44dba0;
          background-image: linear-gradient(90deg, #44dba0 0%, #1edf92 50%, #a7e265 100%);
        }
      }
    }

    .chartList {
      display: flex;
      flex-direction: row;
      margin-top: 15px;

      .analyzeDiv {
        width: 880px;

        .analyzeTitle {
          height: 50px;
          text-indent: 25px;
          background-color: #fff;
          display: flex;
          align-items: center;
        }

        .analyzeChart {
          width: 100%;
          height: 250px;
          margin-top: 10px;
          background-color: #fff;
        }
      }

      .barList {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .details {
          width: 435px;

          .detailsTitle {
            width: 100%;
            height: 30px;
            text-indent: 25px;
            background-color: #FFF;
            display: flex;
            align-items: center;
          }

          .detailsChart {
            height: 340px;
            margin-top: 10px;
            background-color: #FFF;
          }
        }

        .ranking {
          width: 435px;

          .rankingTitle {
            width: 100%;
            height: 30px;
            text-indent: 25px;
            background-color: #FFF;
            display: flex;
            align-items: center;
          }

          .rankingChart {
            height: 340px;
            margin-top: 10px;
            background-color: #FFF;
          }
        }
      }

      .resource {
        width: 285px;
        margin-left: 15px;

        .resourceTitle {
          height: 50px;
          text-indent: 25px;
          background-color: #fff;
          display: flex;
          align-items: center;
        }

        .resourceBody0 {
          width: 285px;
          height: 150px;
          margin-top: 40px;
          background-color: #FFF;
          display: flex;
          flex-direction: column;
          align-items: center;

          .infoTitle {
            margin-top: 10px;
          }

          .resourceInfo {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .resourceChart0 {
            width: 130px;
            height: 50px;
            border: 10px solid rgb(50, 85, 157);
            position: relative;
          }

          .resourceChart0::before {
            position: absolute;
            right: -18px;
            top: 10px;
            content: '';
            width: 8px;
            height: 30px;
            background-color: rgb(50, 85, 157);
          }
        }

        .resourceBody1 {
          width: 285px;
          height: 150px;
          margin-top: 40px;
          background-color: #FFF;
          display: flex;
          flex-direction: column;
          align-items: center;

          .infoTitle {
            margin-top: 10px;
          }

          .resourceInfo {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .resourceChart1 {
            width: 130px;
            height: 50px;
            border: 10px solid rgb(251, 61, 98);
            position: relative;
          }

          .resourceChart1::before {
            position: absolute;
            right: -18px;
            top: 10px;
            content: '';
            width: 8px;
            height: 30px;
            background-color: rgb(251, 61, 98);
          }
        }

        .resourceBody2 {
          width: 285px;
          height: 150px;
          margin-top: 40px;
          background-color: #FFF;
          display: flex;
          flex-direction: column;
          align-items: center;

          .infoTitle {
            margin-top: 10px;
          }

          .resourceInfo {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .resourceChart2 {
            width: 130px;
            height: 50px;
            border: 10px solid rgb(252, 62, 95);
            position: relative;
          }

          .resourceChart2::before {
            position: absolute;
            right: -18px;
            top: 10px;
            content: '';
            width: 8px;
            height: 30px;
            background-color: rgb(251, 61, 98);
          }
        }
      }
    }
  }
}
</style>