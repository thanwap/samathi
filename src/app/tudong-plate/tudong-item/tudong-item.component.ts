import { StudentTudong } from './../../shared/models/student-tudong.model';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tudong-item',
  templateUrl: './tudong-item.component.html',
  styleUrls: ['./tudong-item.component.scss']
})
export class TudongItemComponent implements OnInit {
  @Input() student: StudentTudong;
  @Input() public index: number;
  imageChangedEvent: any;

  form = new FormGroup({
    fullname: new FormControl(''),
    branch: new FormControl(''),
    fileControl: new FormControl('')
  });

  constructor() { }

  ngOnInit() {
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
