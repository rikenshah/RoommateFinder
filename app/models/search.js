var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
const user=require('./user.js');

function getSearchResults(userSearchCriteria,callback){
    console.log('inside are'+userSearchCriteria);
   var roomSharing=userSearchCriteria.roomSharing;
   var pet=userSearchCriteria.pet;
   var smoke=userSearchCriteria.smoke;
   var visitors=userSearchCriteria.visitors;
   var drink=userSearchCriteria.drink;
   var veg=userSearchCriteria.veg;
   var livingPreference=userSearchCriteria.livingPreference;//gender

   if(roomSharing==3)
       roomSharing=null;
   if(pet==3)
       pet=null;
   if(smoke==3)
       smoke=null;
   if(visitors==3)
       visitors=null;
   if(drink==3)
       drink=null;
   if(veg==3)
       veg=null;
   if(livingPreference==3)
       livingPreference=null;

    user.find( { $or:[ {'room':roomSharing}, {'gender':livingPreference}, {'smoking':smoke}, {'dietary':veg}, {'drinking':drink}, {'pet':pet}, {'visitors':visitors} ]},
        function(err,users){

            if(!err) console.log(users)//res.send(docs);
            callback(users);
        });


    //user.findOne("Himani Himani")
    //callback('true');
}

/*userSchema.index({ "age": 1});//see if age need to be within a range?
userSchema.index({ "gender": 1});//living preference
userSchema.index({ "dietary": 1 });
userSchema.index({ "drinking": 1});
userSchema.index({ "smoking": 1});
userSchema.index({ "room": 1});//room sharing
userSchema.index({ "pet": 1});//pet friendly
userSchema.index({ "visitors": 1 });
userSchema.index({"Summary":"text"});
*/
module.exports =
    {
        getSearchResults
    };

