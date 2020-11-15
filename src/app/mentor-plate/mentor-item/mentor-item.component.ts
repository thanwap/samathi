import { Mentor } from './../../shared/models/mentor.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mentor-item',
  templateUrl: './mentor-item.component.html',
  styleUrls: ['./mentor-item.component.scss']
})
export class MentorItemComponent implements OnInit {

  @Input() mentor: Mentor;
  @Input() public version: Text;
  @Input() public versionDetail: Text;
  @Input() public index: number;

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    nickName: new FormControl('')
  });


  constructor() { }

  ngOnInit() {

  }
}
