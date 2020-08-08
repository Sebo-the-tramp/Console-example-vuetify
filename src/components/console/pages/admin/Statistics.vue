<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-row align="center" justify="center" style="height:80px">
              <h2>Statistics</h2>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="3" sm="12" v-for="data in dataCharts" :key="data.name">
          <v-card :color="data.background">
            <v-row align="center" justify="center" style="height:80px">
              <h3>{{data.name}}</h3>
            </v-row>
            <v-row>
              <v-col cols="12" md="9">
                <v-sparkline
                  :value="data.values"
                  :gradient="chartSettings.gradient"
                  :smooth="chartSettings.radius || false"
                  :padding="chartSettings.padding"
                  :line-width="chartSettings.lineWidth"
                  :stroke-linecap="chartSettings.lineCap"
                  :gradient-direction="chartSettings.gradientDirection"
                  :fill="chartSettings.fill"
                  :type="chartSettings.type"
                  :auto-line-width="chartSettings.autoLineWidth"
                  auto-draw
                  :show-labels="chartSettings.showLabels"
                  :label-size="chartSettings.labelSize"
                ></v-sparkline>
              </v-col>
              <v-col cols="12" md="3">
                <h1 class="ma-3 d-flex justify-center" style="font-size:80px">{{data.last}}</h1>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>

const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"],
];

export default {

  mqtt:{
    'seniorsafe/1': function(val){
      var enc = new TextDecoder("utf-8");
      var string = enc.decode(val)
      var data = string.split(",")

      console.log(this.getUserId(data[1]))

      this.addValue(data, this.getUserId(data[1]))
    }  
  },

  data: () => ({
    chartSettings: {
      showLabels: true,
      lineWidth: 1.5,
      labelSize: 7,
      radius: 10,
      padding: 8,
      lineCap: "round",
      gradient: gradients[0],
      gradientDirection: "top",
      gradients,
      fill: false,
      type: "trend",
      autoLineWidth: false,
    },

    userTable:[
      {mac:"E7:DB:74:09:CA:7F", id:0}
    ],
    //userTable: new Map("E7:DB:74:09:CA:7F",0),
    

    dataCharts: [
      {
        name: "Andreatta",
        values: [],
        background: "red",
        last: 0
      },

      {
        name: "Paziente 2",
        values: [2, 1, 2, 3, 4, 6, 8, 11, 13, 16, 18, 22, 25, 26, 29],
        background: "blue",
        last: 0
      },
    ],
  }),

  mounted() {
    console.log("ciao")
    var a = this.$mqtt.subscribe('seniorsafe/#', {})
    console.log(a)
  },

  methods: {
    addValue: function(val, usr){
      var int = parseInt(val);
      if(this.dataCharts[usr].values.length > 100){
        this.dataCharts[usr].values.splice(0,1);
      }
      this.dataCharts[usr].values.push(int)
      this.dataCharts[usr].last = int;
    },
    getUserId: function(mac){
      var res = -1;
      this.userTable.forEach(element => {
        if(element.mac == mac){
          res = element.id;
        }
      });
      return res;
    }
  }
};
</script>
