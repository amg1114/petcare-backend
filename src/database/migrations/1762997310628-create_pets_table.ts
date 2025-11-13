import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePetsTable1762997310628 implements MigrationInterface {
    name = 'CreatePetsTable1762997310628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pets_species_enum" AS ENUM('DOG', 'CAT', 'RABBIT', 'BIRD', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."pets_breed_enum" AS ENUM('DOG', 'CAT', 'RABBIT', 'BIRD', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "pets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "species" "public"."pets_species_enum" NOT NULL, "breed" "public"."pets_breed_enum" NOT NULL, "born_date" date NOT NULL, "weight" numeric(5,2), "photo" character varying, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "owner_id" uuid, CONSTRAINT "PK_d01e9e7b4ada753c826720bee8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pets" ADD CONSTRAINT "FK_d6c565fded8031d4cdd54fe1043" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pets" DROP CONSTRAINT "FK_d6c565fded8031d4cdd54fe1043"`);
        await queryRunner.query(`DROP TABLE "pets"`);
        await queryRunner.query(`DROP TYPE "public"."pets_breed_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pets_species_enum"`);
    }

}
