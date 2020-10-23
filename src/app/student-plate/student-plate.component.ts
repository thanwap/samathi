import { Student } from './../shared/models/student.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-student-plate',
  templateUrl: './student-plate.component.html',
  styleUrls: ['./student-plate.component.scss']
})
export class StudentPlateComponent implements OnInit {
  students = [];
  version = 'รุ่นที่ 47 Mock';
  form = new FormGroup({
    version: new FormControl()
  });

  constructor() { }

  ngOnInit() {
    this.onAddStudent();
    console.log(this.students);
  }

  onAddStudent() {
    console.log('s');
    this.students.push(new Student());
  }

  onPrintStudents() {
    console.log(this.students);
  }

}
