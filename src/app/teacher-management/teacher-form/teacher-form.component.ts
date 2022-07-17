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
  files: File[] = [];
  teacher: Teacher = new Teacher('', '', '', '', '', '');
  form = new FormGroup({
    id: new FormControl(''),
    prefix: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
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
        this.teacher = teacher;
        console.log(teacher);
        this.form.patchValue(teacher);
      });
    }

  }

  async save() {
    if (this.form.invalid) {
      return;
    }
    const teacherValue = this.form.value;
    const teacher = new Teacher(
      teacherValue.id,
      teacherValue.prefix,
      teacherValue.firstName,
      teacherValue.lastName,
      teacherValue.phoneNumber,
    );
    if (this.mode === 'add') {
      await this.teacherService.addTeacher(teacher, this.files.length > 0 ? this.files[0] : null);
    } else {
      await this.teacherService.saveTeacher(teacher, this.files.length > 0 ? this.files[0] : null);
    }
    this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
  }

  cancle() {
    this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
  }

  onSelect(event) {
    const reader = new FileReader();
    reader.readAsDataURL(event.addedFiles[0]);
    reader.onload = () => this.teacher.imagePath = reader.result.toString()

    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
