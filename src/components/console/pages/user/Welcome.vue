<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-card>
            <v-row align="center" justify="center" style="height:80px">
              <h2>Welcome</h2>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="d-flex justify-center">
        <h1>This is a simple example of a dashboard</h1>
      </v-row>
      <v-row>
        <v-col cols="12" md="6" sm="12">
          <v-card>
            <v-row align="center" justify="center" style="height:80px">
              <h3>You can add many things and do so many components</h3>
            </v-row>
            
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>


export default {
  data: () => ({
    //  
  }),
};
</script>
