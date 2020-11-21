import { TeacherListComponent } from './teacher-management/teacher-list/teacher-list.component';
import { TeacherFormComponent } from './teacher-management/teacher-form/teacher-form.component';
import { MentorPlateComponent } from './mentor-plate/mentor-plate.component';
import { LoginComponent } from './login/login.component';
import { UploadComponent } from './upload/upload.component';
import { ScheduleManagementComponent } from './schedule-management/schedule-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherPlateComponent } from './teacher-plate/teacher-plate.component';
import { TeacherManagementComponent } from './teacher-management/teacher-management.component';
import { StudentPlateComponent } from './student-plate/student-plate.component';

import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: 'plate', component: TeacherPlateComponent, canActivate: [AuthGuard] },
  { path: 'studentPlate', component: StudentPlateComponent, canActivate: [AuthGuard] },
  { path: 'mentorPlate', component: MentorPlateComponent, canActivate: [AuthGuard] },
  {
    path: 'teacher-management', component: TeacherManagementComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: TeacherListComponent },
      { path: 'add', component: TeacherFormComponent },
      { path: 'teacher/:id', component: TeacherFormComponent },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'schedule-management', component: ScheduleManagementComponent, canActivate: [AuthGuard]

  },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
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
