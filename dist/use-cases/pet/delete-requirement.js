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

// src/use-cases/pet/delete-requirement.ts
var delete_requirement_exports = {};
__export(delete_requirement_exports, {
  DeleteRequirementUseCase: () => DeleteRequirementUseCase
});
module.exports = __toCommonJS(delete_requirement_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteRequirementUseCase
});
