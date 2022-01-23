<template>

  <el-card style="margin:10px 0">
    <div slot="header" class="header">
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale" />
        <el-tab-pane label="访问量" name="visit" />
      </el-tabs>
      <div class="selectDate">
        <span class="date" @click="setDay">今日</span>
        <span class="date" @click="setWeek">本周</span>
        <span class="date" @click="setMonth">本月</span>
        <span class="date" @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div ref="charts" class="charts" style="border:none" />
        </el-col>
        <el-col :span="6">
          <h4 class="rankTitle">门店销售额排名</h4>
          <ul>
            <li><span class="index">1</span><span>肯德基</span><span class="value">323324</span></li>
            <li><span class="index">2</span><span>麦当劳</span><span class="value">323121</span></li>
            <li><span class="index">3</span><span>汉堡王</span><span class="value">233323</span></li>
            <li><span class="index">4</span><span>德克士</span><span class="value">222221</span></li>
            <li><span class="index">5</span><span>海底捞</span><span class="value">189123</span></li>
            <li><span class="index">6</span><span>菲兹</span><span class="value">152111</span></li>
            <li><span class="index">7</span><span>火凤祥</span><span class="value">132111</span></li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>

</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      activeName: 'sale',
      date: [],
      echarts: null
    }
  },
  computed: {
    title() {
      if (this.activeName === 'sale') {
        return '销售额趋势'
      } else {
        return '访问量趋势'
      }
    }
  },
  watch: {
    // 因为图表设置在mounted中，只会加载一次，所以在监听器中进行修改
    activeName() {
      this.echarts.setOption({
        title: {
          text: this.title
        }
      })
    }
  },
  mounted() {
    // 设置echarts图表
    this.echarts = echarts.init(this.$refs.charts)
    /** @type EChartsOption */
    this.echarts.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {
        axisLine: {
          show: false
        }
      },
      grid: {
        top: 40,
        left: 20,
        right: 20,
        bottom: 30,
        containLabel: true
      },
      series: [
        {
          type: 'bar',
          data: [222, 133, 43, 443, 32, 156, 544, 78, 234, 55, 123, 343],
          barWidth: 50
        }
      ]
    })
  },
  methods: {
    // 点击‘今日’，使选择日期的组件显示为今日日期
    setDay() {
      const start = dayjs().format('YYYY-MM-DD')
      this.date = [start, start]
    },
    // 点击‘本周’，使选择日期的组件显示为本周日期
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 点击‘本月’，使选择日期的组件显示为本月日期
    setMonth() {
      const start = dayjs().startOf('months').format('YYYY-MM-DD')
      const end = dayjs().endOf('months').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 点击‘本年’，使选择日期的组件显示为本年日期
    setYear() {
      const start = dayjs().startOf('years').format('YYYY-MM-DD')
      const end = dayjs().endOf('years').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style scoped>
>>>.el-card__header{
  border: none;
}
.header {
  position: relative;
}
.tab {
  width: 100%;
}
.selectDate{
  position: absolute;
  right: 0;
}
.date {
  margin-right: 15px;
}
>>>.el-tabs__item {
  font-size: 16px;
}
.charts{
  width: 100%;
  height: 320px;
}
>>>.el-card__body {
  padding-top: 0;
}
.rankTitle {
  padding: 0;
  margin-top: 0;
}
ul {
  padding: 0;
  list-style: none;
}
ul li {
  margin-top: 20px;
}
ul li .index {
  margin-right: 20px;
display: inline-block;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
}
ul li:nth-child(1) .index {
  background-color: #000;
  color: #fff;
}
ul li:nth-child(2) .index {
  background-color: #000;
  color: #fff;
}
ul li:nth-child(3) .index {
  background-color: #000;
  color: #fff;
}
.value {
  float: right;
}
</style>
