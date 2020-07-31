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
          <v-col cols="12" md="6" sm="12" v-for="data in dataCharts" :key="data.name">
            <v-card>
              <v-row align="center" justify="center" style="height:80px">
                <h3>{{data.name}} + {{data.percentage}}%</h3>
              </v-row>
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
  ["#f72047", "#ffd200", "#1feaea"]
];

export default {
  data: () => ({
    chartSettings: {
      showLabels: false,
      lineWidth: 1.5,
      labelSize: 7,
      radius: 10,
      padding: 8,
      lineCap: "round",
      gradient: gradients[5],
      gradientDirection: "top",
      gradients,
      fill: false,
      type: "trend",
      autoLineWidth: false
    },

    dataCharts: [
      {
        name: "Sellings",
        values: [0, 2, 5, 9, 11, 10, 11, 12, 15, 17, 16, 15, 20, 22, 24],
        percentage: 24
      },

      {
        name: "New clients",
        values: [0, 1, 2, 3, 4, 6, 8, 11, 13, 16, 18, 22, 25, 26, 29],
        percentage: 30
      }
    ]
  })
};
</script>
