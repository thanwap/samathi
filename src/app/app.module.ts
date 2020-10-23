import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';

import { ImageCropperModule } from 'ngx-image-cropper';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeacherPlateComponent } from './teacher-plate/teacher-plate.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TeacherPlateFormComponent } from './teacher-plate/teacher-plate-form/teacher-plate-form.component';
import { TeacherPlateItemComponent } from './teacher-plate/teacher-plate-item/teacher-plate-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { ThaiDatePipe } from './directives/thaidate.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ScheduleManagementComponent } from './schedule-management/schedule-management.component';
import { TeacherManagementComponent } from './teacher-management/teacher-management.component';
import { HttpClientModule } from '@angular/common/http';
import { UploadComponent } from './upload/upload.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogScheduleComponent } from './schedule-management/dialog-schedule/dialog-schedule.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StudentPlateComponent } from './student-plate/student-plate.component';
import { StudentItemComponent } from './student-plate/student-item/student-item.component';
import { NgxPrintModule } from 'ngx-print';
import { StudenCardComponent } from './student-plate/studen-card/studen-card.component';
import { LoginComponent } from './login/login.component';
import { MatCard, MatCardModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    TeacherPlateComponent,
    TeacherPlateFormComponent,
    TeacherPlateItemComponent,
    ThaiDatePipe,
    ScheduleManagementComponent,
    TeacherManagementComponent,
    UploadComponent,
    DialogScheduleComponent,
    StudentPlateComponent,
    StudentItemComponent,
    StudenCardComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCardModule,
    DragDropModule,
    MatIconModule,
    ImageCropperModule,
    NgxPrintModule
  ],
  entryComponents: [
    DialogScheduleComponent
  ],
  providers: [ThaiDatePipe, { provide: BUCKET, useValue: 'gs://samathi-f1b98.appspot.com' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
