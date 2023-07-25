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

// src/use-cases/factories/make-create-requirements-use-case.ts
var make_create_requirements_use_case_exports = {};
__export(make_create_requirements_use_case_exports, {
  makeCreateRequirementsUseCase: () => makeCreateRequirementsUseCase
});
module.exports = __toCommonJS(make_create_requirements_use_case_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeCreateRequirementsUseCase
});
