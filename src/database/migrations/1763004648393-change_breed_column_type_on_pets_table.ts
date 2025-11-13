import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeBreedColumnTypeOnPetsTable1763004648393 implements MigrationInterface {
    name = 'ChangeBreedColumnTypeOnPetsTable1763004648393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN "breed"`);
        await queryRunner.query(`DROP TYPE "public"."pets_breed_enum"`);
        await queryRunner.query(`ALTER TABLE "pets" ADD "breed" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pets" DROP COLUMN "breed"`);
        await queryRunner.query(`CREATE TYPE "public"."pets_breed_enum" AS ENUM('DOG', 'CAT', 'RABBIT', 'BIRD', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "pets" ADD "breed" "public"."pets_breed_enum" NOT NULL`);
    }

}
