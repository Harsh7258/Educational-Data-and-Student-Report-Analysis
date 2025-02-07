const dotenv = require("dotenv");
dotenv.config({ path: __dirname + '/.env' });
const express = require("express");
const bodyParser  = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./config/db");
const statisticsRoutes = require("./routes/cardsRoutes");

connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
const PORT = 5000;

app.get('/', async (req, res) => {
  res.json('server working');
});

app.use('/api/sheet-data', statisticsRoutes);

app.listen(PORT, () => {
    console.log(`server started: ${PORT}`);
})
