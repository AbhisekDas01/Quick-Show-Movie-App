import {clerkClient} from '@clerk/express'

export const protectAdmin = async (req ,res , next) => {

    try {
        
        const  {userId} = req.auth();

        const user = await clerkClient.users.getUser(userId);
        
        console.log(user);
        

        if(user.privateMetadata.role !== 'admin'){
            return res.json({
                success : false,
                message: "Not Authorized"
            })
        }

        next();
    } catch (error) {
        
        return res.json({
            success: false,
            message: "Not Authorized"
        })
    }
}