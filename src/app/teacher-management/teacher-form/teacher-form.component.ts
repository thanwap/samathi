import { Teacher } from './../../shared/models/teacher.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit {
  mode = 'add';
  form = new FormGroup({
    id: new FormControl(''),
    prefix: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl(''),
  });
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private teacherService: TeacherService) { }

  async ngOnInit() {
    this.mode = this.activatedRoute.snapshot.data.mode;
    if (this.mode === 'edit') {
      this.activatedRoute.params.subscribe(async params => {
        const teacher = await this.teacherService.getTeacherById(params.id);
        this.form.patchValue(teacher);
      });
    }

  }

  save() {
    const teacherValue = this.form.value;
    const teacher = new Teacher(
      teacherValue.id,
      teacherValue.prefix,
      teacherValue.name,
      teacherValue.lastName,
      teacherValue.phoneNumber
    );
    if (this.mode === 'add') {
      this.teacherService.addTeacher(teacher);
    } else {
      this.teacherService.saveTeacher(teacher);
    }
    this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
  }

  cancle() {
    this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
  }

}
