const processFile = require('../middleware/upload')
const { format } = require("util")
const { Storage } = require("@google-cloud/storage")
const Post = require("../models/post")

const storage = new Storage({ keyFilename: "google-cloud-key.json"})
const bucket = storage.bucket("true-mates-bucket")

const createPost = async (req, res) => {
  
  try{

    await processFile(req, res)

    if(!req.file){
      return res.status(400).send({ message: "Please upload a file!"})
    }

    //Create a new blob in the bucket and upload the file data
    const blob = bucket.file(req.file.originalname)
    const blobStream = blob.createWriteStream({
      resumable: false,
    })

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message })
    })

    blobStream.on("finish", async (data) => {
      //Create URL for direct file access via HTTP
      const publicUrl = format(
        `http://storage.googleapis.com/${bucket.name}/${blob.name}`
      )

      try{
        //Make the file public
        await bucket.file(req.file.originalname).makePublic()
      } catch(error) {
        
        return res.status(500).send({
          message: `Uploaded the file successfully: ${req.file.originalname}, but public access denied!`,
          url: publicUrl
        })
      }

      if(!req.body.description){
        return res.status(400).send({ message: "Please include a description!"})
      }
      
      const post = await Post.create({description: req.body.description, photo: publicUrl, userId: req.user.id})

      res.status(200).send({
        message: "Created post and uploaded the file successfully: " + req.file.originalname,
        post: post
      })
    })

    blobStream.end(req.file.buffer)

    
  } catch(error) {
    
    if(error.code === 'LIMIT_UNEXPECTED_FILE'){
      return res.status(400).send({ message: "Too many files being uploaded"})
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${error}`
    })
  }
}

module.exports = {
  createPost
}
