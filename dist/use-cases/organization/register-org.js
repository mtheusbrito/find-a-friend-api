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

// src/use-cases/organization/register-org.ts
var register_org_exports = {};
__export(register_org_exports, {
  RegisterOrgUseCase: () => RegisterOrgUseCase
});
module.exports = __toCommonJS(register_org_exports);
var import_bcryptjs = require("bcryptjs");

// src/use-cases/errors/org-already-exists-error.ts
var OrgAlreadyExistsError = class extends Error {
  constructor() {
    super(`Resource already exists! `);
  }
};

// src/use-cases/organization/register-org.ts
var RegisterOrgUseCase = class {
  constructor(orgsRepository) {
    this.orgsRepository = orgsRepository;
  }
  async execute({
    password,
    ...data
  }) {
    const password_hash = await (0, import_bcryptjs.hash)(password, 6);
    const orgWithSameEmail = await this.orgsRepository.findByEmail(data.email);
    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError();
    }
    const org = await this.orgsRepository.create({
      ...data,
      password_hash
    });
    return { org };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterOrgUseCase
});
