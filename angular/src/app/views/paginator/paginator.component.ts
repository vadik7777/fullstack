import {Component, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {DataHandlerService} from '../../service/data-handler.service';
import {Page} from '../../model/Page';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent {

  constructor(private _database: DataHandlerService) {
    _database.dataPage.subscribe(page => {
      this.length = page.length;
      this.pageSize = page.pageSize;
      this.pageIndex = page.pageIndex;
    });
  }

  length: number;
  pageSize: number;
  pageIndex: number;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];

  pageEvent: PageEvent;

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
  public changePage(event: PageEvent) {
    this._database.changePage(event.pageIndex, event.pageSize);
    return event;
  }
}
