<template>
  <div ref="lineCharts" class="lineCharts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  mounted() {
    const lineCharts = echarts.init(this.$refs.lineCharts)
    /** @type EChartsOption */
    lineCharts.setOption({
      tooltip: {},
      xAxis: {
        show: false, // 是否显示x轴
        type: 'category',
        boundaryGap: false // false代表x轴从0开始，true代表离0有一定距离
      },
      yAxis: {
        show: false, // 是否显示y轴
        max: 70 // 最大显示的值
      },
      grid: { // 图表距离周围的距离
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      series: [
        {
          type: 'line',
          data: [10, 60, 22, 40, 11, 50, 32, 8, 27],
          smooth: true, // 折线变成曲线
          itemStyle: { // 设置拐点的样式
            opacity: 0 // 透明度为0，不显示拐点
          },
          color: '#9e70dd',
          areaStyle: { // 设置区域折线图的样式
            color: { // 设置渐变色
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(158, 112, 221,0.5)' // 0% 处的颜色
              },
              {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }
      ]
    })
    window.onresize = function() {
      lineCharts.resize()
    }
  }
}
</script>

<style>
.lineCharts{
  width: 100%;
  height: 100px;
}
</style>
