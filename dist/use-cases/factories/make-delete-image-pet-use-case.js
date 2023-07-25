"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-cases/factories/make-delete-image-pet-use-case.ts
var make_delete_image_pet_use_case_exports = {};
__export(make_delete_image_pet_use_case_exports, {
  makeDeleteImagePetUseCase: () => makeDeleteImagePetUseCase
});
module.exports = __toCommonJS(make_delete_image_pet_use_case_exports);

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

// src/repositories/prisma/pets-repository-prisma.ts
var PetsRepositoryPrisma = class {
  async create(data) {
    return await prisma.pet.create({ data: { ...data } });
  }
  async save(data) {
    return await prisma.pet.update({ where: { id: data.id }, data });
  }
  async delete(id) {
    await prisma.pet.delete({ where: { id } });
  }
  async findById(id) {
    const pet = await prisma.pet.findFirst({
      include: { organization: true, images: {
        include: {
          file: true
        }
      }, requirements: true },
      where: { id }
    });
    return pet;
  }
  async fetchAll() {
    return prisma.pet.findMany();
  }
  // SELECT P.* FROM pets as P
  // JOIN organizations as O on O.id = P.organization_id
  // WHERE O.city like '%Itaperuna%'
  async fetchByFilters(data) {
    const city = `${data.city}`;
    const pets = await prisma.$queryRawUnsafe(
      `SELECT P.* FROM pets as P JOIN organizations as O on O.id = P.organization_id WHERE UPPER(O.city::text) LIKE UPPER('%${city}%')${data.dtype ? ` AND P.dtype::text = '${data.dtype}'` : ""}${data.dependency_level ? ` AND P.dependency_level::text = '${data.dependency_level}'` : ""}${data.energy_level ? ` AND P.energy_level = ${data.energy_level}` : ""}${data.environment ? ` AND P.environment::text = '${data.environment}'` : ""}${data.port ? ` AND P.port::text = '${data.port}'` : ""}${data.years ? ` AND P.years::text = '${data.years}'` : ""}`
    );
    return pets;
  }
};

// src/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super(`Resource not found! `);
  }
};

// src/use-cases/errors/unauthorized-error.ts
var UnauthorizedError = class extends Error {
  constructor() {
    super("Unauthorized!");
  }
};

// src/utils/file.ts
var import_fs = __toESM(require("fs"));
var deleteFile = async (fileName) => {
  try {
    await import_fs.default.promises.stat(fileName);
  } catch {
    return;
  }
  await import_fs.default.promises.unlink(fileName);
};

// src/use-cases/pet/delete-image.ts
var DeleteImageUseCase = class {
  constructor(petsRepository, imagesPetRepository) {
    this.petsRepository = petsRepository;
    this.imagesPetRepository = imagesPetRepository;
  }
  async execute({
    pet_id,
    org_id,
    img_id
  }) {
    const pet = await this.petsRepository.findById(pet_id);
    if (!pet) {
      throw new ResourceNotFoundError();
    }
    if (pet.organization_id !== org_id) {
      throw new UnauthorizedError();
    }
    const image = await this.imagesPetRepository.findById(img_id);
    if (!image) {
      throw new ResourceNotFoundError();
    }
    const imageOnPet = await this.imagesPetRepository.findByPetIdAndImageId(
      pet.id,
      image.id
    );
    if (!imageOnPet) {
      throw new UnauthorizedError();
    }
    await this.imagesPetRepository.deleteById(image.id);
    await deleteFile(`./tmp/pets/${image.name}`);
  }
};

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

// src/use-cases/factories/make-delete-image-pet-use-case.ts
function makeDeleteImagePetUseCase() {
  return new DeleteImageUseCase(
    new PetsRepositoryPrisma(),
    new ImagesPetRepositoryPrisma()
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeDeleteImagePetUseCase
});
