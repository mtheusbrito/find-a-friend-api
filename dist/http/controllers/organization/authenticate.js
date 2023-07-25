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

// src/http/controllers/organization/authenticate.ts
var authenticate_exports = {};
__export(authenticate_exports, {
  authenticate: () => authenticate
});
module.exports = __toCommonJS(authenticate_exports);

// src/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Invalid credentials!");
  }
};

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

// src/use-cases/organization/authenticate.ts
var import_bcryptjs = require("bcryptjs");
var AuthenticateOrgUseCase = class {
  constructor(orgsRepository) {
    this.orgsRepository = orgsRepository;
  }
  async execute({
    email,
    password
  }) {
    const org = await this.orgsRepository.findByEmail(email);
    if (!org) {
      throw new InvalidCredentialsError();
    }
    const doesPasswordMatches = await (0, import_bcryptjs.compare)(password, org.password_hash);
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }
    return { org };
  }
};

// src/use-cases/factories/make-authenticate-use-case.ts
function makeAuthenticateUseCase() {
  return new AuthenticateOrgUseCase(new OrgsRepositoryPrisma());
}

// src/http/controllers/organization/authenticate.ts
var import_zod2 = require("zod");
async function authenticate(request, reply) {
  const authenticateBodySchema = import_zod2.z.object({
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string()
  });
  const { email, password } = authenticateBodySchema.parse(request.body);
  try {
    const authenticateUseCase = makeAuthenticateUseCase();
    const { org } = await authenticateUseCase.execute({ email, password });
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: org.id
        }
      }
    );
    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: org.id,
          expiresIn: "7d"
        }
      }
    );
    return reply.status(201).setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true,
      // HTTPs  -> servidor utilizando https?
      sameSite: true,
      // dentro do mesmo domínio
      httpOnly: true
      // não vai ficar salvo no browser
    }).send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticate
});
