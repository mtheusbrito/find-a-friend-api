-- DropForeignKey
ALTER TABLE "images_pets" DROP CONSTRAINT "images_pets_file_id_fkey";

-- DropForeignKey
ALTER TABLE "images_pets" DROP CONSTRAINT "images_pets_pet_id_fkey";

-- AddForeignKey
ALTER TABLE "images_pets" ADD CONSTRAINT "images_pets_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images_pets" ADD CONSTRAINT "images_pets_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
