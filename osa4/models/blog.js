const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title is required']
  },
  author: String,
  url: {
    type: String,
    required: [true, 'url is required']
  },
  likes: {
    type: Number,
    default: 0
  }
})

blogSchema.pre('save', function (next) {  //arrow function did not work here. 'this' was undefined
  if (this.likes === null) {
    this.likes = 0
  }
  next()
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)