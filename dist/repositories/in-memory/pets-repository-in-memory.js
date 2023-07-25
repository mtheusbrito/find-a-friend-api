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

// src/repositories/in-memory/pets-repository-in-memory.ts
var pets_repository_in_memory_exports = {};
__export(pets_repository_in_memory_exports, {
  PetsRepositoryInMemory: () => PetsRepositoryInMemory
});
module.exports = __toCommonJS(pets_repository_in_memory_exports);
var import_crypto = require("crypto");
var PetsRepositoryInMemory = class {
  constructor() {
    this.items = [];
  }
  async create(data) {
    const newItem = {
      ...data,
      id: data.id ?? (0, import_crypto.randomUUID)(),
      years: data.years ?? "ADULT",
      port: data.port ?? "AVERAGE",
      dependency_level: data.dependency_level ?? "AVERAGE",
      energy_level: data.energy_level ?? 1,
      environment: data.environment ?? "AVERAGE",
      created_at: /* @__PURE__ */ new Date()
    };
    this.items.push(newItem);
    return newItem;
  }
  async save(data) {
    const index = this.items.findIndex((p) => p.id === data.id);
    if (index >= 0) {
      this.items[index] = { ...data };
    }
    return this.items[index];
  }
  async findById(id) {
    const pet = this.items.find((p) => p.id === id);
    if (!pet) {
      return null;
    }
    return pet;
  }
  async delete(id) {
    this.items = this.items.filter((p) => p.id !== id);
  }
  async fetchAll() {
    const pets = this.items;
    return pets;
  }
  async fetchByFilters(data) {
    return this.items.filter((p) => {
      const withDtype = p.dtype.includes(data.dtype ?? "");
      const withYears = p.years.includes(data.years ?? "");
      const withPort = p.port.includes(data.port ?? "");
      const withenergy_level = p.energy_level.toString().includes(data.energy_level?.toString() ?? "");
      const withdependency_level = p.dependency_level.includes(
        data.dependency_level ?? ""
      );
      const withEnvironment = p.environment.includes(data.environment ?? "");
      return withDtype && withYears && withPort && withenergy_level && withdependency_level && withEnvironment;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PetsRepositoryInMemory
});
