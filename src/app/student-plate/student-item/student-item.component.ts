import { Student } from './../../shared/models/student.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-student-item',
  templateUrl: './student-item.component.html',
  styleUrls: ['./student-item.component.scss']
})
export class StudentItemComponent implements OnInit {
  @Input() student: Student;
  @Input() public version: Text;
  @Input() public index: number;
  imageChangedEvent: any;

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    nameEn: new FormControl(''),
  });

  constructor() { }

  ngOnInit() {
    console.log(this.index);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.student.image = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

}
