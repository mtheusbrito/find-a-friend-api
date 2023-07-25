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

// src/use-cases/pet/upload-images.ts
var upload_images_exports = {};
__export(upload_images_exports, {
  UploadImagesPetUseCase: () => UploadImagesPetUseCase
});
module.exports = __toCommonJS(upload_images_exports);

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

// src/use-cases/pet/upload-images.ts
var UploadImagesPetUseCase = class {
  constructor(imagesPetRepository, petsRepository) {
    this.imagesPetRepository = imagesPetRepository;
    this.petsRepository = petsRepository;
  }
  async execute({
    images_name,
    pet_id,
    org_id
  }) {
    const pet = await this.petsRepository.findById(pet_id);
    if (!pet) {
      throw new ResourceNotFoundError();
    }
    if (pet.organization_id !== org_id) {
      throw new UnauthorizedError();
    }
    const images = await this.imagesPetRepository.createManyImagesPet(
      images_name.map((i) => {
        return { name: i };
      }),
      pet_id
    );
    return { images };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UploadImagesPetUseCase
});
