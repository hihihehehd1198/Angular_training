import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {fakeBackendProvider} from './core/services/fake-backend';
import {AccountService} from './core/services/account.service';
import {HttpClientModule} from '@angular/common/http';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import {
  NbCardModule,
  NbDialogModule,
  NbIconModule,
  NbLayoutModule, NbRadioModule,
  NbThemeModule,
  NbToastrModule,
  NbTooltipModule
} from '@nebular/theme';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {config} from 'rxjs';
import {RouterModule, Routes} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import { ValidateComponent } from './shared/validate/validate.component';
import { TableComponent } from './shared/table/table.component';
// import { SharedComponent } from './shared/shared.component';

// @ts-ignore
@NgModule({
  // tslint:disable-next-line:max-line-length
  imports: [BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NbCardModule, NbLayoutModule,
    NgxDatatableModule,
    NbEvaIconsModule,
    NbTooltipModule,
    NbIconModule,
    NbDialogModule.forRoot(), ReactiveFormsModule,
    NbToastrModule.forRoot(),
    NbThemeModule.forRoot(), NbRadioModule,
  ],
  declarations: [AppComponent, ValidateComponent, TableComponent],
  bootstrap: [AppComponent],
  providers: [
    // provider used to create fake backend,
    AccountService,
    fakeBackendProvider
  ]
})
export class AppModule {
}
