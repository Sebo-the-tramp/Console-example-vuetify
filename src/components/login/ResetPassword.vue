<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height background"
        fluid
        v-bind:style="{ 'background-image': 'url(' + image + ')', 'background-size': 'cover' }"
        @keydown.enter="login"
      >
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12 secondary rounded-xl">
              <v-toolbar color="primary" dark>
                <v-toolbar-title>Reset password</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="data.password"
                  />
                  <v-text-field
                    id="passwordCheck"
                    label="Password Check"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="data.passwordCheck"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col class="d-flex flex-row-reverse mr-3">
                    <v-btn @click="login" color="primary" dark>Reset</v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" align="center">{{ snackbarText }}</v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  props: {
    source: String
  },
  data: () => ({
    image:
      "https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80",
    data: {
      password: "",
      passwordCheck: "",
      token:""
    },
    snackbar: false,
    snackbarText: "Ciao",
    snackbarTimeout: 6000
  }),
  methods: {
    login() {
      if (this.data.password != "") {
        if (this.data.password == this.data.passwordCheck) {
          axios
            .post("/api/auth/signin", this.data)
            .then(res => {
              console.log(res); 
              this.$router.push({name:"login"})
            })
            .catch(err => {
              console.log(err);
              this.$router.push({name:"login"})

              this.snackbarText = err;
              this.snackbar = true;
              this.data.password = "";
            });
        } else {
          this.snackbarText = "The passwords does not match";
        }
      } else {
        this.snackbarText = "No password given";
      }
      this.snackbar = true;
    },
    validateMail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    pushForgotPage() {
      this.$router.push({ name: "resetPassword" }).catch(err => {
        throw new Error(`Problem handling something: ${err}.`);
      });
    }
  },
  created(){
    console.log(this.$route.query.token) // outputs 'yay'
    this.data.token = this.$route.query.token;
  }
};
</script>