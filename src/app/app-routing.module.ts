import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DescisionTreeComponent } from './components/descision-tree/descision-tree.component';


const routes: Routes = [
  {
    path: 'self-identity',
    component: DescisionTreeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
