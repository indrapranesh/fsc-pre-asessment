import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StepsFilterComponent } from './components/steps-filter/steps-filter.component';


const routes: Routes = [
  {
    path: 'self-identity',
    component: StepsFilterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
