// Copyright © 2020 Vadim Konovalov. Contacts: <vadik.olympus@e1.ru>
// License: https://www.eclipse.org/legal/epl-2.0/

import {Component} from '@angular/core';
import {DataHandlerService} from '../../service/data-handler.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  title: string;

  constructor(private _database: DataHandlerService) {
    this.title = '';
  }

  search() {
    this._database.findData(this.title);
  }
}
