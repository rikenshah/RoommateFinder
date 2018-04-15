var userSchema = new Schema({
    roomSharing: String,
    drink: String,
    smoke:String,
    veg:String,
    age:String,
    budget:String,
    smoke:String,
    livingPreference:String
   // tags: { type: [String], index: true } // field level
});

userSchema.index({ roomSharing: 1, type: -1 });
