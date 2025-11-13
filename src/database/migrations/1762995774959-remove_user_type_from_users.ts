import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserTypeFromUsers1762995774959 implements MigrationInterface {
    name = 'RemoveUserTypeFromUsers1762995774959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."users_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_type_enum" AS ENUM('BASIC', 'PROFESSIONAL')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "type" "public"."users_type_enum" NOT NULL DEFAULT 'BASIC'`);
    }

}
