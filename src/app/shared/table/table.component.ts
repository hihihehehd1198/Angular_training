import {
  AfterViewChecked,
  AfterViewInit, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Account} from '../../core/model/account.model';
import {Subject} from 'rxjs';
import {AccountService} from '../../core/services/account.service';
import {FormBuilder} from '@angular/forms';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {Page} from '../../core/model/page/page';
import {PagingPage} from '../../core/model/paging-page';
import {PagedData} from '../../core/model/page/paged-data';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {window} from 'rxjs/operators';

@Component({
  selector: 'app-table',
  providers: [PagingPage],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {

  @Input() account: any;
  @Input() isOpenAddAccount: any;
  @Input() isOpenEditAccount?: any;
  @Input() selectedAccount?: any;
  @Input() limit?: any;
  @Input() rowData?: any;

  @Input() columnsTable?: any;
  @Input() FormGroupUser?: any;
  // @Output() viewDetails = new EventEmitter<any>();
  //
  // @Output() GetValueEdit = new EventEmitter<any>();
  // @Output() deleteRow = new EventEmitter<any>();
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() newItemEvent1 = new EventEmitter<any>();
  @Output() newItemEvent2 = new EventEmitter<any>();

  @Output() newItemEvent3 = new EventEmitter<{ edit1: string, row1: any, addOrEdit1: any }>();
  @Input() addOrEdit: any;
  // @ViewChild('myTable') table: any;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  currentComponentWidth: any;
  @ViewChild('tableWrapper') tableWrapper: any;

  page = new Page();
  rows = new Array<Account>();
  cache: any = {};
  public isLoading = false;

  constructor(private accountService: AccountService,
              private fb: FormBuilder,
              public dialogService: NbDialogService,
              public changeDetectorRef: ChangeDetectorRef,
              public pagingPage: PagingPage,
              private toastrService: NbToastrService) {
    // this.setPage({offset: 0, pageSize: 1000});
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  // account: any = [];
  // isOpenAddAccount = false;
  // isOpenEditAccount = false;
  // selectedAccount: Account | undefined;
  // searchStr = '';
  // limit = 25;
  // rowData: any = [];
  // textSearch = '';
  // columnsTable = [
  //   // {name: 'Name', prop: 'lastname', flexGrow: 0.5},
  //
  //   {name: 'Name', prop: 'firstname', flexGrow: 1},
  //   {name: 'Age', prop: 'age', flexGrow: 1},
  //   {name: 'Balance', prop: 'balance', flexGrow: 1},
  //   {name: 'Thao tác', prop: 'action', flexGrow: 1},
  // ];
  // FormGroupUser: any;


  viewDetails(row: any): void {
    this.newItemEvent.emit(row);

  }

  GetValueEdit(row: any): void {
    this.newItemEvent1.emit(row);
  }

  deleteRow(row: any): void {
    this.newItemEvent2.emit(row);
  }


  openFormWithTable(edit: string, row: any, addOrEdit: any): void {
    this.newItemEvent3.emit({edit1: edit, row1: row, addOrEdit1: addOrEdit});
  }

  setPage($event: any): void {
    this.isLoading = true;
    this.page.pageNumber = $event.offset;
    this.page.size = $event.pageSize;

    this.pagingPage.getResults(this.page, this.account).subscribe((pagedData: PagedData<Account>) => {
      this.page = pagedData.page;

      let rows = this.rows;
      if (rows.length !== pagedData.page.totalElements) {
        rows = Array.apply(null, Array(pagedData.page.totalElements)) as Account[];
        rows = rows.map((x, i) => this.rows[i]);
      }

      // calc start
      const start = this.page.pageNumber * this.page.size;

      // set rows to our new rows
      pagedData.data.map((x, i) => rows[i + start] = x);
      this.rows = rows;
      // console.log(rows);
      this.isLoading = false;
    });
  }

  ngAfterViewInit(): void {
    this.table.bodyComponent.updatePage = function(direction: string): void {
      let offset = this.indexes.first / this.pageSize;

      if (direction === 'up') {
        offset = Math.ceil(offset);
      } else if (direction === 'down') {
        offset = Math.floor(offset);
      }

      if (direction !== undefined && !isNaN(offset)) {
        this.page.emit({offset});
      }
    };
  }

  ngAfterViewChecked(): void {
    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      this.changeDetectorRef.detectChanges();
    }
  }

}
