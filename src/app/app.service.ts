import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Item } from './item.model';
import { BehaviorSubject } from 'rxjs';

@Injectable(
{
  providedIn: 'root'
})
export class AppService
{
    items: Item[];
    onItemsChanged: BehaviorSubject<Item[]>

    private _ipc: IpcRenderer | undefined;

    constructor()
    {
        if (window.require)
        {
            try
            {
                this._ipc = window.require('electron').ipcRenderer;
                this.items = [];
                this.onItemsChanged = new BehaviorSubject([]);
            }
            catch (error)
            {
                console.log(error)
            }
            
        }
    }

    addItem(item: Item): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                let msg = this._ipc.sendSync('synchronous-message', 'add-item', item)
                this.items.push(item);
                this.onItemsChanged.next(this.items);
                resolve(msg)
            }
            catch (error)
            {
                reject(error)
            }
        })
    }

    deleteItem(): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                let msg = this._ipc.sendSync('synchronous-message', 'delete-item', this.items[this.items.length - 1]);
                this.items.pop();
                this.onItemsChanged.next(this.items);
                resolve(msg);
            }
            catch (error)
            {
                reject(error)
            }
        })
    }
}
