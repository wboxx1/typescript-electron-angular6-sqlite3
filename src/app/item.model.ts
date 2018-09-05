export class Item
{
    id: number;
    name: string;

    constructor(item?)
    {
        item = item || {};
        this.id = item.id || undefined;
        this.name = item.name || '';
    }
}
