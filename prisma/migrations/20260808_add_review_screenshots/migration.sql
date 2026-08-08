CREATE TABLE "review_screenshots" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "cloudinary_public_id" TEXT NOT NULL,
    "category_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_screenshots_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "review_screenshots_category_id_idx" ON "review_screenshots"("category_id");

ALTER TABLE "review_screenshots"
ADD CONSTRAINT "review_screenshots_category_id_fkey"
FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
