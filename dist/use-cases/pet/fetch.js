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

// src/use-cases/pet/fetch.ts
var fetch_exports = {};
__export(fetch_exports, {
  FetchPetsUseCase: () => FetchPetsUseCase
});
module.exports = __toCommonJS(fetch_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FetchPetsUseCase
});
