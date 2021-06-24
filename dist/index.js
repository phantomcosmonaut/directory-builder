"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("./Helpers");
const RouteNameBuilder_1 = require("./RouteNameBuilder");
console.log(Helpers_1.buildPath('/consumer/{abc}/data/{avd}', ['brennan', 'phone']));
RouteNameBuilder_1.create(process.argv[2], process.argv[3]);
