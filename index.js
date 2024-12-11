const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.use(express.json());

const routes = require('./AllApis/AllRoutes')
// console.log(routes.);
const mongoURI = process.env.MONGO_URI;


// connect to mongodb
mongoose.connect(mongoURI, {
  useNewUrlParser: true, //these are not nesseccery when we are using atlas
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully');
    console.log('Connected to database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


// routes.forEach((route)=>{
//   route.routes.forEach((myRoutes)=>{
//     app[myRoutes.method](route.path+myRoutes.path,myRoutes.handler);
//   })
// })
routes.forEach((route)=>{
  route.routes.forEach((d)=>{
      app[d.method](route.path + d.path, d.handler);
  })
})



// Catch-all route for undefined routes
app.use((req, res) => {
  console.log('404 - Route not found:', req.url);
  res.status(404).send('Route not found');
});

app.get('/', (req, res)=>{
  res.status(200).send("Hello backend")
})

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server started at ${new Date().toISOString()}`);
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});