<template>
  <v-app>
    <v-container fluid>
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
          <v-row class="ma-5">
            <v-text-field v-model="idCart" label="Id cart" single-line hide-details></v-text-field>
          </v-row>
          <v-data-table
            loading-text="Caricamento..."
            no-data-text="Aggiungi un piatto per cominciare"
            :headers="headers"
            :items="items_shop"
            :search="search"
          >
            <!-- adding the sign of the price -->
            <template v-slot:item.price="{ item }">{{ item.price + " €" }}</template>
            <!-- Top Slot -->
            <template v-slot:top>
              <v-toolbar color="secondary" flat>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="removeProduct(item)">mdi-minus</v-icon>
              <v-icon small class="mr-2" @click="addProduct(item)">mdi-plus</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-container>
    <v-card class="ma-5 pa-5">
      <h1>Confirm order</h1>
      <v-btn @click="confirmOrder()">ORDER</v-btn>
    </v-card>
  </v-app>
</template>


<script>
import axios from "../../../../lib/axios-console";
import store from "../../../../lib/store";

export default {
  data() {
    return {

      idCart: null,

      // TABLE
      search: "",
      headers: [
        { text: "Id", value: "id" },
        { text: "Supplier", value: "supplier.name" },
        {
          text: "Nome piatto",
          align: "start",
          sortable: true,
          value: "productName",
        },
        { text: "Prezzo", value: "price" },
        { text: "Categoria", value: "category.categoryName" },
        { text: "Disponibilita'", value: "availableNumber" },
        { text: "Actions", value: "actions", sortable: false },
      ],

      // ITEMS
      items_shop: [],
      categoriesGlobal: [],

    };
  },

  methods: {
    getCategories() {
      axios
        .get("/data/categories")
        .then((res) => {
          this.categoriesGlobal = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getProducts() {
      axios
        .get("/products")
        .then((res) => {
          console.log(res);
          this.items_shop = res.data;
        })
        .catch((err) => {
          store.data.setMessageAction(err);
        });
    },
    
    addProduct(item) {
      var data = {
        listId: this.idCart,
        productId: item.id,
        quantity: 1,
      };
      console.log(item.id);
      console.log(data);
      axios
        .post("/productlist/", data)
        .then((res) => {
          item.showProduct = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    removeProduct(item) {
      var data = {
        listId: this.idCart,
        productId: item.id,
        quantity: -1,
      };
      console.log(item.id);
      console.log(data);
      axios
        .post("/productlist/", data)
        .then((res) => {
          item.showProduct = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    confirmOrder() {
      console.log("confirming");
      axios
        .post("/order/" + this.idCart)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getListInfos() {
      axios
        .get("list")
        .then((res) => {
          console.log(res.data);
          //probably the first result will always be the cart, we need to be careful with this assumption though
          this.idCart = res.data[0].id
        })
        .catch((err) => console.log(err));
    },
  },

  created: function () {
    this.getProducts();
    this.getCategories();
    this.getListInfos();
  },
};
</script>
