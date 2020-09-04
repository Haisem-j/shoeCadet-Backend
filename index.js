const express = require('express')
const cors = require('cors');
const morgan = require('morgan');
const Method = require('method-override');
const app = express()

// Port
const port = 5000 || process.env.port;

//Import Routes
const shoeRoute = require('./routes/shoeRelease');
const paymentRoute = require('./routes/payments');
const authRoute = require('./routes/auth');

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Method('_method'));
// Route Middlewares
app.use(morgan('common'));
app.use('/api/shoes', shoeRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})