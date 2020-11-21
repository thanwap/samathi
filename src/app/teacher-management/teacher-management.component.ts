import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-teacher-management',
  templateUrl: './teacher-management.component.html',
  styleUrls: ['./teacher-management.component.scss']
})
export class TeacherManagementComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl(''),
    nickName: new FormControl('')
  });

  constructor() { }
  ngOnInit() {

  }



}
