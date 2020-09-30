import { TeacherService } from './../services/teacher.service';
import { Component, OnInit } from '@angular/core';
import { Teacher } from '../shared/models/teacher.model';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-teacher-management',
  templateUrl: './teacher-management.component.html',
  styleUrls: ['./teacher-management.component.scss']
})
export class TeacherManagementComponent implements OnInit {

  teachers: any;

  constructor(private teacherService: TeacherService) { }
  async ngOnInit() {
    this.teachers = await this.teacherService.getTeachers();

    console.log(this.teachers);
  }

}
