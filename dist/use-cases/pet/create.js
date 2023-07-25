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

// src/use-cases/pet/create.ts
var create_exports = {};
__export(create_exports, {
  CreatePetUseCase: () => CreatePetUseCase
});
module.exports = __toCommonJS(create_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreatePetUseCase
});
