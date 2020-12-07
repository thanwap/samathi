import { StudentTudong } from './../shared/models/student-tudong.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Student } from '../shared/models/student.model';

@Component({
  selector: 'app-tudong-plate',
  templateUrl: './tudong-plate.component.html',
  styleUrls: ['./tudong-plate.component.scss']
})
export class TudongPlateComponent implements OnInit {
  students = [];

  constructor() { }

  ngOnInit() {
    this.onAddStudent();
    console.log(this.students);
  }

  onAddStudent() {
    this.students.push(new StudentTudong());
  }

  onPrintStudents() {
    console.log(this.students);
  }
}
