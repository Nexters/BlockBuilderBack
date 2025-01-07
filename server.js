const express = require("express");
const app = express();
const port = 3000;
const newSvc = require("./services/newsService");

app.use(express.static("public"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

newSvc.scheduleDataFetching();
app.use(require("./src/routes"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
