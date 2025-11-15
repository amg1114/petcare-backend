import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppointmentsTable1763240783718 implements MigrationInterface {
    name = 'CreateAppointmentsTable1763240783718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."appointments_service_type_enum" AS ENUM('BATH', 'HAIRCUT', 'CONSULTATION', 'FOLLOW UP', 'DAYCARE', 'PET TRANSPORTATION', 'MEDICAL REVIEW')`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheduled_at" TIMESTAMP WITH TIME ZONE NOT NULL, "service_type" "public"."appointments_service_type_enum" NOT NULL, "duration" numeric NOT NULL, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "pet_id" uuid, "veterinarian_id" uuid, CONSTRAINT "REL_47439f4739409e7e27f2e5444d" UNIQUE ("pet_id"), CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_47439f4739409e7e27f2e5444d5" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_928986ec679d42f78b139bff0f5" FOREIGN KEY ("veterinarian_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_928986ec679d42f78b139bff0f5"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_47439f4739409e7e27f2e5444d5"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_service_type_enum"`);
    }

}
