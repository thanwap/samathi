import { StudentTudong } from './../../shared/models/student-tudong.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tudong-card',
  templateUrl: './tudong-card.component.html',
  styleUrls: ['./tudong-card.component.scss']
})
export class TudongCardComponent implements OnInit {
  @Input() student: StudentTudong;

  constructor() { }

  ngOnInit() {
  }

}
