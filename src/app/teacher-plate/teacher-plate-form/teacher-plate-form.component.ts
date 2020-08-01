import { ChapterService } from '../../services/chapter.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { TeacherService } from 'src/app/services/teacher.service';
import { TeacherPlateService } from 'src/app/services/teacher-plate.service';

@Component({
  selector: 'app-teacher-plate-form',
  templateUrl: './teacher-plate-form.component.html',
  styleUrls: ['./teacher-plate-form.component.scss']
})
export class TeacherPlateFormComponent implements OnInit {
  chapters: any;
  imageChangedEvent: any = '';
  teachers: Teacher[];
  teacherForm = new FormGroup({
    date: new FormControl(null),
    titleSelect: new FormControl(''),
    title: new FormControl(''),
    teacherNameSelect: new FormControl(''),
    teacherName: new FormControl(''),
    plateWidth: new FormControl(),
    bookNumber: new FormControl()
  });

  constructor(
    private teacherService: TeacherService,
    private chapterService: ChapterService,
    private teacherPlateService: TeacherPlateService) { }

  ngOnInit() {
    this.chapterService.getChapters()
      .then(result => {
        this.chapters = result;
      });

    this.teacherService.getTeachers()
      .then(result => {
        this.teachers = result;
      });

    let plateInfo = this.teacherPlateService.getPlateInfo();

    this.teacherForm.patchValue({
      date: plateInfo.date,
      title: plateInfo.title,
      teacherName: plateInfo.teacherName,
      plateWidth: plateInfo.plateWidth,
      bookNumber: plateInfo.bookNumber
    });

    this.onChanges();
  }

  onChanges(): void {
    this.teacherForm.valueChanges.subscribe(val => {
      this.teacherPlateService.setDate(val.date);
      this.teacherPlateService.setTile(val.title);
      this.teacherPlateService.setTeacherName(val.teacherName);
      this.teacherPlateService.setPlateWidth(val.plateWidth);
      this.teacherPlateService.setBookNumber(val.bookNumber);
    });

    this.teacherForm
      .get('titleSelect')
      .valueChanges
      .subscribe(val => {
        this.teacherForm.patchValue({ title: val });

        if(val.length > 0){
          let firstLetter = val[0];

          if(Number(firstLetter)){
            this.teacherPlateService.setBookNumber(+firstLetter);
            this.teacherForm.patchValue({ bookNumber: firstLetter });
          }
        }

      });

      this.teacherForm
      .get('teacherNameSelect')
      .valueChanges
      .subscribe(val => {
        this.teacherForm.patchValue({ teacherName: val });

      });
  }



    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.teacherPlateService.setImage(event.base64);
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

  readURL(fileInput: any): void {
    let fileData = <File>fileInput.target.files[0];
    var mimeType = fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(fileData);
    reader.onload = (_event) => {
      this.teacherPlateService.setImage(reader.result);
    }
}

}
