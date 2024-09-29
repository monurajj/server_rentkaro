const { RoomDetails } = require("../Schemas/schemas");
const RoomDetailsRoutes = {
  path: "",
  routes: [
    // Route to get all rooms
    {
      method: "get",
      path: "/rooms",
      handler: async (req, res) => {
        try {
          console.log("Fetching rooms...");
          const rooms = await RoomDetails.find();
          console.log("Rooms fetched:", rooms.length);
          res.json(rooms);
        } catch (err) {
          console.error("Error fetching rooms:", err);
          res.status(500).json({ error: err.message });
        }
      },
    },
    // Route to get PG rooms
    {
      method: "get",
      path: "/rooms/roomtype/pg",
      handler: async (req, res) => {
        try {
          console.log("Fetching PG rooms...");
          const rooms = await RoomDetails.find({ Type: "PG" });
          console.log("PG Rooms fetched:", rooms.length);
          res.json(rooms);
        } catch (err) {
          console.error("Error fetching PG rooms:", err);
          res.status(500).json({ error: err.message });
        }
      },
    },
    // Route to get Hostels rooms
    {
        method:"get",
        path:"/rooms/roomtype/hostels",
        handler: async(req, res) =>{
            try {
                console.log("Fetching Hostel rooms...");
                const rooms = await RoomDetails.find({ Type: "Hostel" });
                console.log("Hostel Rooms fetched:", rooms.length);
                res.json(rooms);
              } catch (err) {
                console.error("Error fetching Hostels rooms:", err);
                res.status(500).json({ error: err.message });
              }
        }
    },
    // Route to get regular rooms
    {
        method:"get",
        path:"/rooms/roomtype/rooms",
        handler:async(req, res) =>{
            try {
                console.log("Fetching Rooms...");
                const rooms = await RoomDetails.find({ Type: "Room" });
                console.log("Rooms fetched:", rooms.length);
                res.json(rooms);
              } catch (err) {
                console.error("Error fetching rooms:", err);
                res.status(500).json({ error: err.message });
              }
        }
    }
  ]
};


module.exports = RoomDetailsRoutes;
