import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateServiceTypeEnum1763308237336 implements MigrationInterface {
    name = 'UpdateServiceTypeEnum1763308237336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."appointments_service_type_enum" RENAME TO "appointments_service_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_service_type_enum" AS ENUM('BATH', 'HAIRCUT', 'FOLLOW UP', 'DAYCARE', 'PET TRANSPORTATION', 'MEDICAL REVIEW')`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "service_type" TYPE "public"."appointments_service_type_enum" USING "service_type"::"text"::"public"."appointments_service_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_service_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."appointments_service_type_enum_old" AS ENUM('BATH', 'HAIRCUT', 'CONSULTATION', 'FOLLOW UP', 'DAYCARE', 'PET TRANSPORTATION', 'MEDICAL REVIEW')`);
        await queryRunner.query(`ALTER TABLE "appointments" ALTER COLUMN "service_type" TYPE "public"."appointments_service_type_enum_old" USING "service_type"::"text"::"public"."appointments_service_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_service_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."appointments_service_type_enum_old" RENAME TO "appointments_service_type_enum"`);
    }

}
