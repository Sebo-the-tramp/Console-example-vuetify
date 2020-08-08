<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-col cols="12" sm="3" md="3" class="ma-0 pa-0">
            <v-avatar color="blue" size="36">
              <img v-if="info.img != null" :src="info.img" :alt="info.name" />
              <span v-else class="white--text headline">{{info.initial}}</span>
            </v-avatar>
          </v-col>
          <v-col class="ma-0 pa-0">
            <v-list-item-title class="title">{{info.name}}</v-list-item-title>
            <v-list-item-subtitle>{{role}}</v-list-item-subtitle>
          </v-col>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item :to="page.path" v-for="page in pages" :key="page.path">
          <v-list-item-action>
            <v-icon>{{ page.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ page.text}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar display app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Dashboard</v-toolbar-title>
      <v-spacer />
      <v-btn icon color="white" @click="toggleTheme">
        <v-icon v-if="isDark()">mdi-lightbulb</v-icon>
        <v-icon v-else>mdi-lightbulb-on-outline</v-icon>
      </v-btn>
      <v-btn icon color="white" @click="dialog=true">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view class="background"></router-view>
    </v-content>

    <v-footer color="primary" app>
      <span class="white--text">Refill &copy;2020</span>
    </v-footer>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Sei sicuro di uscire</v-card-title>

        <v-card-text>Le tue credenziali verranno cancellate dalla memoria e dovrai effettuare di nuovo il login per rientrare</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="dialog = false">No</v-btn>

          <v-btn color="primary" text @click="logout">Si</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="store.data.state.show" align="center">{{ store.data.state.message }}</v-snackbar>
  </v-app>
</template>

<script>
import axios from "../../lib/axios-console";
import store from "../../lib/store";

export default {
  props: {
    source: String,
  },
  data: () => ({
    pagesAdmin: [
      { icon: "mdi-chart-line", path: "/statistics", text: "Statistics" },      
      { icon: "mdi-book-open-outline", path: "/docs",text: "API documentation"}
    ],
    pagesUser: [
      { icon: "mdi-plus", path: "/welcome", text: "Add List" },      
    ],
    pages: [],
    drawer: false,
    shop_list: [{ item_shop: null }],
    dialog: false,
    store: store,
    role: null,
    info: { name: "", initial: "", img: null },
  }),
  methods: {
    changeroute(value) {
      //console.log(value, "thisRotute", parseInt(this.$route.params.shop_id));
      if (value != parseInt(this.$route.params.shop_id)) {
        //console.log(this.shop_list);
        this.$router.push({
          name: this.$router.name,
          params: { shop_id: value },
        });
        var first = value;
        var result = this.shop_list.splice(this.shop_list.indexOf(first), 1);
        this.shop_list.unshift(result[0]);
        //console.log(this.shop_list);
      }
    },
    logout() {
      localStorage.removeItem("human_id");
      localStorage.removeItem("token");
      localStorage.removeItem("expiration");
      localStorage.removeItem("roles");
      this.$router.push({ name: "login" });
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    isDark() {
      return !this.$vuetify.theme.dark;
    },
    getDataUser(userType) {
      console.log(userType);
      console.log("getting data of the user");
      axios
        .get("/user/info")
        .then((res) => {
          console.log(res.data);
          this.info.name = res.data[userType].name;
          this.info.initial = this.getInitials(res.data[userType].name);
          this.info.img = res.data[userType].image;
        })
        .catch((err) => {
          this.info = { name: "Sebastian Cavada" };
          this.info.initial = "SC";
          console.log(err);
        });
    },
    getInitials(str) {
      var newmsg = str.replace(/[a-z]/g, "");
      return newmsg;
    },
  },

  created() {
    //update the item otherwise you need to reload the whole page in order for the new token to be sent
    axios.defaults.headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
    };

    var role = localStorage.getItem("roles");
    console.log(role);

    store.data.setMessageAction("Benvenuto!");
  },
};
</script>