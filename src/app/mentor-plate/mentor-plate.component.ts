import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Mentor } from '../shared/models/mentor.model';

@Component({
  selector: 'app-mentor-plate',
  templateUrl: './mentor-plate.component.html',
  styleUrls: ['./mentor-plate.component.scss']
})
export class MentorPlateComponent implements OnInit {

  mentors = [];
  version = '๔๗';
  versionDetail = 'ชื่อรุ่น';
  form = new FormGroup({
    version: new FormControl(),
    versionDetail: new FormControl()
  });

  constructor() { }

  ngOnInit() {
    this.onAddMentor();
  }

  onAddMentor() {
    this.mentors.push(new Mentor());
  }

  onPrintStudents() {
  }

}
