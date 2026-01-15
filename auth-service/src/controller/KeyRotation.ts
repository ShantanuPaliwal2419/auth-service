import crypto from "crypto";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

import { db } from "../databaseConnection/database-connection";
import { jwtKeysTable } from "../db/schema/jwtKeys";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

export const rotateJwtKey = asyncHandler(
  async (_req: Request, res: Response) => {

  
    const activeKeys = await db
      .select()
      .from(jwtKeysTable)
      .where(eq(jwtKeysTable.status, "ACTIVE"))
      .limit(1);

    const oldKey = activeKeys[0]; 

    
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "pkcs1", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });

    const newKid = crypto.randomUUID();

  
    const newKey = await db
      .insert(jwtKeysTable)
      .values({
        kid: newKid,
        publicKey,
        privateKey,
        algorithm: "RS256",
        status: "ACTIVE",
      })
      .returning();

   
    let rotatedKey = null;

    if (oldKey) {
      const updated = await db
        .update(jwtKeysTable)
        .set({
          status: "ROTATED",
          expiresAt: new Date(),
        })
        .where(eq(jwtKeysTable.kid, oldKey.kid))
        .returning();

      rotatedKey = updated[0];
    }

   
    res.status(200).json(
      new ApiResponse(true,{
        newKey: newKey[0],
        rotatedKey
      }, "JWT key rotated successfully")
    );
  }
);
