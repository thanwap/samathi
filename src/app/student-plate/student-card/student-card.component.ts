import { Student } from '../../shared/models/student.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-student-card',
  templateUrl: './student-card.component.html',
  styleUrls: ['./student-card.component.scss']
})
export class StudentCardComponent implements OnInit {
  @Input() student: Student;
  @Input() public version: Text;

  constructor() { }

  ngOnInit() {
  }

}
