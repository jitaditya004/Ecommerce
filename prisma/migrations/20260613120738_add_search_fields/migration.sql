/*
  Warnings:

  - Made the column `user_id` on table `refresh_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `revoked` on table `refresh_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "revoked" SET NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "product_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");
