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

// src/use-cases/organization/authenticate.ts
var authenticate_exports = {};
__export(authenticate_exports, {
  AuthenticateOrgUseCase: () => AuthenticateOrgUseCase
});
module.exports = __toCommonJS(authenticate_exports);

// src/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Invalid credentials!");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthenticateOrgUseCase
});
