import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUsers1602525778284 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(new Table({
			name: "user",
			columns: [
				{
					name: "email",
					type: "varchar",
					isPrimary: true,
					isUnique: true
				},
				{
					name: "name",
					type: "varchar",
					isNullable: false
				}
			]
		}), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("user", true);
	}

}
