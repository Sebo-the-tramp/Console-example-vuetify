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
                <v-toolbar-title>Supplier log-in</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Mail"
                    name="mail"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="data.username"
                    dark
                  />

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="data.password"
                    dark
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="login" color="primary" dark>Login</v-btn>
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
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80",
    data: {
      username: "",
      password: ""
    },
    snackbar: false,
    snackbarText: "Ciao",
    snackbarTimeout: 6000
  }),
  methods: {
    login() {
      if (this.data.username != "") {
        if (this.data.password != "") {
          if (this.validateMail(this.data.username)) {
            axios
              .post("/api/auth/signin", this.data)
              .then(res => {
                console.log(res);
                var data = res.data;
                if (data) {
                  localStorage.setItem("human_id", data["id"]);
                  localStorage.setItem("token", data["accessToken"]);
                  localStorage.setItem("expiration", data["expiration"]);
                  localStorage.setItem("roles", data["roles"]);
                  this.$router.push({ name: "console" });
                }
              })
              .catch(err => {
                console.log(err);

                this.snackbarText = err;
                this.snackbar = true;
                this.data.password = "";
              });
          } else {
            this.snackbarText = "Invalid email";
          }
        } else {
          this.snackbarText = "No password given";
        }
      } else {
        this.snackbarText = "No mail inserted";
      }
      this.snackbar = true;
    },
    validateMail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};
</script>