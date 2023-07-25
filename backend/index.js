const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
// middlewares
app.use(express.json({ extended: false }));

app.use('/payment', require('./paymentRoute'));

app.listen(port, () => console.log(`server started on port ${port}`));