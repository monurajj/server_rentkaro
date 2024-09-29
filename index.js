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





// // Middleware to log all incoming requests
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   next();
// });

// app.get('/jai/rooms', async (req, res) => {
//   console.log('Route /jai/rooms hit');
//   try {
//     console.log("Fetching rooms...");
//     const rooms = await RoomDetails.find();
//     console.log("Rooms fetched:", rooms.length);
//     res.json(rooms);
//   } catch (err) {
//     console.error('Error fetching rooms:', err);
//     res.status(500).json({ error: err.message });
//   }
// });
// // pg's
// app.get('/jai/rooms/roomtype/pg', async (req, res) => {
//   console.log('Route /jai/rooms/roomtype/pg hit');
//   try {
//     console.log("Fetching PG rooms...");
//     const rooms = await RoomDetails.find({Type:"PG"});
//     console.log("PG Rooms fetched:", rooms.length);
//     res.json(rooms);
//   } catch (err) {
//     console.error('Error fetching PG rooms:', err);
//     res.status(500).json({ error: err.message });
//   }
// });
// // hostels
// app.get('/jai/rooms/roomtype/hostels', async (req, res) => {
//   // console.log('Route /jai/rooms/roomtype/Hostels hit');
//   try {
//     console.log("Fetching PG rooms...");
//     const rooms = await RoomDetails.find({Type:"Hostel"});
//     console.log("Hostels Rooms fetched:", rooms.length);
//     res.json(rooms);
//   } catch (err) {
//     console.error('Error fetching Hostels rooms:', err);
//     res.status(500).json({ error: err.message });
//   }
// });
// // Rooms
// app.get('/jai/rooms/roomtype/rooms', async (req, res) => {
//   // console.log('Route /jai/rooms/roomtype/rooms hit');
//   try {
//     console.log("Fetching Rooms rooms...");
//     const rooms = await RoomDetails.find({Type:"Room"});
//     console.log("Rooms Rooms fetched:", rooms.length);
//     res.json(rooms);
//   } catch (err) {
//     console.error('Error fetching Rooms rooms:', err);
//     res.status(500).json({ error: err.message });
//   }
// });
// // homeImage
// app.get('/jai/dashboard/homeimages', async (req, res) => {
//   // console.log('Route /jai/rooms/roomtype/rooms hit');
//   try {
//     console.log("Fetching homeimages ...");
//     const rooms = await RoomDetails.find({id:"homepageImage"});
//     console.log("homepageImage fetched:", rooms.length);
//     res.json(rooms);
//   } catch (err) {
//     console.error('Error fetching homepageImage:', err);
//     res.status(500).json({ error: err.message });
//   }
// });
// // aboutPageImage
// app.get('/jai/about/aboutimages', async (req, res) => {
//   // console.log('Route /jai/rooms/roomtype/rooms hit');
//   try {
//     console.log("Fetching homeimages ...");
//     const rooms = await RoomDetails.find({id:"AboutpageImage"});
//     console.log("AboutpageImage fetched:", rooms.length);
//     res.json(rooms);
//   } catch (err) {
//     console.error('Error fetching AboutpageImage:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Add a new room
// app.post('/jai/rooms', async (req, res) => {
//   console.log('Route /jai/rooms hit for adding a room');
//   const newRoom = new RoomDetails(req.body);

//   try {
//     const savedRoom = await newRoom.save();
//     console.log('Room added successfully:', savedRoom);
//     res.status(201).json(savedRoom);
//   } catch (err) {
//     console.error('Error adding room:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Delete a room by ID
// app.delete('/jai/rooms/:id', async (req, res) => {
//   const { id } = req.params;
//   console.log(`Route /jai/rooms/${id} hit for deleting a room`);

//   try {
//     const deletedRoom = await RoomDetails.findByIdAndDelete(id);
    
//     if (!deletedRoom) {
//       return res.status(404).json({ message: 'Room not found' });
//     }
    
//     console.log('Room deleted successfully:', deletedRoom);
//     res.status(200).json({ message: 'Room deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting room:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

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