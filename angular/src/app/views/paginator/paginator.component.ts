// Copyright © 2020 Vadim Konovalov. Contacts: <vadik.olympus@e1.ru>
// License: https://www.eclipse.org/legal/epl-2.0/

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

  @ViewChild('paginator') paginator: MatPaginator;

  length: number;
  pageSize: number;
  pageSizeOptions: number[] = [1, 5, 10, 25, 100];
  pageEvent: PageEvent;

  constructor(private _database: DataHandlerService) {
    _database.dataPage.subscribe(page => {
      this.length = page.length;
      this.pageSize = page.pageSize;
      if (page.pageIndex === 0) {
        this.changeToFirstPage();
      }
    });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  changePage(event: PageEvent) {
    this._database.changePage(event.pageIndex, event.pageSize);
    return event;
  }

  changeToFirstPage() {
    this.paginator.firstPage();
  }
}
