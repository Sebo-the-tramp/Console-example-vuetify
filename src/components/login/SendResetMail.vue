<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height background"
        fluid
        v-bind:style="{ 'background-image': 'url(' + image + ')', 'background-size': 'cover' }"
        @keydown.enter="sendMail"
      >
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12 secondary rounded-xl">
              <v-toolbar color="primary" dark>
                <v-toolbar-title>Supplier log-in</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-title>Reset your password</v-card-title>
              <v-card-text
                class="mt-2"
              >Insert your email and a link where you can reset your password will be sent</v-card-text>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Mail"
                    name="mail"
                    prepend-icon="mdi-account"
                    type="mail"
                    v-model="data.mail"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col class="d-flex flex-row-reverse mr-3">
                    <v-btn @click="resetPassword()" color="primary" dark>Reset Password</v-btn>
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
    source: String,
  },
  data: () => ({
    image:
      "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    data: {
      mail: "",
    },
    snackbar: false,
    snackbarText: "Ciao",
    snackbarTimeout: 6000,
  }),
  methods: {
    sendMail() {
      if (this.data.mail != "") {
        if (this.validateMail(this.data.mail)) {
          //api to send the reset mail
          axios
            .post("/api/auth/send_password_recovery_mail", {mail: this.data.mail}
            )
            .then(() => {
              
            })
            .catch((err) => {
              console.log(err);

              this.snackbarText = err;
              this.snackbar = true;
              this.data.password = "";
            });
        } else {
          this.snackbarText = "Invalid email";
        }
      } else {
        this.snackbarText = "No mail inserted";
      }
      this.snackbar = true;
    },
    validateMail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    resetPassword() {      
      //this.sendMail();
      this.$router.push({ name: "resetPassword" });
    },
  },
};
</script>