import { eq } from "drizzle-orm";
import { db } from "../databaseConnection/database-connection";
import { jwtKeysTable } from "../db/schema/jwtKeys";
import { generateRSAKeyPair } from "./keyGenerator";
let activeKey:  {
    kid: string|undefined,
    publicKey: string|undefined,
    privateKey:string|undefined

} | null = null;

export async function jwtBootstrap(){
    const key =  await db.select().from(jwtKeysTable).where(eq(jwtKeysTable.status,'ACTIVE'))
    if( key.length >1){
        throw new Error("Multiple active JWT keys found");

    }
    if(key.length===1){
      activeKey={
        kid:key[0]?.kid,
        publicKey:key[0]?.publicKey,
        privateKey:key[0]?.privateKey
      }
     console.log(" Loaded existing JWT key");
    return;
    }
    
    const newkey = generateRSAKeyPair()
    await db.insert(jwtKeysTable).values({
        kid:newkey.kid,
        algorithm: newkey.algorithm,
    privateKey: newkey.privateKey,
    publicKey: newkey.publicKey,
    status: "ACTIVE",
    })
    activeKey = {
    kid: newkey.kid,
    privateKey: newkey.privateKey,
    publicKey: newkey.publicKey,
  };
  console.log("loading new jwt keys")

}
export function getActiveJwtKey() {
  if (!activeKey) {
    throw new Error("JWT key not initialized");
  }
  return activeKey;
}