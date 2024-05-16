const processFile = require('../middleware/upload')
const { format } = require("util")
const { Storage } = require("@google-cloud/storage")
const Post = require("../models/post")
const Photo = require("../models/photo")
const {once} = require('events')

const storage = new Storage({ keyFilename: "google-cloud-key.json"})
const bucket = storage.bucket("true-mates-bucket")

const createPost = async (req, res) => {
  
  try{
    //console.log(req.user.id)
    
    await processFile(req, res)

    if(!req.body.description){
      return res.status(400).send({ message: "Please include a description!"})
    }

    if(!req.body.attribute){
      return res.status(400).send({ message: "Please provide an attribute!"})
    }

    console.log(req.files.length)
    let photoArray = []
    let counter = 0
    let promises = []
    const post = await Post.create({description: req.body.description, userId: req.user.id, attribute: req.body.attribute})

    //process each photo to upload to GCP
    req.files.forEach(async (fil) => {
      const newFileName = 'user-' + req.user.id.toString() + '_' + fil.originalname
    
      //Create a new blob in the bucket and upload the file data
      const blob = bucket.file(newFileName)
      const blobStream = blob.createWriteStream({
        resumable: false
      })

      
  
      blobStream.on("error", (err) => {
        res.status(500).send({ message: err.message })
      })
      
      blobStream.end(fil.buffer)

      promises.push(
        new Promise((resolve, reject) => {
          blobStream.on("finish", async (data) => {
            counter += 1
            //Create URL for direct file access via HTTP
            let publicUrlTemp = format(
              `http://storage.googleapis.com/${bucket.name}/${blob.name}`
            )
            
            //fixed to handle files with spaces and adjusted to how GCP handles spaces
            const publicUrl = publicUrlTemp.replace(/ /g, "%20")

            try{
              //Make the file public
              await bucket.file(newFileName).makePublic()
            } catch(error) {
              console.log(error)
              return res.status(500).send({
                message: `Uploaded the file successfully: ${newFileName}, but public access denied!`,
                url: publicUrl
              })
            }
            
            const photo = await Photo.create({postId: post.id, url: publicUrl})
            //console.log(photo)
            photoArray.push(photo)
            //console.log(photoArray)
            resolve()
          
        })
        })
      )
      
    //blobStream.end(fil.buffer)
  })
  await Promise.all(promises)

  return res.status(200).send({
    post: post,
    photos: photoArray
  })
    /*
    //new filename to make sure users who have the same file name create different urls
    const newFileName = 'user-' + req.user.id.toString() + '_' + req.file.originalname
    
    //Create a new blob in the bucket and upload the file data
    const blob = bucket.file(newFileName)
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
        await bucket.file(newFileName).makePublic()
      } catch(error) {
        console.log(error)
        return res.status(500).send({
          message: `Uploaded the file successfully: ${newFileName}, but public access denied!`,
          url: publicUrl
        })
      }

      //console.log(req.user)
      const post = await Post.create({description: req.body.description, photo: publicUrl, userId: req.user.id, attribute: req.body.attribute})

      res.status(200).send({
        message: "Created post and uploaded the file successfully: " + newFileName,
        post: post
      })
    })

    blobStream.end(req.file.buffer)
    */

    
  } catch(error) {
    //console.log(error)
    if(error.code === 'LIMIT_UNEXPECTED_FILE'){
      return res.status(500).send({
        message: "Too many files. Only 5 allowed."
      })
    }
    res.status(500).send({
      message: `Could not upload the files. ${error}`
    })
  }
}

const getPost = async(req, res) => {
  try{
    const post = await Post.findByPk(req.params.id)
    if(!post) {
      return res.status(400).send({ message: "Post not found"})
    }
    const now = new Date().getTime()
    const created = new Date(post.createdAt).getTime()

    //math to figure out time differences
    const diff = now - created
    const diff_in_seconds = diff/ (1000)
    const diff_in_minutes = diff/ (1000 * 60)
    const diff_in_hours = diff/ (1000 * 3600)
    const diff_in_days = diff / (1000 * 3600 * 24);
    const diff_in_weeks = diff / (1000 * 3600 * 24*7);
    const diff_in_years = diff / (1000 * 3600 * 24*7*52);

    let timeDiffToInclude;

    if(diff_in_seconds < 60){
      timeDiffToInclude = Math.floor(diff_in_seconds).toString() + 's ago'
    }
    else if(diff_in_minutes < 60){
      timeDiffToInclude = Math.floor(diff_in_minutes).toString() + 'm ago'
    }
    else if(diff_in_hours < 24){
      timeDiffToInclude = Math.floor(diff_in_hours).toString() + 'h ago'
    }
    else if(diff_in_days < 30){
      timeDiffToInclude = Math.floor(diff_in_days).toString() + 'd ago'
    }
    else if(diff_in_weeks < 52){
      timeDiffToInclude = Math.floor(diff_in_weeks).toString() + 'w ago'
    }else{
      timeDiffToInclude = Math.floor(diff_in_years).toString() + 'yr ago'
    }

    res.status(200).send({post: post, created_ago: timeDiffToInclude})
  }catch(error){
    res.status(400).send({
      message: 'Incorrect id'
    })
  }
}

const changePost = async (req, res) => {
  try{
    const post = await Post.findByPk(req.params.id)
    if(!post) {
      return res.status(400).send({ message: "Post not found"})
    }
    //console.log(req.body)
    if(!req.body.description) {
      return res.status(400).send({ message: "Please include new description!"})
    }
    
    post.description = req.body.description
    await post.save()
    res.status(200).send(post)
  } catch(error){
    res.status(400).send({
      message: 'Incorrect id'
    })
  }
}

module.exports = {
  createPost,
  getPost,
  changePost
}