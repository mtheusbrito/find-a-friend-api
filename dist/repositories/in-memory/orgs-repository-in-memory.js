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

// src/repositories/in-memory/orgs-repository-in-memory.ts
var orgs_repository_in_memory_exports = {};
__export(orgs_repository_in_memory_exports, {
  OrgsRepositoryInMemory: () => OrgsRepositoryInMemory
});
module.exports = __toCommonJS(orgs_repository_in_memory_exports);
var import_client = require("@prisma/client");
var import_crypto = require("crypto");
var OrgsRepositoryInMemory = class {
  constructor() {
    this.items = [];
  }
  async create(data) {
    const newItem = {
      ...data,
      id: (0, import_crypto.randomUUID)(),
      latitude: new import_client.Prisma.Decimal(
        data.latitude ? data.latitude.toString() : 0
      ),
      longitude: new import_client.Prisma.Decimal(
        data.longitude ? data.longitude.toString() : 0
      ),
      city: data.city ?? "",
      state: data.state ?? "",
      phone: data.phone ?? "",
      created_at: /* @__PURE__ */ new Date(),
      email: data.email ?? ""
    };
    this.items.push(newItem);
    return newItem;
  }
  async findByEmail(email) {
    const org = this.items.find((o) => o.email === email);
    if (!org) {
      return null;
    }
    return org;
  }
  async findById(id) {
    const org = this.items.find((o) => o.id === id);
    if (!org) {
      return null;
    }
    return org;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OrgsRepositoryInMemory
});
