const jwt=require('jsonwebtoken');
const userSecretKey="$aurabh@123";  


function  createTokenForUser(user){
    const payload={
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role
    };


    const token=jwt.sign(payload,userSecretKey,{expiresIn:"1d"});
    return token;
}


const validateUser=(token)=>{
    const payload=jwt.verify(token,userSecretKey);

    return payload;
}



module.exports={
    createTokenForUser,
    validateUser
    
}
