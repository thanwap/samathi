import { TudongItemComponent } from './tudong-plate/tudong-item/tudong-item.component';
import { TeacherListComponent } from './teacher-management/teacher-list/teacher-list.component';
import { TeacherFormComponent } from './teacher-management/teacher-form/teacher-form.component';
import { MentorPlateComponent } from './mentor-plate/mentor-plate.component';
import { LoginComponent } from './login/login.component';
import { UploadComponent } from './upload/upload.component';
import { ScheduleManagementComponent } from './schedule-management/schedule-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherPlateComponent } from './teacher-plate/teacher-plate.component';
import { TeacherPlate2Component } from './teacher-plate-2/teacher-plate-2.component';
import { TeacherPlate3Component } from './teacher-plate-3/teacher-plate-3.component';
import { TeacherManagementComponent } from './teacher-management/teacher-management.component';
import { StudentPlateComponent } from './student-plate/student-plate.component';

import { AuthGuard } from './guards/auth.guard';
import { TudongPlateComponent } from './tudong-plate/tudong-plate.component';
import { ScheduleListComponent } from './schedule-management/schedule-list/schedule-list.component';
import { ScheduleFormComponent } from './schedule-management/schedule-form/schedule-form.component';


const routes: Routes = [
  { path: 'plate', component: TeacherPlateComponent, canActivate: [AuthGuard] },
  { path: 'plate2', component: TeacherPlate2Component, canActivate: [AuthGuard] },
  { path: 'plate3', component: TeacherPlate3Component, canActivate: [AuthGuard] },
  { path: 'studentPlate', component: StudentPlateComponent, canActivate: [AuthGuard] },
  { path: 'tudongPlate', component: TudongPlateComponent, canActivate: [AuthGuard] },
  { path: 'mentorPlate', component: MentorPlateComponent, canActivate: [AuthGuard] },
  {
    path: 'teacher', component: TeacherManagementComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: TeacherListComponent },
      { path: 'add', component: TeacherFormComponent, data: { mode: 'add' } },
      { path: ':id', component: TeacherFormComponent, data: { mode: 'edit' } },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'schedule', component: ScheduleManagementComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: ScheduleListComponent },
      { path: 'add', component: ScheduleFormComponent, data: { mode: 'add' } },
      { path: ':id', component: ScheduleFormComponent, data: { mode: 'edit' } },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
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
