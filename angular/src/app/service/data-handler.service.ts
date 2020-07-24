// Copyright © 2020 Vadim Konovalov. Contacts: <vadik.olympus@e1.ru>
// License: https://www.eclipse.org/legal/epl-2.0/

import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {TodoItemNode} from '../model';
import {Page} from '../model/Page';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {ConfirmationComponent} from '../views/confirmation/confirmation.component';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  private backEndUrl = 'https://188.234.89.238/api';

  page: Page;
  localFind: boolean;
  search: boolean;
  searchTitle: string;
  loading: boolean;

  dataChange: BehaviorSubject<TodoItemNode[]>;
  dataPage: Subject<Page>;
  dataChangeSearch: Subject<TodoItemNode[]>;
  searchData: Subject<boolean>;

  constructor(private http: HttpClient, public dialog: MatDialog) {

    this.page = new Page();
    this.localFind = false;
    this.search  = false;
    this.searchTitle = '';
    this.loading = false;

    this.dataChange = new BehaviorSubject<TodoItemNode[]>([]);
    this.dataPage = new Subject<Page>();
    this.dataChangeSearch = new Subject<TodoItemNode[]>();
    this.searchData = new Subject<boolean>();

    this.updateCount();
    this.changePage(this.page.pageIndex, this.page.pageSize);
  }

  get data(): TodoItemNode[] { return this.dataChange.value; }

  getData(): Observable<TodoItemNode[]> {
    return this.http.get<TodoItemNode[]>(this.backEndUrl + '/all/' + this.page.pageIndex + '/' + this.page.pageSize)
      .pipe(
        catchError(this.handleError<TodoItemNode[]>('Ошибка при получении данных записей', []))
      );
  }

  getDataSearch(): Observable<TodoItemNode[]> {
    return this.http.get<TodoItemNode[]>(this.backEndUrl + '/search/' + this.searchTitle + '/'
      + this.page.pageIndex + '/' + this.page.pageSize)
      .pipe(
        catchError(this.handleError<TodoItemNode[]>('Ошибка при получении данных записей для поиска', []))
      );
  }

  getDataCount(): Observable<number> {
    return this.http.get<number>(this.backEndUrl + '/length')
      .pipe(
        catchError(this.handleError<number>('Ошибка при получении количества записей', -1))
      );
  }

  getDataSearchCount(): Observable<number> {
    return this.http.get<number>(this.backEndUrl + '/search-length/' + this.searchTitle)
      .pipe(
        catchError(this.handleError<number>('Ошибка при получении количества записей для поиска', -1))
      );
  }

  putData(data: TodoItemNode, title: string): Observable<TodoItemNode> {
    const body = {id: data.id, title: title};
    return this.http.post<TodoItemNode>(this.backEndUrl + '/create', body).pipe(
      tap(_ => this.handleSuccess('Запись успешно добавлена', title)),
      catchError(this.handleError<TodoItemNode>('Ошибка при добавлении записи'))
    );
  }

  updateData(data: TodoItemNode, title: string): Observable<TodoItemNode> {
    const body = {id: data.id, title: title};
    return this.http.post<TodoItemNode>(this.backEndUrl + '/update', body).pipe(
      tap(_ => this.handleSuccess('Запись успешно обновлена', title)),
      catchError(this.handleError<TodoItemNode>('Ошибка при обновлении записи'))
    );
  }

  removeData(data: TodoItemNode): Observable<number> {
    const body = {id: data.id};
    return this.http.post<number>(this.backEndUrl + '/delete', body).pipe(
      tap(_ => this.handleSuccess('Запись успешно удалена', data.title)),
      catchError(this.handleError<number>('Ошибка при удалении записи', -1))
    );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.dialog.open(ConfirmationComponent, {data: { title: `${operation}`, info: `${error.message}`}});
      return of(result as T);
    };
  }

  handleSuccess(title: string, info: string) {
    this.dialog.open(ConfirmationComponent, {data: { title: title, info: `Запись: ${info}`}});
  }

  updateCount() {
    this.getDataCount().subscribe(response => {
      if (response === -1) {
        this.page.pageIndex = 0;
        this.page.length = 0;
      } else {
        this.page.length = response;
      }
      this.dataPage.next(this.page);
    });
  }

  updateCountSearch() {
    this.getDataSearchCount().subscribe(response => {
      if (response === -1) {
        this.page.length = 0;
      } else {
        this.page.length = response;
      }
      this.page.pageIndex = 0;
      this.dataPage.next(this.page);
    });
  }

  changePage(pageIndex: number, pageSize: number) {
    if (this.loading) { return; } else { this.loading = true; }
    this.page.pageIndex = pageIndex;
    this.page.pageSize = pageSize;
    if (this.search) {
      this.getDataSearch().subscribe(response => {
        this.dataChangeSearch.next(response);
      });
    } else {
      this.getData().subscribe(response => {
        this.dataChange.next(response);
      });
    }
    this.loading = false;
  }

  insertItem(parent: TodoItemNode, title: string) {
    if (this.loading) { return; } else { this.loading = true; }
    this.putData(parent, title).subscribe(response => {
      if (!response) { return; }
      if (parent.children) {
        parent.children.push({title: response.title, id: response.id} as TodoItemNode);
        this.dataChange.next(this.data);
      } else {
        parent.children = [{title: response.title, id: response.id} as TodoItemNode];
        this.dataChange.next(this.data);
      }
    });
    this.loading = false;
  }

  updateItem(node: TodoItemNode, title: string) {
    if (this.loading) { return; } else { this.loading = true; }
    this.updateData(node, title).subscribe(response => {
      if (!response) { return; }
      node.title = response.title;
      this.dataChange.next(this.data);
    });
    this.loading = false;
  }

  removeItem(node: TodoItemNode) {
    if (this.loading) { return; } else { this.loading = true; }
    this.removeData(node).subscribe(response => {
      if (response === -1) { return; }
      this.localFind = false;
      this.recursive(this.data, node);
      this.dataChange.next(this.data);
      this.updateCount();
    });
    this.loading = false;
  }

  recursive(data: TodoItemNode[], node: TodoItemNode) {
    if (data.indexOf(node) === -1) {
      data.forEach(item => {
        if (item.children && !this.localFind) {
          this.recursive(item.children, node);
        } else if (this.localFind) {
          return;
        }});
    } else {
      data.splice(data.indexOf(node), 1);
      this.localFind = true;
    }
  }

  findData(title: string) {
    if (this.loading) { return; } else { this.loading = true; }
    if (title === '' && this.search === true) {
      this.searchTitle = title;
      this.search = false;
      this.searchData.next(this.search);
      this.updateCount();
      this.loading = false;
      this.changePage(0, this.page.pageSize);
    } else if (this.searchTitle !== title) {
      this.searchTitle = title;
      if (this.search === false) {
        this.search = true;
        this.searchData.next(this.search);
      }
      this.updateCountSearch();
      this.loading = false;
      this.changePage(0, this.page.pageSize);
    }
    this.loading = false;
  }
}
