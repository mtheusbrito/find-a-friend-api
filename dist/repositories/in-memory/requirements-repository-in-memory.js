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

// src/repositories/in-memory/requirements-repository-in-memory.ts
var requirements_repository_in_memory_exports = {};
__export(requirements_repository_in_memory_exports, {
  RequirementsRepositoryInMemory: () => RequirementsRepositoryInMemory
});
module.exports = __toCommonJS(requirements_repository_in_memory_exports);
var import_crypto = require("crypto");
var RequirementsRepositoryInMemory = class {
  constructor() {
    this.items = [];
  }
  async create(data) {
    const newItem = {
      ...data,
      id: data.id ?? (0, import_crypto.randomUUID)(),
      created_at: /* @__PURE__ */ new Date()
    };
    this.items.push(newItem);
    return newItem;
  }
  async delete(id) {
    this.items = this.items.filter((i) => i.id !== id);
  }
  async fetchByPetId(pet_id) {
    return this.items.filter((i) => i.pet_id === pet_id);
  }
  async createMany(data) {
    this.items = [
      ...this.items,
      ...data.map((r) => {
        return { ...r, id: r.id ?? (0, import_crypto.randomUUID)(), created_at: /* @__PURE__ */ new Date() };
      })
    ];
    return await this.fetchByPetId(data[0].pet_id);
  }
  async findById(id) {
    const requirement = this.items.find((r) => r.id === id);
    if (requirement) {
      return requirement;
    }
    return null;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RequirementsRepositoryInMemory
});
