<template>
  <v-app>
    <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-row align="center" justify="center" style="height:80px">
            <h2>Orders</h2>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        Products
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        class="secondary"
        loading-text="Caricamento..."
        no-data-text="Aggiungi un piatto per cominciare"
        :headers="headers"
        :items="orders"
        :search="search"
      >
        <!-- adding the sign of the price -->
        <template v-slot:item.price="{ item }">{{ item.price + " €" }}</template>
        <!-- Top Slot -->
        <template v-slot:top>
          <v-toolbar flat class="secondary" dark>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "../../../../lib/axios-console";
//import store from "../../../../lib/store";

export default {
  data: () => ({
    // TABLE
    search: "",
    headers: [
      { text: "Id", value: "id" },
      {
        text: "Nome ",
        align: "start",
        sortable: true,
        value: "productName"
      },
      { text: "Quantity", value: "quantity" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    orders: []
  }),
  created() {
    this.getOrdersDetail();
  },
  methods: {
    getOrdersDetail() {
      axios
        .get("/orders/supplier")
        .then(res => {
          console.log(res);
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
