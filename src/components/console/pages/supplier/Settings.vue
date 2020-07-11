<template>
  <v-app>
    <v-container fluid >
      <v-col class="md-12 background">
        <v-card style="height:80px" class="secondary" dark>
          <v-row align="center" justify="center" style="height:80px">
            <h2 v-if="data_shop==null">Settings:</h2>
            <h2 v-else>Settings: {{data_shop.name}}</h2>
          </v-row>
        </v-card>
        <v-skeleton-loader v-if="data_shop == null" class="ma-5 pa-2" max-width="100%" type="card" dark></v-skeleton-loader>
        <v-card v-else class="mt-5 pa-10">
          <v-row>
            <h3>Dati generali</h3>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="data_shop.name" label="Nome" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="data_shop.delivery_cost"
                label="costo spedizione"
                required
                prefix="€"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field v-model="data_shop.description" label="Descrizione"></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12">
              <v-combobox
                v-model="categories_concat"
                :items="categories"
                chips
                clearable
                label="Categories"
                multiple
                prepend-icon="mdi-plus"
                solo
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip v-bind="attrs" :input-value="selected">
                    <strong>{{ item }}</strong>&nbsp;
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>
          </v-row>

          <v-row>
            <h3>Recapiti</h3>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="data_shop.mail" label="mail" required></v-text-field>
            </v-col>

            <v-col cols="12" md="1" sm="1">
              <v-select :value="data_shop.prefix" :items="prefix" label="prefix"></v-select>
            </v-col>
            <v-col cols="12" md="5" sm="4">
              <v-text-field v-model="data_shop.telephone" label="telephone" required></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <h3>Orari</h3>
          </v-row>
          <v-row class="px-4">
            <v-col cols="12" md="6">
              <v-select
                label="Aperto da"
                style="30px"
                :items="days"
                :value="data_shop.open_from_dow"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select label="fino a" :items="days" :value="data_shop.delivery_from_dow"></v-select>
            </v-col>
          </v-row>
          <v-row class="px-4">
            <v-col cols="12" md="6">
              <v-select
                label="Consegne da"
                style="30px"
                :items="days"
                :value="data_shop.open_from_dow"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select label="fino a" :items="days" :value="data_shop.delivery_to_dow"></v-select>
            </v-col>
          </v-row>
        </v-card>

        <v-row align="center" justify="center">
          <div class="my-2">
            <v-btn color="pink darken-1" dark v-if="data_shop != null" @click="saveShop">Save Data</v-btn>
          </div>
        </v-row>

        <v-skeleton-loader v-if="data_address.address_street==null" class="ma-5 pa-2" max-width="100%" type="card" dark></v-skeleton-loader>
        <v-card v-else class="mt-5 pa-10">
          <v-row>
            <h3>Indirizzo</h3>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field v-model="data_address.address_street" label="street" required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="data_address.address_number" label="numero" required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                class="pa-3"
                label="comune"
                v-model="data_address.municipality_id"
                :items="municipalities"
                item-text="municipality_name"
                item-value="municipality_id"
                @change="changeMunicipalitiesID"
              ></v-select>
            </v-col>
          </v-row>
        </v-card>

        <v-row align="center" justify="center">
          <div class="my-2">
            <v-btn
              color="pink darken-1"
              dark
              v-if="data_shop != null"
              @click="saveAddress"
            >Save Address</v-btn>
          </div>
        </v-row>
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
      data_shop: null,
      data_address: {
        address_street: null,
        address_number: null,
        municipality_id: null
      },
      municipalities: [],
      days: [
        "lunedì",
        "martedì",
        "mercoledì",
        "gìovedì",
        "venerdì",
        "sabato",
        "domenica"
      ],
      categories_concat: [],
      categories: ["Ortofrutta", "Alimentari", "Carne"],
      prefix: [39, 44],
      shop_id: this.$route.params.shop_id,
      measurements: ["kg", "pz"]
    };
  },

  methods: {
    remove(item) {
      this.data_shop.categories_concat.splice(this.chips.indexOf(item), 1);
      this.data_shop.categories_concat = [...this.data_shop.categories_concat];
    },
    getDataShop() {
      axios
        .get("/supplier/self")
        .then(res => {
          this.data_shop = res.data;
          store.data.setMessageAction(res.statusText);
          //if everything goes ok call address
        })
        .catch(err => {
          store.data.setMessageAction(err);
        });
      //console.log("done");
    },
    getDataAddress() {
      axios
        .get("/addresses", {
          params: {
            human_id: localStorage.getItem("human_id"),
            token: localStorage.getItem("token")
          }
        })
        .then(res => {
          console.log(res);
          this.data_address.address_street = res.data[0]["address_street"];
          this.data_address.address_number = res.data[0]["address_number"];
          this.data_address.municipality_id = res.data[0]["municipality_id"];
        })
        .catch(err => {
          console.log(err);
        });
      //console.log("done");
    },
    getDataMunicipalities() {
      axios
        .get("data/municipalities", {
          params: {
            human_id: localStorage.getItem("human_id"),
            token: localStorage.getItem("token")
          }
        })
        .then(res => {
          this.municipalities = res.data;
          //console.log("municipalities:", res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    saveShop() {
      axios
        .put("/shop", this.data_shop, {
          params: {
            human_id: localStorage.getItem("human_id"),
            token: localStorage.getItem("token")
          }
        })
        .then(res => {
          //this.saveCategories();
          //this.data_shop = res.data[0];
          store.data.setMessageAction("saved " + res);
        })
        .catch(err => {
          store.data.setMessageAction(err);
        });
    },

    saveAddress() {
      console.log(this.data_address);
      console.log(this.data_shop.address_id);
      //this.clean(this.data_address);
      axios
        .put("/addresses", this.data_address, {
          params: {
            human_id: localStorage.getItem("human_id"),
            token: localStorage.getItem("token")
          }
        })
        .then(res => {
          //this.data_shop = res.data[0];
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeMunicipalitiesID(value) {
      this.data_address.municipality_id = value;
    },
    clean(obj) {
      for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
          delete obj[propName];
        }
      }
    }
  },
  created: function() {
    this.getDataShop();
  },
  watch: {
    $route(to) {
      this.shop_id = to.params.shop_id;
      this.getDataShop();
      //this.getDataAddress();
    }
  }
};
</script>
