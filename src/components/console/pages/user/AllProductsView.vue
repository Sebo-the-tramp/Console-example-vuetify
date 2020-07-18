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
              <v-icon small class="mr-2" @click="lessProduct(item)">mdi-minus</v-icon>
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
      valid: false,
      dialog: false,
      submit: false,

      idCart: 1,

      // TABLE
      search: "",
      headers: [
        { text: "Id", value: "id" },
        { text: "Supplier", value: "supplier.name" },
        {
          text: "Nome piatto",
          align: "start",
          sortable: true,
          value: "productName"
        },
        { text: "Prezzo", value: "price" },
        { text: "Categoria", value: "category.categoryName" },
        { text: "Disponibilita'", value: "availableNumber" },
        { text: "Actions", value: "actions", sortable: false }
      ],

      // ITEMS
      items_shop: [],
      categoriesGlobal: [],

      // uploading
      loadingValue: 0,

      //rules
      nameRules: [v => !!v || "Campo necessario"],
      vendorRules: [v => !!v || "Campo necessario"],
      quantityRules: [
        v => Number.isInteger(Number(v)) || "Inserire un numero intero"
      ],
      priceRules: [
        v =>
          Number.parseFloat(Number(v)) ? true : false || "Inserire un numbero"
      ]
    };
  },

  methods: {
    getCategories() {
      axios
        .get("/data/categories")
        .then(res => {
          this.categoriesGlobal = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    getProducts() {
      axios
        .get("/products")
        .then(res => {
          console.log(res);
          this.items_shop = res.data;
        })
        .catch(err => {
          store.data.setMessageAction(err);
        });
    },

    editItem(item) {
      this.editedIndex = this.items_shop.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.items_shop.indexOf(item);

      if (confirm("Sicuro di voler cancellare il prodotto?")) {
        axios
          .delete("/product/" + item.id)
          .then(() => {
            this.items_shop.splice(index, 1);
            store.data.setMessageAction("Piatto cancellato con successo");
          })
          .catch(err => console.log(err));
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.loadingValue = 0;
      }, 300);
    },

    addProduct(item) {
      var data = {
        listId: this.idCart,
        productId: item.id,
        quantity: 1
      };
      console.log(item.id);
      console.log(data);
      axios
        .post("/productlist/", data)
        .then(res => {
          item.showProduct = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    lessProduct(item) {
      var data = {
        listId: this.idCart,
        productId: item.id,
        quantity: -1
      };
      console.log(item.id);
      console.log(data);
      axios
        .post("/productlist/", data)
        .then(res => {
          item.showProduct = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    confirmOrder() {
      console.log("confirming");
      axios
        .post("/order/" + this.idCart)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // if index < -1 (obj not present) --> create the object
    // else update it
    save() {
      console.log("Item normal --> ", this.editedItem);

      if (this.editedIndex > -1) {
        console.log("update", this.editedItem);
        axios
          .patch("/product/" + this.editedItem.id, this.editedItem)
          .then(res => {
            console.log("res --> ", res);
            Object.assign(this.items_shop[this.editedIndex], res.data);
            store.data.setMessageAction("Piatto aggiornato con successo");
          })
          .catch(err => store.data.setMessageAction(err));
      } else {
        axios
          .post("/product", this.editedItem)
          .then(res => {
            this.items_shop.push(res.data); //restituire il nuovo dato inserito oppure solamente l'id
            store.data.setMessageAction("Piatto aggiunto con successo!");
          })
          .catch(err => {
            store.data.setMessageAction(err);
          });
      }
      this.close();
    }
    
  },

  created: function() {
    this.getProducts();
    this.getCategories();
  }
};
</script>
