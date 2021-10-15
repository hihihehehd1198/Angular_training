import {Injectable} from '@angular/core';
import {PagedData} from './page/paged-data';
import {Page} from './page/page';
import {Account} from './account.model';
import {Observable, from, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';


@Injectable()
export class PagingPage {
  public getResults(page: Page, companyData: Account[]): Observable<PagedData<Account>> {

    const thread = new Observable<PagedData<Account>>();
    thread.pipe(map(user => {
      this.getPagedData(page, companyData);
    }));
    return thread;
  }

  public getPagedData(page: Page, companyData: any): PagedData<any> {
    const pagedData = new PagedData<Account>();
    page.totalElements = companyData.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = companyData[i];
      const employee: Account = {
        _id: jsonObj._id,
        account_number: jsonObj.account_number,
        balance: jsonObj.balance,
        age: jsonObj.age,
        firstname: jsonObj.firstname,
        lastname: jsonObj.lastname,
        gender: jsonObj.gender,
        address: jsonObj.address,
        employer: jsonObj.employer,
        email: jsonObj.emaill,
        city: jsonObj.city,
        state: jsonObj.state,
      };
      pagedData.data.push(employee);
    }
    pagedData.page = page;
    return pagedData;
  }
}
