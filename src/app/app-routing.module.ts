import { UploadComponent } from './upload/upload.component';
import { ScheduleManagementComponent } from './schedule-management/schedule-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherPlateComponent } from './teacher-plate/teacher-plate.component';
import { TeacherManagementComponent } from './teacher-management/teacher-management.component';
import { StudentPlateComponent } from './student-plate/student-plate.component';


const routes: Routes = [
  { path: 'plate', component: TeacherPlateComponent },
  { path: 'studentPlate', component: StudentPlateComponent },
  { path: 'teacher-management', component: TeacherManagementComponent },
  { path: 'schedule-management', component: ScheduleManagementComponent },
  { path: 'upload', component: UploadComponent },
  {
    path: '',
    redirectTo: '/plate',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
