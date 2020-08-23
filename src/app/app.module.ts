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
import { AdditionalQuestionsComponent } from './components/additional-questions/additional-questions.component';
import { DownloadComponent } from './components/download/download.component';
import { UploadComponent } from './components/upload/upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommunicateComponent } from './components/communicate/communicate.component';
import { LocationComponent } from './components/location/location.component';

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
    ChecklistComponent,
    AdditionalQuestionsComponent,
    DownloadComponent,
    UploadComponent,
    CommunicateComponent,
    LocationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AntdesignModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DynamicsAuthService,
    DecisionTreeService,
    { provide: NZ_ICONS, useValue: icons }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
