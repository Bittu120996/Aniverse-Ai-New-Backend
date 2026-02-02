import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGenerations1769418416938 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
    CREATE TABLE "generations" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" uuid NOT NULL,
      "imageUrl" varchar NOT NULL,
      "animeStyle" varchar NOT NULL,
      "isPublic" boolean NOT NULL DEFAULT true,
      "createdAt" timestamp NOT NULL DEFAULT now()
    )
  `);

     await queryRunner.query(`
    CREATE INDEX "IDX_GENERATIONS_USER" ON "generations" ("userId")
  `);
}


    public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`DROP TABLE "generations"`);
}

}
