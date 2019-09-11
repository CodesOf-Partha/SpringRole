var mongoose = require('mongoose');
var RoleMapping = mongoose.model('rolemapping',{
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        require : true
    },
    roleId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'role',
        require : true
    }
});


module.exports = {RoleMapping};