<template>
  <v-app>
    <v-container fluid>
      <v-col class="md-12">
        <v-card>
          <v-card-title>
            <h3>Suppliers</h3>
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
            
            loading-text="Caricamento..."
            no-data-text="No suppliers presents"
            :headers="headers"
            :items="items_shop"
            :search="search"
          >
            <!-- action inputs -->
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>

            <!-- Change data -->
            <template v-slot:top>
              <v-toolbar color="secondary" flat>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialogModify" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on" to="/add">New Item</v-btn>
                  </template>
                  <v-card>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              :rules="nameRules"
                              v-model="editedItem.productName"
                              label="Nome Supplier"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              class="pa-3"
                              label="unita di misura"
                              v-model="editedItem.type"
                              item-text="str"
                              item-value="id"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              :rules="priceRules"
                              v-model="editedItem.price"
                              label="Prezzo"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              :rules="quantityRules"
                              v-model="editedItem.quantity"
                              label="Quantita"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              :rules="vendorRules"
                              v-model="editedItem.imgLink"
                              label="Link immagine"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="6">
                            <v-img
                              :src="editedItem.image"
                              height="100%"
                              width="100%"
                              class="grey darken-4"
                              alt="Loading..."
                            ></v-img>
                          </v-col>
                          <v-col cols="12" sm="12" md="6">
                            <v-textarea
                              label="Description"
                              v-model="editedItem.productDescription"
                              :value="editedItem.productDescripti"
                              hint="Add a productDescription"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-container>
  </v-app>
</template>


<script>
import axios from "../../../../lib/axios-console";
import store from "../../../../lib/store";

export default {
  data() {
    return {
      valid: false,
      dialogModify: false,
      dialogDelete: false,
      search: "",
      headers: [
        { text: "Id", value: "id" },
        {
          text: "Nome supplier",
          align: "start",
          sortable: true,
          value: "supplierName"
        },
        { text: "Iva", value: "supplierIva" },
        {
          text: "Indirizzo",
          value: "user.addresses[0].municipality.municipalityName"
        },
        {
          text: "Nazione",
          value: "user.addresses[0].nationality.nationalityName"
        },
        { text: "Actions", value: "actions", sortable: false }
      ],
      items_shop: [],
      editedIndex: -1,
      editedItem: {
        type: "piece",
        productName: "ciao",
        productDescription: "il piu bel ciao mai visto",
        imgLink: "prova",
        price: 1.23,
        categories: [1, 2, 3]
      },
      defaultItem: {
        type: "piece",
        productName: "ciao",
        productDescription: "il piu bel ciao mai visto",
        imgLink: "prova",
        price: 1.23,
        categories: [1, 2, 3]
      },

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
    getAllItemShop() {
      axios
        .get("/suppliers")
        .then(res => {
          this.items_shop = res.data;
          store.data.setMessageAction(res.status);
        })
        .catch(err => {
          store.data.setMessageAction(err);
        });
    },

    editItem(item) {
      this.editedIndex = this.items_shop.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogModify = true;
    },

    //fatto
    deleteItem(item) {
      console.log(item);
      const index = this.items_shop.indexOf(item);

      if (confirm("Sicuro di voler cancellare il prodotto?")) {
        axios
          .delete("/supplier", {
            params: {
              supplierId: item.id
            }
          })
          .then(res => {
            console.log(res);
            this.items_shop.splice(index, 1);
          })
          .catch(err => console.log(err));
      }
    },

    close() {
      this.dialogModify = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  },

  created: function() {
    this.getAllItemShop();
  }
};
</script>
