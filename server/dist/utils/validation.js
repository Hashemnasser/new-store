"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidSort = void 0;
// src/utils/validation.ts
const SORT_OPTIONS = [
    "newest",
    "price-asc",
    "price-desc",
    "title-asc",
    "title-desc",
];
const isValidSort = (value) => {
    return SORT_OPTIONS.includes(value);
};
exports.isValidSort = isValidSort;
