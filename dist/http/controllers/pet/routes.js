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

// src/http/controllers/pet/routes.ts
var routes_exports = {};
__export(routes_exports, {
  petRoutes: () => petRoutes
});
module.exports = __toCommonJS(routes_exports);

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

// src/use-cases/pet/fetch.ts
var FetchPetsUseCase = class {
  constructor(petsRepository) {
    this.petsRepository = petsRepository;
  }
  async execute({
    ...data
  }) {
    const pets = await this.petsRepository.fetchByFilters(data);
    return { pets };
  }
};

// src/use-cases/factories/make-fetch-pets-use-case.ts
function makeFetchPetsUseCase() {
  return new FetchPetsUseCase(new PetsRepositoryPrisma());
}

// src/http/controllers/pet/fetch.ts
var import_client2 = require("@prisma/client");
var import_zod2 = require("zod");
async function fetch(request, reply) {
  const fetchQuerySchema = import_zod2.z.object({
    city: import_zod2.z.string(),
    dtype: import_zod2.z.nativeEnum(import_client2.DType).optional(),
    dependency_level: import_zod2.z.nativeEnum(import_client2.Dependency).optional(),
    energy_level: import_zod2.z.coerce.number().optional(),
    environment: import_zod2.z.nativeEnum(import_client2.Environment).optional(),
    port: import_zod2.z.nativeEnum(import_client2.Port).optional()
  });
  const { city, dtype, dependency_level, energy_level, environment, port } = fetchQuerySchema.parse(request.query);
  const fetchPetsUseCase = makeFetchPetsUseCase();
  const { pets } = await fetchPetsUseCase.execute({
    city,
    dtype,
    dependency_level,
    energy_level,
    environment,
    port
  });
  return reply.status(200).send({ pets });
}

// src/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super(`Resource not found! `);
  }
};

// src/use-cases/pet/get-info.ts
var GetInfoPetUseCase = class {
  constructor(petsRepository) {
    this.petsRepository = petsRepository;
  }
  async execute({
    pet_id
  }) {
    const pet = await this.petsRepository.findById(pet_id);
    if (!pet) {
      throw new ResourceNotFoundError();
    }
    return { pet };
  }
};

// src/use-cases/factories/make-get-info-pet-use-case.ts
function makeGetInfoPetUseCase() {
  return new GetInfoPetUseCase(new PetsRepositoryPrisma());
}

// src/http/controllers/pet/get.ts
var import_zod3 = require("zod");
async function getInfo(request, reply) {
  const getInfoParamsSchema = import_zod3.z.object({
    id: import_zod3.z.string()
  });
  const { id } = getInfoParamsSchema.parse(request.params);
  const getInfoPetUseCase = makeGetInfoPetUseCase();
  const { pet } = await getInfoPetUseCase.execute({ pet_id: id });
  return reply.status(200).send({ pet });
}

// src/http/middlewares/ensure-authenticated.ts
async function ensureAuthenticated(request, reply) {
  try {
    if (!request.headers.authorization) {
      throw new Error();
    }
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized." });
  }
}

// src/use-cases/errors/unauthorized-error.ts
var UnauthorizedError = class extends Error {
  constructor() {
    super("Unauthorized!");
  }
};

// src/use-cases/pet/create-requirements.ts
var CreateRequirementsUseCase = class {
  constructor(petsRepository, requirementsRepository) {
    this.petsRepository = petsRepository;
    this.requirementsRepository = requirementsRepository;
  }
  async execute({
    org_id,
    requirements,
    pet_id
  }) {
    const pet = await this.petsRepository.findById(pet_id);
    if (!pet) {
      throw new ResourceNotFoundError();
    }
    if (pet.organization_id !== org_id) {
      throw new UnauthorizedError();
    }
    const requirementsCreated = await this.requirementsRepository.createMany(
      requirements.map((r) => {
        return { description: r, pet_id };
      })
    );
    return { requirements: requirementsCreated };
  }
};

// src/repositories/prisma/requirements-repository-prisma.ts
var RequirementsRepositoryPrisma = class {
  async create(data) {
    const requirement = await prisma.requirement.create({ data: { ...data } });
    return requirement;
  }
  async delete(id) {
    await prisma.requirement.delete({ where: { id } });
  }
  async fetchByPetId(pet_id) {
    return await prisma.requirement.findMany({
      where: {
        pet_id
      }
    });
  }
  async createMany(data) {
    console.log(data);
    await prisma.requirement.createMany({
      data,
      skipDuplicates: true
    });
    return await this.fetchByPetId(data[0].pet_id);
  }
  async findById(id) {
    return await prisma.requirement.findFirst({
      where: { id },
      include: { pet: true }
    });
  }
};

// src/use-cases/factories/make-create-requirements-use-case.ts
function makeCreateRequirementsUseCase() {
  return new CreateRequirementsUseCase(
    new PetsRepositoryPrisma(),
    new RequirementsRepositoryPrisma()
  );
}

// src/http/controllers/pet/create-requirements.ts
var import_zod4 = require("zod");
async function createRequirements(request, reply) {
  const createBodySchema = import_zod4.z.object({
    requirements: import_zod4.z.array(import_zod4.z.string()).min(1)
  });
  const getParamsSchema = import_zod4.z.object({
    id: import_zod4.z.string()
  });
  const { id } = getParamsSchema.parse(request.params);
  const { requirements } = createBodySchema.parse(request.body);
  const { sub: org_id } = request.user;
  const createRequirements2 = makeCreateRequirementsUseCase();
  const { requirements: requirementsCreated } = await createRequirements2.execute({
    org_id,
    pet_id: id,
    requirements
  });
  return reply.status(201).send({ requirements: requirementsCreated });
}

// src/use-cases/pet/create.ts
var CreatePetUseCase = class {
  constructor(petsRepository, orgsRepository) {
    this.petsRepository = petsRepository;
    this.orgsRepository = orgsRepository;
  }
  async execute({
    ...data
  }) {
    const org = await this.orgsRepository.findById(data.organization_id);
    if (!org) {
      throw new ResourceNotFoundError("Organization");
    }
    const pet = await this.petsRepository.create({
      ...data
    });
    return { pet };
  }
};

// src/repositories/prisma/orgs-repository-prisma.ts
var OrgsRepositoryPrisma = class {
  async create(data) {
    const org = await prisma.organization.create({
      data: {
        ...data
      }
    });
    return org;
  }
  async findByEmail(email) {
    const org = await prisma.organization.findFirst({
      where: {
        email
      }
    });
    return org;
  }
  async findById(id) {
    const org = await prisma.organization.findFirst({ where: { id } });
    return org;
  }
};

// src/use-cases/factories/make-create-pet-use-create.ts
function makeCreatePetUseCase() {
  return new CreatePetUseCase(
    new PetsRepositoryPrisma(),
    new OrgsRepositoryPrisma()
  );
}

// src/http/controllers/pet/create.ts
var import_client3 = require("@prisma/client");
var import_zod5 = require("zod");
async function create(request, reply) {
  const createBodySchema = import_zod5.z.object({
    name: import_zod5.z.string(),
    about: import_zod5.z.string(),
    dtype: import_zod5.z.nativeEnum(import_client3.DType),
    years: import_zod5.z.nativeEnum(import_client3.Years),
    port: import_zod5.z.nativeEnum(import_client3.Port),
    energy_level: import_zod5.z.coerce.number().min(1).max(5),
    dependency_level: import_zod5.z.nativeEnum(import_client3.Dependency),
    environment: import_zod5.z.nativeEnum(import_client3.Environment)
  });
  const { ...data } = createBodySchema.parse(request.body);
  const createPetUseCase = makeCreatePetUseCase();
  const org_id = request.user.sub;
  const { pet } = await createPetUseCase.execute({
    ...data,
    organization_id: org_id
  });
  return reply.status(201).send({ pet });
}

// src/use-cases/pet/delete-requirement.ts
var DeleteRequirementUseCase = class {
  constructor(petsRepository, requirementsRepository) {
    this.petsRepository = petsRepository;
    this.requirementsRepository = requirementsRepository;
  }
  async execute({
    pet_id,
    org_id,
    req_id
  }) {
    const requirement = await this.requirementsRepository.findById(req_id);
    if (!requirement) {
      throw new ResourceNotFoundError();
    }
    const pet = await this.petsRepository.findById(pet_id);
    if (!pet) {
      throw new ResourceNotFoundError();
    }
    if (pet.id !== requirement.pet_id) {
      throw new UnauthorizedError();
    }
    if (pet.organization_id !== org_id) {
      throw new UnauthorizedError();
    }
    await this.requirementsRepository.delete(req_id);
  }
};

// src/use-cases/factories/make-delete-requiment-use-case.ts
function makeDeleteRequirementUseCase() {
  return new DeleteRequirementUseCase(
    new PetsRepositoryPrisma(),
    new RequirementsRepositoryPrisma()
  );
}

// src/http/controllers/pet/delete-requirement.ts
var import_zod6 = require("zod");
async function deleteRequirement(request, reply) {
  const getParamsSchema = import_zod6.z.object({
    id: import_zod6.z.string(),
    req_id: import_zod6.z.string()
  });
  const { id, req_id } = getParamsSchema.parse(request.params);
  const { sub: org_id } = request.user;
  const deleteRequirement2 = makeDeleteRequirementUseCase();
  await deleteRequirement2.execute({
    org_id,
    pet_id: id,
    req_id
  });
  return reply.status(200).send();
}

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

// src/use-cases/pet/upload-images.ts
var UploadImagesPetUseCase = class {
  constructor(imagesPetRepository, petsRepository) {
    this.imagesPetRepository = imagesPetRepository;
    this.petsRepository = petsRepository;
  }
  async execute({
    images_name,
    pet_id,
    org_id
  }) {
    const pet = await this.petsRepository.findById(pet_id);
    if (!pet) {
      throw new ResourceNotFoundError();
    }
    if (pet.organization_id !== org_id) {
      throw new UnauthorizedError();
    }
    const images = await this.imagesPetRepository.createManyImagesPet(
      images_name.map((i) => {
        return { name: i };
      }),
      pet_id
    );
    return { images };
  }
};

// src/use-cases/factories/make-upload-images-pet.ts
function makeUploadImagesPet() {
  return new UploadImagesPetUseCase(
    new ImagesPetRepositoryPrisma(),
    new PetsRepositoryPrisma()
  );
}

// src/http/controllers/pet/upload-image.ts
var import_zod7 = require("zod");
async function uploadImages(request, reply) {
  const getInfoParamsSchema = import_zod7.z.object({
    id: import_zod7.z.string()
  });
  const { id } = getInfoParamsSchema.parse(request.params);
  const getFilesScheme = import_zod7.z.object({
    files: import_zod7.z.array(import_zod7.z.object({ filename: import_zod7.z.string() }))
  });
  const { files: images } = getFilesScheme.parse(request);
  const images_name = images.map((file) => file.filename);
  const { sub: org_id } = request.user;
  const uploadImagesPet = makeUploadImagesPet();
  const { images: imagesCreated } = await uploadImagesPet.execute({
    images_name,
    pet_id: id,
    org_id
  });
  return reply.status(201).send({ images: imagesCreated });
}

// src/http/controllers/pet/authenticatedRoutes.ts
var import_fastify_multer2 = __toESM(require("fastify-multer"));

// src/config/upload.ts
var import_crypto = __toESM(require("crypto"));
var import_fastify_multer = __toESM(require("fastify-multer"));
var import_path = require("path");
var upload_default = {
  upload(folder) {
    return {
      storage: import_fastify_multer.default.diskStorage({
        destination: (0, import_path.resolve)(__dirname, "..", "..", folder),
        filename: (request, file, callback) => {
          const fileHash = import_crypto.default.randomBytes(16).toString("hex");
          const fileName = `${fileHash}-${file.originalname}`;
          return callback(null, fileName);
        }
      })
    };
  }
};

// src/use-cases/pet/delete.ts
var DeletePetUseCase = class {
  constructor(petsRepository) {
    this.petsRepository = petsRepository;
  }
  async execute({
    org_id,
    pet_id
  }) {
    const petExists = await this.petsRepository.findById(pet_id);
    if (!petExists) {
      throw new ResourceNotFoundError();
    }
    if (petExists.organization_id !== org_id) {
      throw new UnauthorizedError();
    }
    await this.petsRepository.delete(pet_id);
  }
};

// src/use-cases/factories/make-delete-pet-use-case.ts
function makeDeletePetUseCase() {
  return new DeletePetUseCase(new PetsRepositoryPrisma());
}

// src/http/controllers/pet/delete.ts
var import_zod8 = require("zod");
async function deletePet(request, reply) {
  const getParamsSchema = import_zod8.z.object({
    id: import_zod8.z.string()
  });
  const deletePetUseCase = makeDeletePetUseCase();
  const { id } = getParamsSchema.parse(request.params);
  const { sub: org_id } = request.user;
  await deletePetUseCase.execute({ org_id, pet_id: id });
  return reply.status(204).send({});
}

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

// src/use-cases/factories/make-delete-image-pet-use-case.ts
function makeDeleteImagePetUseCase() {
  return new DeleteImageUseCase(
    new PetsRepositoryPrisma(),
    new ImagesPetRepositoryPrisma()
  );
}

// src/http/controllers/pet/delete-image.ts
var import_zod9 = require("zod");
async function deleteImage(request, reply) {
  const getInfoParamsSchema = import_zod9.z.object({
    id: import_zod9.z.string(),
    img_id: import_zod9.z.string()
  });
  const { id, img_id } = getInfoParamsSchema.parse(request.params);
  const deleteImagePetUseCase = makeDeleteImagePetUseCase();
  const { sub: org_id } = request.user;
  await deleteImagePetUseCase.execute({ pet_id: id, org_id, img_id });
  return reply.status(204).send({});
}

// src/http/controllers/pet/authenticatedRoutes.ts
var upload = (0, import_fastify_multer2.default)(upload_default.upload("./tmp/pets"));
async function authenticatedRoutes(app) {
  app.addHook("onRequest", ensureAuthenticated);
  app.post("/", create);
  app.delete("/:id", deletePet);
  app.post("/:id/images", { preHandler: upload.array("images") }, uploadImages);
  app.delete("/:id/images/:img_id", deleteImage);
  app.post("/:id/requirements", createRequirements);
  app.delete("/:id/requirements/:req_id", deleteRequirement);
}

// src/use-cases/pet/fetch-requirements-by-pet.ts
var FetchRequirementsByPetUseCase = class {
  constructor(petsRepository, requirementsRepository) {
    this.petsRepository = petsRepository;
    this.requirementsRepository = requirementsRepository;
  }
  async execute({
    pet_id
  }) {
    const pet = await this.petsRepository.findById(pet_id);
    if (!pet) {
      throw new ResourceNotFoundError();
    }
    const requirements = await this.requirementsRepository.fetchByPetId(pet_id);
    return { requirements };
  }
};

// src/use-cases/factories/make-fetch-requirements-by-pet.ts
function makeFetchRequirementsByPet() {
  return new FetchRequirementsByPetUseCase(
    new PetsRepositoryPrisma(),
    new RequirementsRepositoryPrisma()
  );
}

// src/http/controllers/pet/fetch-requirements-by-pet.ts
var import_zod10 = require("zod");
async function fetchRequirementsByPet(request, reply) {
  const getParamsSchema = import_zod10.z.object({
    id: import_zod10.z.string()
  });
  const { id } = getParamsSchema.parse(request.params);
  const createRequirements2 = makeFetchRequirementsByPet();
  const { requirements } = await createRequirements2.execute({
    pet_id: id
  });
  return reply.status(201).send({ requirements });
}

// src/http/controllers/pet/routes.ts
async function petRoutes(app) {
  app.get("/", fetch);
  app.get("/:id", getInfo);
  app.get("/:id/requirements", fetchRequirementsByPet);
  app.register(authenticatedRoutes);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  petRoutes
});
