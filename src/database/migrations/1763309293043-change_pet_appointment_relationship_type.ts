import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePetAppointmentRelationshipType1763309293043 implements MigrationInterface {
    name = 'ChangePetAppointmentRelationshipType1763309293043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_47439f4739409e7e27f2e5444d5"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "REL_47439f4739409e7e27f2e5444d"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_47439f4739409e7e27f2e5444d5" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_47439f4739409e7e27f2e5444d5"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "REL_47439f4739409e7e27f2e5444d" UNIQUE ("pet_id")`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_47439f4739409e7e27f2e5444d5" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
