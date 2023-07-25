"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/repositories/prisma/images-pet-repository-prisma.ts
var images_pet_repository_prisma_exports = {};
__export(images_pet_repository_prisma_exports, {
  ImagesPetRepositoryPrisma: () => ImagesPetRepositoryPrisma
});
module.exports = __toCommonJS(images_pet_repository_prisma_exports);

// src/env/index.ts
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  JWT_SECRET: import_zod.z.string().default("find-a-friend-api"),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.log("\u274C Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : []
});

// src/repositories/prisma/images-pet-repository-prisma.ts
var ImagesPetRepositoryPrisma = class {
  async createManyImagesPet(data, pet_id) {
    console.log(pet_id);
    const files = [];
    await Promise.all(
      data.map(async (d) => {
        const file = await prisma.file.create({
          data: {
            name: d.name,
            pets: {
              create: [
                {
                  pet: {
                    connect: {
                      id: pet_id
                    }
                  }
                }
              ]
            }
          }
        });
        files.push(file);
      })
    );
    return files;
  }
  async fetchImagesByPetId(pet_id) {
    const images = await prisma.file.findMany({
      where: {
        pets: {
          some: {
            pet: {
              id: pet_id
            }
          }
        }
      }
    });
    return images;
  }
  async findById(id) {
    return await prisma.file.findFirst({
      where: {
        id
      },
      include: {
        pets: true
      }
    });
  }
  async findByPetIdAndImageId(pet_id, file_id) {
    return await prisma.imagesOnPets.findFirst({
      where: {
        pet_id,
        file_id
      },
      include: {
        file: true,
        pet: true
      }
    });
  }
  async deleteById(id) {
    console.log(id);
    await prisma.file.delete({
      where: {
        id
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ImagesPetRepositoryPrisma
});
