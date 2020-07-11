<template>
  <v-app>
    <v-container fluid>
      <v-col class="md-12">
        <v-card class="secondary" dark>
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
            :items="items_shop"
            :search="search"
          >
            <!-- adding the sign of the price -->
            <template v-slot:item.price="{ item }">{{ item.price + " €" }}</template>
            <!-- Top Slot -->
            <template v-slot:top>
              <v-toolbar flat class="secondary" dark>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px" @click:outside="close">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Aggiungi piatto</v-btn>
                  </template>
                  <v-card>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              :rules="nameRules"
                              v-model="editedItem.productName"
                              label="Nome prodotto"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-select
                              class="pa-3"
                              label="Categoria"
                              v-model="editedItem.category"
                              :items="categoriesGlobal"
                              item-text="categoryName"
                              item-value="id"
                              return-object
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-text-field
                              :rules="priceRules"
                              v-model="editedItem.price"
                              label="Prezzo"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-textarea
                              label="Descrizione ed ingredienti"
                              v-model="editedItem.productDescription"
                              :value="editedItem.productDescripti"
                              hint="inserisci gli ingredienti e una corta descrizione (opzionale)"
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" sm="10" md="6">
                            <v-file-input
                              prepend-icon="mdi-camera"
                              multiple
                              label="File input"
                              @change="saveImage"
                              @click:clear="resetImage"
                            ></v-file-input>
                          </v-col>
                          <v-col cols="12" sm="2" md="1">
                            <v-progress-circular
                              class="mt-5"
                              rotate="0"
                              size="32"
                              :value="loadingValue"
                              width="4"
                              color="light-blue"
                            >{{ loadingValue }}</v-progress-circular>
                          </v-col>
                          <v-col cols="12" sm="12" md="6" class="justify-center">
                            <v-img
                              :src="computeLink(editedItem.imgLink)"
                              width="200px"
                              height="200px"
                              class="grey darken-4"
                              alt="Loading..."
                            ></v-img>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-icon
                v-if="item.showProduct"
                small
                class="mr-2"
                @click="toggleShowProduct(item)"
              >mdi-eye</v-icon>
              <v-icon v-else small class="mr-2" @click="toggleShowProduct(item)">mdi-eye-off</v-icon>
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
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
import url from "../../../../lib/url";

export default {
  data() {
    return {
      valid: false,
      dialog: false,
      submit: false,

      // TABLE
      search: "",
      headers: [
        { text: "Id", value: "id" },
        {
          text: "Nome piatto",
          align: "start",
          sortable: true,
          value: "productName"
        },
        { text: "Prezzo", value: "price" },
        { text: "Categoria", value: "category.categoryName" },
        { text: "Actions", value: "actions", sortable: false }
      ],

      // ITEMS
      items_shop: [],
      editedIndex: -1,
      editedItem: {
        type: "piece",
        productName: "",
        productDescription: "",
        imgLink: "",
        price: null,
        category: [{ id: null }],
        showProduct: true
      },
      defaultItem: {
        type: "piece",
        productName: "",
        productDescription: "",
        imgLink: "",
        price: null,
        category: [{ id: null }],
        showProduct: true
      },
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
        .get("/products/supplier")
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

    toggleShowProduct(item) {
      console.log(item.id);
      axios
        .post("/product/toggle/" + item.id)
        .then(res => {
          item.showProduct = res.data;
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
    },
    saveImage(files) {
      if (files[0]) {
        var formData = new FormData();
        formData.append("imageFile", files[0], files[0].name);

        axios
          .post("/image/upload", formData, {
            onUploadProgress: progressEvent => {
              this.loadingValue =
                (progressEvent.loaded / progressEvent.total) * 100;
            }
          })
          .then(res => {
            //some latency in order to prevent errors and give the server some time to save the image
            setTimeout(() => {
              this.editedItem.imgLink = res.data;
              this.submit = true;
            }, 300);
          })
          .catch(err => console.log(err));
      }
    },

    resetImage() {
      this.loadingValue = 0;
      this.editedItem.imgLink = "";
    },

    computeLink(name) {
      if (name == "") {
        return url.url + "/images/server/alt.png";
      } else {
        return url.url + "/images/uploaded/" + name;
      }
    }
  },

  created: function() {
    this.getProducts();
    this.getCategories();
  }
};
</script>
