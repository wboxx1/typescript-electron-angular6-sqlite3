// entries_repository.js
import * as typeorm from 'typeorm';
import { Item } from './assets/models/item.schema';


export class DbService {
	static postEntry(connection: typeorm.Connection, item: Item): Promise<typeorm.InsertResult>
	{
		const { id, name } = item;
		return (
			connection
			.getRepository('Item')
			.createQueryBuilder()
			.insert()
			.values(
				[{
					name: name
				}])
			.execute()
		);
	}

	static deleteEntry(connection: typeorm.Connection, id: string): Promise<typeorm.DeleteResult>
	{
		return (
			connection
			.getRepository('Item')
			.createQueryBuilder()
			.delete()
			.where('item.id = :id', { id: id })
			.execute()
		);
	}

	static getEntries(connection: typeorm.Connection): Promise<{}[]>
	{
		return (
			connection
			.getRepository('Item')
			.createQueryBuilder('item')
			.getMany()
		);
	}
}
