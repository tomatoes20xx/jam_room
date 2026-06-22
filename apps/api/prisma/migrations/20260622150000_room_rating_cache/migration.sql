-- Denormalized review aggregates on Room. Lets GET /rooms filter, sort by
-- rating, and paginate at the DB level instead of loading every row.

-- AlterTable
ALTER TABLE "Room" ADD COLUMN "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Room" ADD COLUMN "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- Backfill from existing reviews.
UPDATE "Room" r
SET "reviewCount" = sub.cnt,
    "avgRating" = sub.avg
FROM (
  SELECT "roomId", COUNT(*)::int AS cnt, AVG("rating")::double precision AS avg
  FROM "Review"
  GROUP BY "roomId"
) sub
WHERE r."id" = sub."roomId";

-- CreateIndex
CREATE INDEX "Room_avgRating_idx" ON "Room"("avgRating");
