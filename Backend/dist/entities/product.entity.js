"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
let Product = class Product {
    category_id;
    product_id;
    product_name;
    description;
    stock_quantity;
    image;
    price;
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'category_id' }),
    __metadata("design:type", String)
], Product.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'product_id' }),
    __metadata("design:type", String)
], Product.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name' }),
    __metadata("design:type", String)
], Product.prototype, "product_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_quantity' }),
    __metadata("design:type", Number)
], Product.prototype, "stock_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, name: 'price' }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)({ name: 'product', schema: 'public' })
], Product);
//# sourceMappingURL=product.entity.js.map