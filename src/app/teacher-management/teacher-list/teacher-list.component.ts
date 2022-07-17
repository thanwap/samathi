import { ConfirmDialogComponent } from './../../shared/dialog/confirm-dialog/confirm-dialog.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {
  public teachers: any;
  public displayedColumns: string[] = ['index', 'fullName', 'phoneNumber', 'actions'];

  form = new FormGroup({
    firstName: new FormControl('')
  });
  constructor(
    public dialog: MatDialog,
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router) { }

  async ngOnInit() {
    this.teachers = await this.teacherService.getTeachers();

  }

  async find() {
    this.teachers = await this.teacherService.findTeachers(this.form.get('firstName').value);
  }

  addTeacher() {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

  editTeacher(id: string) {
    this.router.navigate(['../' + id], { relativeTo: this.route });
  }

  deleteTeacher(id: string) {
    this.openConfirmDialog(async () => {
      await this.teacherService.deleteTeacher(id);
      await this.find();
    });
  }

  openConfirmDialog(callback: () => Promise<void>): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: null
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && callback) {
        await callback();
      }
    });
  }

}
