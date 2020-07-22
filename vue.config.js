const path = require("path");

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  outputDir: path.resolve(__dirname, "../backend-common/src/main/resources/static/")
}