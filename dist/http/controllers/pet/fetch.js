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

// src/http/controllers/pet/fetch.ts
var fetch_exports = {};
__export(fetch_exports, {
  fetch: () => fetch
});
module.exports = __toCommonJS(fetch_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetch
});
