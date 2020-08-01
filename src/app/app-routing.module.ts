import { ScheduleManagementComponent } from './schedule-management/schedule-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherPlateComponent } from './teacher-plate/teacher-plate.component';


const routes: Routes = [
  { path: 'plate', component: TeacherPlateComponent },
  { path: 'schedule-management', component: ScheduleManagementComponent},
  { path: '',
    redirectTo: '/plate',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
