import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1745937574221 implements MigrationInterface {
    name = 'InitialMigration1745937574221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints that depend on product_pkey
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_category_id_product_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "order_item_category_id_product_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "review_category_id_product_id_fkey"`);

        // Modify the product_pkey constraint
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "product_pkey"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "product_pkey" PRIMARY KEY ("category_id", "product_id")`);

        // Recreate the foreign key constraints
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_category_id_product_id_fkey" FOREIGN KEY ("category_id", "product_id") REFERENCES "product" ("category_id", "product_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "order_item_category_id_product_id_fkey" FOREIGN KEY ("category_id", "product_id") REFERENCES "product" ("category_id", "product_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "review_category_id_product_id_fkey" FOREIGN KEY ("category_id", "product_id") REFERENCES "product" ("category_id", "product_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints that depend on product_pkey
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_category_id_product_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "order_item_category_id_product_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "review_category_id_product_id_fkey"`);

        // Revert the product_pkey constraint
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "product_pkey"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")`);

        // Recreate the foreign key constraints
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_category_id_product_id_fkey" FOREIGN KEY ("category_id", "product_id") REFERENCES "product" ("product_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "order_item_category_id_product_id_fkey" FOREIGN KEY ("category_id", "product_id") REFERENCES "product" ("product_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "review_category_id_product_id_fkey" FOREIGN KEY ("category_id", "product_id") REFERENCES "product" ("product_id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
}