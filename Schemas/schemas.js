const mongoose = require("mongoose");

const roomDetailsSchema = new mongoose.Schema({
    id: String,
    Name: String,
    Type: String,
    State: String,
    City: String,
    RoomType: String,
    Occupancy: String,
    Gender: String,
    Address: String,
    Landmark: String,
    Rating: String,
    TotalRating: String,
    Review: String,
    TotalPrice: String,
    TotalDiscount: String,
    ActualPrice: String,
    Availability: String,
    AvailableFrom: String,
    MinimumStay: String,
    Description: String,
    OwnerContacts: String,
    OwnerName: String,
    Facilities: Object,
    Policies: Object,
    OtherFacilities: Object,
    NearbyAmenities: Object,
    Images: Object,
    VirtualTour: String,
    BookingOptions: Object,
    SpecialOffers: Object,
    Reviews: Array,
  }, { collection: 'RoomDetails' });
  
  const RoomDetails = mongoose.model('RoomDetails', roomDetailsSchema);

  const userDetailsSchema = new mongoose.Schema({
    username:String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    role:String,
    bookmarks:[Object],
    user:String

},{collection: 'Users'});
const Users  = mongoose.model('Users',userDetailsSchema);


module.exports = {RoomDetails,Users};

  