import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#8EBE53',
                secondary: '#ffffff',
                accent: '#ff0000',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',
                background: "dddddd"
            },
            dark: {
                primary: '#8EBE53',
                secondary: '#1E1E1E',
                background: "#30363D"
            },
        },
        dark:true
    },
});
