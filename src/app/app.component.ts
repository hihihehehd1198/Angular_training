import {Component, OnInit, VERSION} from '@angular/core';
import {AccountService} from './core/services/account.service';
import {Observable, Subject} from 'rxjs';
import {Account, createAccount, createParamSearch, ParamSearch} from './core/model/account.model';
import {takeUntil} from 'rxjs/operators';
import {Accounts} from './core/data/account';
import * as faker from 'faker';
// import {FormBuilder} from '@angular/forms';
import {NbDialogService, NbToastrService} from '@nebular/theme';

import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray, AbstractControl
} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  account: Account[] = [];
  unSubscribeAll: Subject<any>;
  isOpenAddAccount = false;
  isOpenEditAccount = false;
  selectedAccount: Account | undefined;
  searchStr = '';
  limit = 25;
  rowData: any = [];
  textSearch = '';
  columnsTable = [
    // {name: 'Name', prop: 'lastname', flexGrow: 0.5},
    {name: 'Stt', prop: 'stt', flexGrow: 0.5},
    {name: 'Name', prop: 'firstname', flexGrow: 1},
    {name: 'Age', prop: 'age', flexGrow: 1},
    {name: 'Balance', prop: 'balance', flexGrow: 1},
    // {name: 'Thao tác', prop: 'IP', flexGrow: 0.9},
    // {name: 'Name', prop: 'city', flexGrow: 0.5},
    // {name: 'Age', prop: 'email', flexGrow: 0.9},
    // {name: 'Balance', prop: 'gender', flexGrow: 0.9},
    {name: 'Thao tác', prop: 'action', flexGrow: 1},
  ];
  FormGroupUser: any;

  constructor(private accountService: AccountService,
              private fb: FormBuilder,
              public dialogService: NbDialogService,
              private toastrService: NbToastrService,
  ) {
    // read data from file to localstorage
    this.unSubscribeAll = new Subject<any>();
    this.loadDataToLocal();
  }

  ngOnInit(): void {
    this.getAllAccount();
    this.FormGroupUser = this.fb.group({


      account_number: [null, [Validators.required]],
      address: [null, [Validators.required]],
      age: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      balance: [null, [Validators.required, Validators.min(0)]],
      city: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )]],
      employer: [null, [Validators.required]],
      firstname: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      state: [null, [Validators.required]],
      _id: [null, [Validators.required]],

    });
  }

  loadDataToLocal(): void {
    localStorage.setItem('accounts', JSON.stringify(Accounts));
  }


  getAllAccount(): void {
    this.accountService.getAccounts(createParamSearch({
      last_name: this.searchStr,
      start: 0,
      limit: 10000
    }))
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe((resp: Account[]) => {
        this.account = resp.sort((a: any, b: any) => {
          if (a.age >= b.age) {
            return 1;
          } else if (a.age <= b.age) {
            return -1;
          } else {
            return 0;
          }
        });
        console.log(this.rowData);
      }, (err: Error) => {
        this.account = [];
      });
  }

  openAddAccount(): void {
    this.isOpenAddAccount = true;
  }

  openEdit(acc: Account): void {
    this.selectedAccount = acc;
    this.isOpenEditAccount = true;
  }

  saveEdit(): void {
    const editedAccount = createAccount({
      balance: parseInt(faker.finance.amount(0, 99999), 0),
      age: 25,
      lastname: faker.name.lastName(),
      firstname: faker.name.lastName(),
      city: this.selectedAccount?.city,
      account_number: this.selectedAccount?.account_number,
      address: this.selectedAccount?.address,
      email: this.selectedAccount?.email,
      employer: this.selectedAccount?.employer,
      gender: 'F',
      state: this.selectedAccount?.state,
      _id: this.selectedAccount?._id
    });

    this.accountService.editAccount(editedAccount)
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe((resp: Account[]) => {
        this.getAllAccount();
        this.isOpenEditAccount = false;
      }, (err: Error) => {
        this.account = [];
      });
  }

  saveNew(): void {
    const newAccount = createAccount({
      balance: parseInt(faker.finance.amount(0, 99999), 0),
      age: 25,
      lastname: faker.name.lastName(),
      firstname: faker.name.lastName(),
      city: faker.address.city(),
      account_number: faker.finance.account(),
      address: faker.address.streetAddress(),
      email: faker.internet.email(),
      employer: faker.name.lastName(),
      gender: 'F',
      state: faker.address.stateAbbr()
    });

    this.accountService.addAccount(newAccount)
      .pipe(takeUntil(this.unSubscribeAll))
      .subscribe((resp: Account[]) => {
        this.getAllAccount();
        this.isOpenAddAccount = false;
      }, (err: Error) => {
        this.account = [];
      });
  }

  search(): void {
    console.log('text:', this.textSearch);

    this.accountService.getAccounts(createParamSearch({
      limit: 700,
      start: 0,
      first_name: this.textSearch,
    })).subscribe(res => {
      console.log(res);
    });
  }

  editRow(): void {

  }

  deleteRow(row: any): void {
    console.log(row);
    this.accountService.deleteAccount(row).subscribe(user => {
      console.log(user);
      this.getAllAccount();
    });
  }

  viewDetails(row: any): void {
    this.FormGroupUser.setValue(row);
    this.FormGroupUser.disable();
  }

  ActionForm(title: any, ref: any): void {
    // console.log(title);
    if (title.toString() === 'edit') {
      this.editForm();
    } else if (title.toString() === 'add') {

      this.AddForm();
    } else if (title.toString() === 'search') {
      this.SearchForm();
    }
    ref.close();
  }

  GetValueEdit(row: any): void {
    this.FormGroupUser.enable();
    this.FormGroupUser.setValue(row);
  }

  editForm(): void {
    // console.log(this.FormGroupUser.value);
    this.accountService.editAccount(this.FormGroupUser.value).subscribe(user => {
      console.log(user);
      this.getAllAccount();
    });
  }

  SearchForm(): void {


    console.log(this.FormGroupUser.value);
    console.log(this.FormGroupUser.controls.address.value);
    const valueSearch = {
      limit: 700,
      start: 0,
      last_name: this.FormGroupUser.controls.lastname.value,
      first_name: this.FormGroupUser.controls.firstname.value,
      email: this.FormGroupUser.controls.email.value,
      gender: this.FormGroupUser.controls.gender.value,
      address: this.FormGroupUser.controls.address.value,
    };
    console.log('value', valueSearch);
    this.accountService.getAccounts(createParamSearch(valueSearch)).subscribe(user => {
      console.log(user);
    });
  }

  AddForm(): void {
//   •	balance: number
// •	age: number
// •	lastname: string
// •	firstname: string
// •	city: string
// •	account_number: number
// •	address: string
// •	email: string
// •	employer: string
// •	gender: string
// •	state: string;
    this.accountService.addAccount(this.FormGroupUser.value).subscribe(user => {
      console.log(user);
      this.getAllAccount();
    });
  }

  openForm(addOrEdit: any, text: string): void {
    this.FormGroupUser.reset();
    this.dialogService.open(addOrEdit, {context: {title: text}, closeOnBackdropClick: false});
    this.FormGroupUser.setValue({
      account_number: '',
      address: '',
      age: '',
      balance: '',
      city: '',
      email: '',
      employer: '',
      firstname: '',
      gender: '',
      lastname: '',
      state: '',
      _id: '',

    });
  }

  closeForm(ref: any): void {
    ref.close();
    this.FormGroupUser.enable();
  }

  openFormWithTable(data: any): void {
    console.log(data);
    const title = data.edit1;
    const addOrEdit = data.addOrEdit1;
    const row = data.row1;
    if (title.toString() === 'edit') {
      this.GetValueEdit(row);
      this.dialogService.open(addOrEdit, {context: {title: 'edit'}, closeOnBackdropClick: false});
    } else if (title.toString() === 'details') {
      this.viewDetails(row);
      this.dialogService.open(addOrEdit, {context: {title: 'detail'}, closeOnBackdropClick: false});
    }
  }


}
