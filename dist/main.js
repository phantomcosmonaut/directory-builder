"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouteNameBuilder_1 = require("./RouteNameBuilder");
if (!process.argv[2]) {
    throw 'An argument for yaml config file path must be provided.';
}
RouteNameBuilder_1.create(process.argv[2], process.argv[3]);
