CREATE TABLE "product_frame_configs" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "frame_image_url" TEXT NOT NULL,
    "aspect_ratio_width" DOUBLE PRECISION NOT NULL,
    "aspect_ratio_height" DOUBLE PRECISION NOT NULL,
    "photo_area_left" DOUBLE PRECISION NOT NULL,
    "photo_area_top" DOUBLE PRECISION NOT NULL,
    "photo_area_width" DOUBLE PRECISION NOT NULL,
    "photo_area_height" DOUBLE PRECISION NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_frame_configs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "product_frame_configs_product_id_size_key"
ON "product_frame_configs"("product_id", "size");

ALTER TABLE "product_frame_configs"
ADD CONSTRAINT "product_frame_configs_product_id_fkey"
FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
