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

// src/http/middlewares/ensure-authenticated.ts
var ensure_authenticated_exports = {};
__export(ensure_authenticated_exports, {
  ensureAuthenticated: () => ensureAuthenticated
});
module.exports = __toCommonJS(ensure_authenticated_exports);
async function ensureAuthenticated(request, reply) {
  try {
    if (!request.headers.authorization) {
      throw new Error();
    }
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized." });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ensureAuthenticated
});
