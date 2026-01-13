import crypto from 'crypto';
import { db } from '../databaseConnection/database-connection';
import { refreshTokenTable } from '../db/schema/refreshToken';

export  function generateRefreshToken():{refreshToken:string,hashedRefreshToken:string}{
    const refreshToken=crypto.randomBytes(64).toString('hex') ;
    const hashedRefreshToken= crypto.createHash('sha256').update(refreshToken).digest('hex');
   
    return {refreshToken,hashedRefreshToken};
}
export async function createRefreshToken(userId:string):Promise<string>{
    const {refreshToken,hashedRefreshToken}= await generateRefreshToken();
    await db.insert(refreshTokenTable).values({
        userId,
        token_hash:hashedRefreshToken,
        expires_at:new Date(Date.now()+30*24*60*60*1000) 
    })
    return refreshToken;
}