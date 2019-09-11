var mongoose = require('mongoose');
var Role = mongoose.model('role',{
    role : {
        type : String,
        require : true
    }
});


module.exports = {Role};