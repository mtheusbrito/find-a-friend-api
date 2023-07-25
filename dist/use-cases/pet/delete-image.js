"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-cases/pet/delete-image.ts
var delete_image_exports = {};
__export(delete_image_exports, {
  DeleteImageUseCase: () => DeleteImageUseCase
});
module.exports = __toCommonJS(delete_image_exports);

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

// src/utils/file.ts
var import_fs = __toESM(require("fs"));
var deleteFile = async (fileName) => {
  try {
    await import_fs.default.promises.stat(fileName);
  } catch {
    return;
  }
  await import_fs.default.promises.unlink(fileName);
};

// src/use-cases/pet/delete-image.ts
var DeleteImageUseCase = class {
  constructor(petsRepository, imagesPetRepository) {
    this.petsRepository = petsRepository;
    this.imagesPetRepository = imagesPetRepository;
  }
  async execute({
    pet_id,
    org_id,
    img_id
  }) {
    const pet = await this.petsRepository.findById(pet_id);
    if (!pet) {
      throw new ResourceNotFoundError();
    }
    if (pet.organization_id !== org_id) {
      throw new UnauthorizedError();
    }
    const image = await this.imagesPetRepository.findById(img_id);
    if (!image) {
      throw new ResourceNotFoundError();
    }
    const imageOnPet = await this.imagesPetRepository.findByPetIdAndImageId(
      pet.id,
      image.id
    );
    if (!imageOnPet) {
      throw new UnauthorizedError();
    }
    await this.imagesPetRepository.deleteById(image.id);
    await deleteFile(`./tmp/pets/${image.name}`);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteImageUseCase
});
