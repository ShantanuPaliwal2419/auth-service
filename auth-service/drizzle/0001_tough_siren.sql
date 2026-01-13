-- 1️⃣ Drop old primary key (if exists)
ALTER TABLE "jwt_keys"
DROP CONSTRAINT IF EXISTS "jwt_keys_pkey";

-- 2️⃣ Remove legacy columns
ALTER TABLE "jwt_keys"
DROP COLUMN IF EXISTS "id";

ALTER TABLE "jwt_keys"
DROP COLUMN IF EXISTS "is_active";

-- 3️⃣ Ensure kid is correct and primary key
ALTER TABLE "jwt_keys"
ALTER COLUMN "kid" TYPE varchar(56);

ALTER TABLE "jwt_keys"
ADD PRIMARY KEY ("kid");

-- 4️⃣ Add status WITHOUT default (two-step to avoid failure)
ALTER TABLE "jwt_keys"
ADD COLUMN IF NOT EXISTS "status" varchar(10);

-- ⚠️ IMPORTANT: Backfill manually or ensure table is empty
-- Example (ONLY if rows exist):
-- UPDATE "jwt_keys" SET status = 'ACTIVE' WHERE status IS NULL;

ALTER TABLE "jwt_keys"
ALTER COLUMN "status" SET NOT NULL;

-- 5️⃣ Add expires_at
ALTER TABLE "jwt_keys"
ADD COLUMN IF NOT EXISTS "expires_at" timestamptz;
