import { Student } from './../../shared/models/student.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-studen-card',
  templateUrl: './studen-card.component.html',
  styleUrls: ['./studen-card.component.scss']
})
export class StudenCardComponent implements OnInit {
  @Input() student: Student;
  @Input() public version: Text;

  constructor() { }

  ngOnInit() {
  }

}
