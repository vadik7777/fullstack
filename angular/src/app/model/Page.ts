// Copyright © 2020 Vadim Konovalov. Contacts: <vadik.olympus@e1.ru>
// License: https://www.eclipse.org/legal/epl-2.0/

export class Page {
  pageIndex: number;
  pageSize: number;
  length: number;
  constructor() {
    this.pageIndex =  0;
    this.pageSize = 10;
  }
}
