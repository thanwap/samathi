import { Mentor } from './../../shared/models/mentor.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mentor-card',
  templateUrl: './mentor-card.component.html',
  styleUrls: ['./mentor-card.component.scss']
})
export class MentorCardComponent implements OnInit {
  @Input() mentor: Mentor;
  @Input() public version: Text;
  @Input() public versionDetail: Text;
  constructor() { }

  ngOnInit() {
  }

}
