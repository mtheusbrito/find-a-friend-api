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

// src/use-cases/pet/update.ts
var update_exports = {};
__export(update_exports, {
  UpdatePetUseCase: () => UpdatePetUseCase
});
module.exports = __toCommonJS(update_exports);

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

// src/use-cases/pet/update.ts
var UpdatePetUseCase = class {
  constructor(petsRepository) {
    this.petsRepository = petsRepository;
  }
  async execute({
    name,
    about,
    dtype,
    years,
    port,
    energy_level,
    dependency_level,
    environment,
    ...data
  }) {
    const petExists = await this.petsRepository.findById(data.pet_id);
    if (!petExists) {
      throw new ResourceNotFoundError();
    }
    if (petExists.organization_id !== data.org_id) {
      throw new UnauthorizedError();
    }
    const pet = await this.petsRepository.save({
      ...petExists,
      name,
      about,
      dtype,
      years,
      port,
      energy_level,
      dependency_level,
      environment
    });
    return { pet };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdatePetUseCase
});
