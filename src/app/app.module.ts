import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicsAuthService } from './services/dynamics-auth.service';
import { DecisionTreeService } from './services/decision-tree.service';
import { HttpClientModule } from '@angular/common/http';
import { DescisionTreeComponent } from './components/descision-tree/descision-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    DescisionTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    DynamicsAuthService,
    DecisionTreeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
