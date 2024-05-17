const { sequelize } = require('../utils/db')
const FriendsList = require('../models/friendslist')
const User = require('../models/user')

const addFriend = async (req, res) => {

  try{
  
    const { friend } = req.body

    if(!friend){
        return res.status(400).send({ message: "Please provide a friend to add!"})
    }
    const userId = req.user.id
    if(friend.toString() === userId.toString()){
        return res.status(400).send({ message: "Cannot add yourself as a friend!"})
    }

    const friendRequest1 = await FriendsList.findOne({
        where: {
            user1: userId,
            user2: friend
        }
    })

    const friendRequest2 = await FriendsList.findOne({
        where: {
            user1: friend,
            user2: userId
        }
    })

    if(!friendRequest1 || !friendRequest2){

        await FriendsList.create({user1: userId, user2: friend, status: 'r', requesterId: userId})
        await FriendsList.create({user1: friend, user2: userId, status: 'r', requesterId: userId})

        const friendInfo = await User.findByPk(friend)

        return res.status(200).send({
            message: `User ${req.user.name} send a friend request to: ${friendInfo.name}`
        })
    }
    else{
        const friendInfo = await User.findByPk(friend)
        console.log(userId)
        console.log(friendInfo.id)
        if(friendRequest1.requesterId === userId && friendRequest1.status === 'r'){
            return res.status(400).send({ error: "Already sent a request!"})
        }
        else if(friendRequest1.status === 'a' || friendRequest2 === 'a'){
            return res.status(400).send({ error: "Already friends with this user"})
        }
        else if(friendRequest1.requesterId === friendInfo.id && friendRequest2.requesterId === friendInfo.id){
            //friends prespective when accepting the request

            //change status to a for accepted
            friendRequest1.status = 'a'
            friendRequest2.status = 'a'

            await friendRequest1.save()
            await friendRequest2.save()

            return res.status(200).send({
                message: `User ${req.user.name} is now friends with ${friendInfo.name}`
            })
        }
        else{
            //an error case if something unknown happens
            return res.status(500).send({ error: "Something went wrong"})
        }
}
} catch(error){
  
  //triggers the unique constraint on the combination of user and friend
  if(error.name === 'SequelizeUniqueConstraintError'){
    return res.status(400).send({
        error: 'Already friends with this user.'
    })
  }

  //applies to both the user and the friend if an id doesnt exist
  if(error.name === 'SequelizeForeignKeyConstraintError'){
    return res.status(403).send({
      error: 'Friend Id does not exist.'
    })
  }
  //all other errors
  res.status(500).send({
    error: `Could not add friend. ${error}`
  })
}
}

const getUserFriendsList = async (req, res) => {

  try{
    const user = req.user

    const query = await sequelize.query(`select f1.user1 as user, f2.user1 as friendId, u.name, u.email, count(*) as mutual_friends, f1.status
    from friendslists f1 join
    friendslists f2
         on f1.user2 = f2.user2
    inner join
    users as u
        on u.id = f2.user1
    where f1.user1 = ${user.id} and f1.user1 != f2.user1 and 
    group by f1.user1, f2.user1, u.name, u.email, f1.status;`, 
      {
        model: FriendsList,
        mapToModel: true
      })

    res.status(200).send(query)

  }catch(error){
    console.log(error)

    res.status(500).send({
        error: `Could not get friendslist ${error}`
    })
  }

}

module.exports = {
  addFriend,
  getUserFriendsList
}