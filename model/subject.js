var mongoose = require('mongoose');
var Subject = mongoose.model('subject',{
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    semester:{
        type : String
    },
    subjects : {
        type : Array
    }
});


module.exports = {Subject};