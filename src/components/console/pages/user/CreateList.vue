<template>
  <v-app>
    <h1>List</h1>

    <v-card class="mx-auto pa-5" max-width="344" outlined>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">CREATE A NEW LIST</v-list-item-title>
          <v-list-item-subtitle>Create a name for your list</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-text-field v-model="data.name" :counter="15" label="Name"></v-text-field>

      <v-card-actions>
        <v-btn text @click="cancel()">Cancel</v-btn>
        <v-btn text @click="createList()">Create</v-btn>
      </v-card-actions>
    </v-card>
   
    <v-data-table
      loading-text="Caricamento..."
      no-data-text="Aggiungi un piatto per cominciare"
      :headers="headers"
      :items="dataList"
    >

      <!-- Top Slot -->
      <template v-slot:top>
        <v-toolbar color="secondary" flat>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small @click="deleteList(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-app>
</template>

<script>
import axios from "../../../../lib/axios-console";
import store from "../../../../lib/store";

export default {
  data: () => ({
    data: {
      name: "",
      description: "beneeee",
      isCart: true
    },
    deleteData: 2,
    headers: [
      { text: "Id", value: "id" },
      { text: "Name", value: "listName" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    dataList: []
  }),
  created() {
    this.getLists();
  },
  methods: {
    createList() {
      axios
        .post("/list/", this.data)
        .then(res => {
          //this.data_supplier = res.data[0];
          store.data.setMessageAction(res.status);
        })
        .catch(err => {
          store.data.setMessageAction(err);
        });
    },

    deleteList(item) {
      console.log(item);
      axios
        //understand if we can pass an object in the requestbody
        .delete("/list/" + item.id)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },

    getLists() {
      console.log("getting lists");
      axios
        //understand if we can pass an object in the requestbody
        .get("/list/")
        .then(res => {
          console.log(res.data)
          this.dataList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    cancel() {
      this.name = "";
    }
  }
};
</script>
