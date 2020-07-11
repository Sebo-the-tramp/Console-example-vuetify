<template>
  <v-app>
    <v-container fluid>
      <v-col class="md-12">
        <v-card style="height:80px">
          <v-row align="center" justify="center" style="height:80px">
            <h2 v-if="data_supplier==null">Settings:</h2>
            <h2 v-else>Add supplier</h2>
          </v-row>
        </v-card>

        <v-card class="mt-5 pa-10 secondary">
          <v-row>
            <h3>Dati generali</h3>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="data_supplier.supplier.supplierName"
                label="Nome"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="data_supplier.supplier.supplierIva"
                label="Partita Iva"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
                v-model="data_supplier.supplier.description"
                label="Descrizione"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <h3 v-if="data_supplier.addresses.length == 1">Indirizzo</h3>
            <h3 v-else>Indirizzi</h3>
            <v-spacer></v-spacer>
            <v-btn color="primary" x-small fab @click="addAddress">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-row>
          <v-row v-for="(address,i) in data_supplier.addresses" v-bind:key="i">
            <v-col cols="12" md="1">
              <v-btn color="primary" x-small fab class="mt-6 ml-3" @click="removeAddress(i)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="12" md="11">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    :rules="[rules.required]"
                    v-model="address.type"
                    label="type"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    :rules="[rules.required]"
                    v-model="address.addressStreet"
                    label="street"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    :rules="[rules.required, rules.number]"
                    v-model="address.addressNumber"
                    label="numero"
                    required
                  ></v-text-field>
                </v-col>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      class="pa-3"
                      label="comune"
                      :items="municipalities"
                      item-text="municipality_name"
                      item-value="municipality_id"
                      v-model="address.municipalityId"
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      class="pa-3"
                      label="nazione"
                      :items="nationalities"
                      item-text="nationality_name"
                      item-value="nationality_id"
                      v-model="address.nationalityId"
                      :rules="[rules.required]"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      class="pa-3"
                      label="provincia"
                      :items="counties"
                      item-text="countyName"
                      item-value="countyId"
                      v-model="address.countyId"
                      :rules="[rules.required]"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <h3>Login</h3>
          </v-row>
          <v-row>
            <v-col cols="12" md="6" sm="12">
              <v-text-field v-model="data_supplier.userAuth.username" label="mail"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field
                v-model="data_supplier.userAuth.password"
                :append-icon="showPsw ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="showPsw ? 'text' : 'password'"
                name="input-10-1"
                label="password"
                hint="At least 8 characters"
                counter
                @click:append="showPsw = !showPsw"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" sm="12">
              <v-text-field
                v-model="data_supplier.telephone"
                label="telefono"
                :rules="[rules.required, rules.number]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field
                :rules="[rules.required]"
                v-model="data_supplier.image"
                label="Link immagine"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <v-row align="center" justify="center">
          <div class="my-2">
            <v-btn
              class="primary"
              :disabled="!formIsValid"
              v-if="data_supplier != null"
              @click="saveSupplier"
            >Aggiungi commerciante</v-btn>
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
      data_supplier: {
        type: "supplier",
        supplier: {
          supplierName: "felicetti",
          supplierIva: "09382402934823",
          supplierLat: 23.2343,
          supplierLong: 23.1231,
          description: ""
        },
        addresses: [
          {
            addressNumber: 32,
            addressStreet: "Via Merda",
            type: "work",
            countyId: 92,
            municipalityId: 1,
            nationalityId: 1
          }
        ],
        userAuth: {
          username: "sdfsdfsdfsdf@dev.com",
          password: "asdasdasd",
          enabled: true
        }
      },

      //other variables
      municipalities: [],
      nationalities: [],
      counties: [],
      categories: [],
      categories_id: [],
      prefix: [39, 44],
      showPsw: false,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        number: v => Number.isInteger(Number(v)) || "Inserire un numero intero"
      }
    };
  },

  methods: {    
    saveSupplier() {
      console.log(this.data_supplier);
      axios
        .post("/supplier", this.data_supplier)
        .then(res => {
          //this.data_supplier = res.data[0];
          store.data.setMessageAction(res.status);
        })
        .catch(err => {
          store.data.setMessageAction(err);
        });
    },
    getDataMunicipalities() {
      axios
        .get("data/municipalities")
        .then(res => {
          this.municipalities = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDataNationalities() {
      axios
        .get("data/nationalities")
        .then(res => {
          console.log(res.data);
          this.nationalities = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDataCounties() {
      axios
        .get("data/counties", null, {
          params: {
            token: localStorage.getItem("token")
          }
        })
        .then(res => {
          console.log(res.data);
          this.counties = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCategories() {
      axios
        .get("/categories", {
          params: {
            human_id: localStorage.getItem("human_id"),
            token: localStorage.getItem("token")
          }
        })
        .then(res => {
          this.categories = res.data;
          console.log("categories:", res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    addAddress() {
      var data = {
        addressNumber: null,
        addressStreet: "",
        type: "",
        countyId: null,
        municipalityId: null,
        nationalityId: null
      };
      this.data_supplier.addresses.push(data);
    },
    removeAddress(index) {
      this.data_supplier.addresses.splice(index, 1);
    }
  },
  watch: {},
  created: function() {
    this.getDataMunicipalities();
    this.getDataNationalities();
    this.getDataCounties();
    var role = localStorage.getItem("roles");
    if (!role.includes("ADMIN")) {
      this.$router.push({
        name: "login"
      });
    }
  },
  computed: {
    formIsValid() {
      return true;
      /*
        this.data_supplier.name &&
        this.data_supplier.description &&
        this.data_supplier.address_street &&
        this.data_supplier.address_number &&
        this.data_supplier.municipality_id &&
        this.data_supplier.mail &&
        this.data_supplier.password &&
        this.data_supplier.image &&
        this.data_supplier.telephone &&
        this.data_supplier.partita_iva &&
        this.data_supplier.nationality_id
        */
    }
  }
};
</script>
