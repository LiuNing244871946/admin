<template>
  <div >
    <div class="panel" v-if="todayData">
      <div class="panel-part" style="background:#EBEFF2;">
        <div class="panel-header">今天营业额</div>
        <div class="panel-content">￥：{{todayData.sell_amount}}</div>
        <div class="panel-bottom">
          <span>支付：{{todayData.sell_amount}}</span>
          <span>余额：{{todayData.rmb_amount}}</span>
          <span>微信支付：{{todayData.wx_amount}}</span>
        </div>
      </div>
      <div class="panel-part" style="background:#32C5D2;">
        <div class="panel-header">总业绩</div>
        <div class="panel-content">￥：{{totalData.sell_amount}}</div>
        <div class="panel-bottom">
          <span>支付：{{totalData.sell_amount}}</span>
          <span>余额：{{totalData.rmb_amount}}</span>
          <span>微信支付：{{totalData.wx_amount}}</span>
        </div>
      </div>
      <div class="panel-part" style="background:#8E44AD;">
        <div class="panel-header">用户统计</div>
        <div class="panel-content">{{totalData.user_num}}</div>
        <div class="panel-bottom">今日新增用户：{{todayData.user_num}}</div>
      </div>
    </div>
    <div class="panel">
      <div class="chart" id="chart1"></div>
      <div class="chart" id="chart2"></div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      todayData:null,
      totalData:null,
      listData:[],
    };
  },
  mounted() {
    // this.draw()
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      var that = this;
      request({
        url: "/admin/index/getStatistic",
        method: "get"
      }).then(res => {
        console.log(res);
        if (res.code === 0) {
          this.todayData = res.data.listData[res.data.listData.length-1];
          this.totalData = res.data.allData;
          this.listData = res.data.listData;
          that.draw();
        } else {
        }
      });
    },
    draw() {
      var listData = this.listData;
      var xData= [];
      var yData = [];
      var userData = [];
      for(let i=0;i<listData.length;i++){
        xData.push(listData[i].statistic_date.substring(5));
        yData.push(listData[i].sell_amount);
        userData.push(listData[i].user_num)
      }
      console.log(xData,yData)
      let myChart1 = this.$echarts.init(document.getElementById("chart1"));
      let myChart2 = this.$echarts.init(document.getElementById("chart2"));
      var option1 = {
        title: {
          text: "历史数据"
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: "value",
          // axisLabel: {
          //   formatter: "{value}"
          // }
        },
        series: [
          {
            name: "营业额",
            type: "line",
            data: yData,
            // markPoint: {
            //   data: [
            //     { type: "max", name: "最大值" },
            //   ]
            // },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          }
        ]
      };
      var option2 = {
        title: {
          text: "新增用户"
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: "value",
          // axisLabel: {
          //   formatter: "{value}"
          // }
        },
        series: [
          {
            name: "新增用户",
            type: "line",
            data: userData,
            // markPoint: {
            //   data: [
            //     { type: "max", name: "最大值" },
            //   ]
            // },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          }
        ]
      };
      myChart1.setOption(option1);
      myChart2.setOption(option2);
    }
  }
};
</script>>
<style>
.panel {
  width: 100%;
}

.panel-part {
  width: 32%;
  margin-left: 2%;
  border-radius: 5px;
  padding-bottom: 20px;
  float: left;
  color: #fff;
}

.panel-header {
  font-size: 16px;
  /* color: #838fa1; */
  padding: 30px 15px;
}
.panel-content {
  font-size: 25px;
  /* color: #838fa1; */
  padding-left: 15px;
}
.panel-bottom {
  font-size: 12px;
  /* color: #838fa1; */
  padding-left: 15px;
  margin-top: 20px;
}
.panel-bottom span{
  margin-right: 5px;
}
.panel > div:first-child {
  margin-left: 0;
  color: #838fa1;
}
.chart {
  width: 32%;
  height: 300px;
  margin-right: 2%;
  float: left;
  margin-top: 30px;
}
</style>
