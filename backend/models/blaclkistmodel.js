const mongoose=require("mongoose")

const blackschema=mongoose.Schema({
    token:{type:String},
    refreshtoken:{type:String}
})

const blackmodel=mongoose.model("blacklist",blackschema)

module.exports={
    blackmodel
}