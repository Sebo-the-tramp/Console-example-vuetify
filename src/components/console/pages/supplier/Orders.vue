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
              <v-tabs fixed-tabs class="my-3">
                <v-tab @click="getAllOrders()">
                  All
                </v-tab>
                <v-tab @click="getAllNotShippedOrders()">
                  Not shipped
                </v-tab>
                <v-tab @click="getAllShippedOrders()">
                  Shipped
                </v-tab>
              </v-tabs>
            <v-data-table
              class="secondary"
              loading-text="Caricamento..."
              no-data-text="Nessun ordine ricevuto"
              :headers="headers"
              :items="orders"
              :search="search"
            >
              <!-- adding the sign of the price -->
              <template v-slot:item.price="{ item }">{{ item.price + " €" }}</template>
              <!-- Top Slot -->

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
    tabs:["All", "Shipped", "Not shipped"],
    orders: []
  }),
  created() {
    this.getAllOrders();
  },
  methods: {
    getAllOrders() {
      axios
        .get("/orders/supplier_all")
        .then(res => {
          console.log(res);
          this.orders = res.data;
        })
        .catch(err => console.log(err));
    },
     getAllNotShippedOrders() {
      axios
        .get("/orders/supplier_not_shipped")
        .then(res => {
          console.log(res);
          this.orders = res.data;
        })
        .catch(err => console.log(err));
    },
    getAllShippedOrders() {
      axios
        .get("/orders/supplier_shipped")
        .then(res => {
          console.log(res);
          this.orders = res.data;
        })
        .catch(err => console.log(err));
    },
  }
};
</script>
