"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1745937574221 = void 0;
class InitialMigration1745937574221 {
    name = 'InitialMigration1745937574221';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_category_id_product_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "order_item_category_id_product_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "review_category_id_product_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "product_pkey"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "product_pkey" PRIMARY KEY ("category_id", "product_id")`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_category_id_product_id_fkey" FOREIGN KEY ("category_id", "product_id") REFERENCES "product" ("category_id", "product_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "order_item_category_id_product_id_fkey" FOREIGN KEY ("category_id", "product_id") REFERENCES "product" ("category_id", "product_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "review_category_id_product_id_fkey" FOREIGN KEY ("category_id", "product_id") REFERENCES "product" ("category_id", "product_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_category_id_product_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "order_item_category_id_product_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "review_category_id_product_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "product_pkey"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_category_id_product_id_fkey" FOREIGN KEY ("category_id", "product_id") REFERENCES "product" ("product_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "order_item_category_id_product_id_fkey" FOREIGN KEY ("category_id", "product_id") REFERENCES "product" ("product_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "review_category_id_product_id_fkey" FOREIGN KEY ("category_id", "product_id") REFERENCES "product" ("product_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
}
exports.InitialMigration1745937574221 = InitialMigration1745937574221;
//# sourceMappingURL=1745937574221-InitialMigration.js.map