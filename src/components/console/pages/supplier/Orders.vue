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

      <v-row>
        <v-col class="md-12">
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
            <v-toolbar flat class="secondary" dark>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" @click="refreshAll()">Refresh<v-icon>mdi-refresh</v-icon></v-btn>
            </v-toolbar>
            <v-tabs fixed-tabs class="my-3" v-model="selectedTab">
              <v-tab @click="getAllOrders()">All</v-tab>
              <v-tab @click="getAllNotShippedOrders()">Not shipped</v-tab>
              <v-tab @click="getAllShippedOrders()">Shipped</v-tab>
            </v-tabs>
            <v-data-table
              class="secondary"
              loading-text="Caricamento..."
              no-data-text="Nessun ordine ricevuto"
              :headers="headers"
              :items="orders"
              :search="search"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon small @click="deleteItem(item)">mdi-check</v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
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
        value: "name"
      },
      { text: "Quantity", value: "quantity" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    tabs: ["All", "Shipped", "Not shipped"],
    selectedTab:0,
    ordersType: {
      all: [],
      shipped: [],
      notShipped: []
    },
    orders: []
  }),
  created() {
    this.getAllOrders();
  },
  methods: {
    getAllOrders() {
      if (this.ordersType.all.length == 0) {
        axios
          .get("/orders/supplier_all")
          .then(res => {
            console.log(res);
            this.ordersType.all = res.data;
            this.orders = res.data;
          })
          .catch(err => console.log(err));
      }
      this.orders = this.ordersType.all;
    },
    getAllNotShippedOrders() {
      if (this.ordersType.notShipped.length == 0) {
        axios
          .get("/orders/supplier_not_shipped")
          .then(res => {
            console.log(res);
            this.ordersType.notShipped = res.data;
            this.orders = res.data;
          })
          .catch(err => console.log(err));
      }
      this.orders = this.ordersType.notShipped;
    },
    getAllShippedOrders() {
      console.log(this.ordersType.shipped.length);
      if (this.ordersType.shipped.length == 0) {
        axios
          .get("/orders/supplier_shipped")
          .then(res => {
            console.log(res);
            this.ordersType.shipped = res.data;
            this.orders = res.data;
          })
          .catch(err => console.log(err));
      }
      this.orders = this.ordersType.shipped;
    },
    refreshAll() {
      this.ordersType.all = [];
      this.ordersType.shipped = [];
      this.ordersType.notShipped = [];

      this.orders = [];

      //TODO
      //small trick that needs to be checked

      this.selectedTab = 0;
      this.getAllOrders();

    }
  }
};
</script>