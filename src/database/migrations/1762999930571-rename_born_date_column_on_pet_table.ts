import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameBornDateColumnOnPetTable1762999930571 implements MigrationInterface {
    name = 'RenameBornDateColumnOnPetTable1762999930571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pets" RENAME COLUMN "born_date" TO "birth_date"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pets" RENAME COLUMN "birth_date" TO "born_date"`);
    }

}
