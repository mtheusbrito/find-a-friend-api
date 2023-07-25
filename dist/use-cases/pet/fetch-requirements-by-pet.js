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

// src/use-cases/pet/fetch-requirements-by-pet.ts
var fetch_requirements_by_pet_exports = {};
__export(fetch_requirements_by_pet_exports, {
  FetchRequirementsByPetUseCase: () => FetchRequirementsByPetUseCase
});
module.exports = __toCommonJS(fetch_requirements_by_pet_exports);

// src/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super(`Resource not found! `);
  }
};

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FetchRequirementsByPetUseCase
});
