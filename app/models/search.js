var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
const user=require('./user.js');

function getSearchResults(userSearchCriteria,callback){

   var roomSharing=userSearchCriteria.roomSharing-1;
   var pet=userSearchCriteria.pet-1;
   var smoke=userSearchCriteria.smoke-1;
   var visitors=userSearchCriteria.visitors-1;
   var drink=userSearchCriteria.drink-1;
   var veg=userSearchCriteria.veg-1;
   var livingPreference=userSearchCriteria.livingPreference-1;//gender
   var minAge=userSearchCriteria.minAge;
   var maxAge=userSearchCriteria.maxAge;
   var minBudget=userSearchCriteria.minBudget;
   var maxBudget=userSearchCriteria.maxBudget;
   var summary=userSearchCriteria.summary;

    if(veg==2)
        veg=null;
    else if(veg==1)
        veg=0;  
    else veg=1;

    var query={
        dietary:veg
    };

   if(roomSharing==2)
       roomSharing=null;
   else {
       if (roomSharing == 1)
           roomSharing = 0;
       else roomSharing = 1;
       query.room=roomSharing;
   }
   if(pet==2)
       pet=null;
   else {
       if (pet == 1)
           pet = 0;
       else pet = 1;
       query.pet=pet;
   }
   if(smoke==2)
       smoke=null;
   else {
       if (smoke == 1)
           smoke = 0;
       else smoke = 1;
       query.smoking=smoke;
   }
   if(visitors==2)
       visitors=null;
   else {
       if (visitors == 1)
           visitors = 0;
       else visitors = 1;
       query.visitors=visitors;
   }
   if(drink==2)
       drink=null;
   else
       query.drinking=drink;
   //else if(drink==1)
     //  drink=0;
   //else drink=1;

   if(livingPreference==2)
       livingPreference=null;
   else {
       if (livingPreference == 1)
           livingPreference = 0;
       else livingPreference = 1;
       query.gender=livingPreference
   }

   if(minAge==null ||maxAge==null)
   {
       minAge=null;
       maxAge=null;
   }

   /*
   if(livingPreference) query.gender=livingPreference
    if(drink) query.drinking=drink;
    if(smoke) query.smoking=smoke;
    if(roomSharing) query.room=roomSharing;
    /*if(pet!=null) query.pet=pet;
    if(visitors!=null) query.visitors=visitors;
    if(summary!=null) query.Summary=summary;
*/

    console.log('searched query dietary '+veg);
    console.log('searched query gender '+livingPreference);
    console.log('searched query drinking '+drink);
    console.log('searched query smoke '+smoke);
    console.log('searched query room '+roomSharing);

    console.log('my query dietary '+query.dietary);
    console.log('my query gender '+query.gender);
    console.log('my query drinking '+query.drinking);
    console.log('my query smoke '+query.smoking);
    console.log('my query room '+query.room);

    //{"room":{"$ne":null}{ $and : [ {'first_name' : { $ne:null }, {'first_name' :'value_A' }]}
    //MyModel.paginate({}, 2, 10,
   /*user.find( { $or:[ {$and: [{'room':{"$ne":null}}, {'room':roomSharing}]},
                {$and :[{'gender':{"$ne":null}},{'gender':livingPreference}]},
                {$and:[{'smoking':{"$ne":null}},{'smoking':smoke}]},
                {$and:[{'dietary':{"$ne":null}},{'dietary':veg}]},
                {$and:[{'drinking':{"$ne":null}},{'drinking':drink}]},
                {$and:[{'pet':{"$ne":null}},{'pet':pet}]},
                {$and:[{'visitors':{"$ne":null}},{'visitors':visitors}]},
                {$and:[{'age':{"$ne":null}},{'age':{"$gt":minAge}},{'age':{"$lt":maxAge}}]},
                {$and:[{'min_budget':{"$ne":null}},{'min_budget':{"$gt":minBudget}}]},
                {$and:[{'max_budget':{"$ne":null}},{'max_budget':{"$lt":maxBudget}}]},
                //{$and:[{'Summary':{"$ne":null}},{'Summary':{ $search: "summary" }},{'Summary':{$caseSensitive: false}}]}
                {$and:[{$text:{$search:summary}}]}
            ]},*/
    user.find(query,
        function(err,users){

            if(!err)
                console.log(users.length)
            //if no users are returned, in case of nothing being searched, return all users
            if(users==null ||users.length==0) {
                user.find({}, function(err, allusers) {
                    callback(allusers);
                })
            }
            else
                callback(users);
        });

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

