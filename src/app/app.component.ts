import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { Subscription } from 'rxjs';
import { Item } from './item.model';

@Component(
{
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy
{
	title = 'app';

	private onItemsChanged: Subscription;
	private dbService: AppService;
	private items: Item[];

	constructor()
	{
		this.dbService = new AppService;
		this.items = [];
	}

	ngOnInit()
	{
		this.onItemsChanged = 
			this.dbService.onItemsChanged
			.subscribe(items =>
			{
				this.items = items;
			});
	}

	ngOnDestroy()
	{
		this.onItemsChanged.unsubscribe;
	}

	addItem()
	{
		let item = new Item({id: this.items.length + 1, name: "Item Added"});
		this.dbService.addItem(item)
		.then(msg =>
		{
			console.log(msg);
		})
		.catch(err =>
		{
			console.log(err);
		})
	}

	deleteItem()
	{
		this.dbService.deleteItem()
		.then(msg =>
		{
			console.log(msg);
		})
		.catch(err =>
		{
			console.log(err);   
		})
	}
}
