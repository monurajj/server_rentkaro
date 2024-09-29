const { RoomDetails, Users } = require('../Schemas/schemas');
const bcrypt = require('bcryptjs');
const { generateJwt, verifyJwt } = require("./MiddleWare");

const RoomManagementRoutes = {
    path: "",
    routes: [
        // i am adding new rooms here
        {
            method: "post",
            path: "/add-room",
            handler: async (req, res) => {
                const { ownerEmail, roomDetails } = req.body;

                if (!ownerEmail || !roomDetails) {
                    return res.status(400).send({ message: "Owner email and room details are required" });
                }

                try {
                    // checking if roomowner is in our list or not
                    const owner = await Users.findOne({ email: ownerEmail, role: "owner" });
                    if (!owner) {
                        return res.status(404).send({ message: "Owner not found" });
                    }

                    // Create a new room entry
                    const newRoom = new RoomDetails({
                        ...roomDetails,
                        OwnerContacts: owner.email,
                        OwnerName: owner.username
                    });

                    // Save the room details
                    await newRoom.save();
                    return res.status(200).send({ message: "Room added successfully", roomId: newRoom._id });
                } catch (e) {
                    console.error(e);
                    return res.status(500).send({ message: "Something went wrong" });
                }
            }
        },

        // Update room details(if jarurat pade)
        {
            method: "put",
            path: "/update-room/:roomId",
            handler: async (req, res) => {
                const { roomId } = req.params;
                const { roomDetails } = req.body;

                if (!roomId || !roomDetails) {
                    return res.status(400).send({ message: "Room ID and updated room details are required" });
                }

                try {
                    // Find and update the room
                    const updatedRoom = await RoomDetails.findByIdAndUpdate(roomId, roomDetails, { new: true });
                    if (!updatedRoom) {
                        return res.status(404).send({ message: "Room not found" });
                    }

                    return res.status(200).send({ message: "Room updated successfully", updatedRoom });
                } catch (e) {
                    console.error(e);
                    return res.status(500).send({ message: "Something went wrong" });
                }
            }
        },

        // Remove room
        {
            method: "delete",
            path: "/remove-room/:roomId",
            handler: async (req, res) => {
                const { roomId } = req.params;

                if (!roomId) {
                    return res.status(400).send({ message: "Room ID is required" });
                }

                try {
                    // Finding  and delete the room(i am currently using roomId)
                    const deletedRoom = await RoomDetails.findByIdAndDelete(roomId);
                    if (!deletedRoom) {
                        return res.status(404).send({ message: "Room not found" });
                    }

                    return res.status(200).send({ message: "Room removed successfully" });
                } catch (e) {
                    console.error(e);
                    return res.status(500).send({ message: "Something went wrong" });
                }
            }
        }
    ]
};

module.exports = RoomManagementRoutes;
