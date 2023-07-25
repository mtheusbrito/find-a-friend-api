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

// src/http/controllers/pet/create.ts
var create_exports = {};
__export(create_exports, {
  create: () => create
});
module.exports = __toCommonJS(create_exports);

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
var import_client2 = require("@prisma/client");
var import_zod2 = require("zod");
async function create(request, reply) {
  const createBodySchema = import_zod2.z.object({
    name: import_zod2.z.string(),
    about: import_zod2.z.string(),
    dtype: import_zod2.z.nativeEnum(import_client2.DType),
    years: import_zod2.z.nativeEnum(import_client2.Years),
    port: import_zod2.z.nativeEnum(import_client2.Port),
    energy_level: import_zod2.z.coerce.number().min(1).max(5),
    dependency_level: import_zod2.z.nativeEnum(import_client2.Dependency),
    environment: import_zod2.z.nativeEnum(import_client2.Environment)
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  create
});
