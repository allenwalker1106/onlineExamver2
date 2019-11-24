const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        firstname: {
            type: String,
            required: true,
            lowercase: false,
            min:6

        },
        middlename:{
            type:String,
            default:"",
            required: false,
        },
        lastname:{
            type: String,
            required: true,
            lowercase : false,
            min:6
        }
    },
    username:{
        type: String,
        required: true,
        lowercase: true,
        min: 6,
        max: 255
    },
    password:{
        type: String,
        required: true,
        min:6,
        max: 1024
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
    },
    date_of_birth:{
        type: Date,
        required: true,
    },
    account_type:{
        type:String,
        required: true,
        lowercase: true
    },
    profile_image_link:{
        type: String,
        default: "data/image/default_avata.png"
    },
    address:{
        city:{
            type: String,
            lowercase: true,
            default :""
        },
        country:{
            type: String,
            required: true,
            lowercase: true,
        }

    },
    courses:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Courses',
        }
    ],
    tests:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tests',
        }
    ],
    questions:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Question',
        }
    ],
    results:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Results'
        }
    ],
    links:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Links',
        }
    ],
    files:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Files',
        }
    ]
})


module.exports = mongoose.model('User',userSchema,"users");