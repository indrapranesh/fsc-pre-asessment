import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicsAuthService } from './services/dynamics-auth.service';
import { DecisionTreeService } from './services/decision-tree.service';
import { HttpClientModule } from '@angular/common/http';
import { DecisionTreeComponent } from './components/descision-tree/decision-tree.component';
import { AntdesignModule } from './modules/antdesign/antdesign.module'; 
import { SharedModule } from './modules/shared/shared.module';
import { StepsFilterComponent } from './components/steps-filter/steps-filter.component';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { MatrixComponent } from './components/matrix/matrix.component';
import { ChecklistComponent } from './components/checklist/checklist.component';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

@NgModule({
  declarations: [
    AppComponent,
    DecisionTreeComponent,
    StepsFilterComponent,
    MatrixComponent,
    ChecklistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AntdesignModule,
    SharedModule
  ],
  providers: [
    DynamicsAuthService,
    DecisionTreeService,
    { provide: NZ_ICONS, useValue: icons }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
