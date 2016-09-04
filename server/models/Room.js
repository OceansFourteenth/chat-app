var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
    name: {type: String, required: true},
    creator: {type: String, required: true},
    allowedUsers: [{type: String}]    
});

module.exports = mongoose.model('Room', RoomSchema);