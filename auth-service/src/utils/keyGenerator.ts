import crypto, { generateKeyPairSync } from 'crypto';
export function generateRSAKeyPair() {
    const {publicKey, privateKey}= crypto.generateKeyPairSync("rsa",{
        modulusLength:2048,
        publicKeyEncoding:{type:'pkcs1',format:'pem'},
        privateKeyEncoding:{type:'pkcs1',format:'pem'}});
        return {
            kid:crypto.randomUUID(),
            algorithm:'RS256',
            publicKey,privateKey
        } }