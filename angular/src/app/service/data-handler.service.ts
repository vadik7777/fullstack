import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
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

  private backEndUrl = 'http://localhost:7001/api';
  page: Page;
  find: boolean;
  dataChange: BehaviorSubject<TodoItemNode[]>;
  dataPage: BehaviorSubject<Page>;

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.page = new Page();
    this.updateCount();
    this.find = false;
    this.dataChange = new BehaviorSubject<TodoItemNode[]>([]);
    this.dataPage = new BehaviorSubject<Page>(this.page);
    this.changePage(this.page.pageIndex, this.page.pageSize);
  }

  get data(): TodoItemNode[] { return this.dataChange.value; }

  getData(pageIndex: number, pageSize: number): Observable<TodoItemNode[]> {
    return this.http.get<TodoItemNode[]>(this.backEndUrl + '/all/' + pageIndex + '/' + pageSize)
      .pipe(
        catchError(this.handleError<TodoItemNode[]>('Ошибка при получении данных записей', []))
      );
  }

  getDataCount(): Observable<number> {
    return this.http.get<number>(this.backEndUrl + '/length')
      .pipe(
        catchError(this.handleError<number>('Ошибка при получении количества записей', -1))
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

  changePage(pageIndex: number, pageSize: number) {
    this.getData(pageIndex, pageSize).subscribe(response => {
      this.dataChange.next(response);
    });
  }

  insertItem(parent: TodoItemNode, title: string) {
    this.putData(parent, title).subscribe(response => {
      if (!response) { return; }
      if (parent.children) {
        parent.children.push({title: response.title, id: response.id} as TodoItemNode);
        this.dataChange.next(this.data);
      } else {
        parent.children = [{title: response.title, id: response.id} as TodoItemNode];
        this.dataChange.next(this.data);
      }
      this.updateCount();
    });
  }

  updateItem(node: TodoItemNode, title: string) {
    this.updateData(node, title).subscribe(response => {
      if (!response) { return; }
      node.title = response.title;
      this.dataChange.next(this.data);
    });
  }

  removeItem(node: TodoItemNode) {
    this.removeData(node).subscribe(response => {
      if (response === -1) { return; }
      this.find = false;
      this.recursive(this.data, node);
      this.dataChange.next(this.data);
      this.updateCount();
    });
  }

  recursive(data: TodoItemNode[], node: TodoItemNode) {
    if (data.indexOf(node) === -1) {
      data.forEach(item => {
        if (item.children && !this.find) {
          this.recursive(item.children, node);
        } else if (this.find) {
          return;
        }});
    } else {
      data.splice(data.indexOf(node), 1);
      this.find = true;
    }
  }
}
