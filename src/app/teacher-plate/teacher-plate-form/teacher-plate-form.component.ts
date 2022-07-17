import { ScheduleService } from './../../services/schedule.service';
import { ChapterService } from '../../services/chapter.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { TeacherService } from 'src/app/services/teacher.service';
import { TeacherPlateService } from 'src/app/services/teacher-plate.service';
import * as moment from 'moment';
import { IChapter } from 'src/app/shared/models/chapter.model';

@Component({
  selector: "app-teacher-plate-form",
  templateUrl: "./teacher-plate-form.component.html",
  styleUrls: ["./teacher-plate-form.component.scss"],
})
export class TeacherPlateFormComponent implements OnInit {
  chapters: IChapter[];
  imageChangedEvent: any = "";
  teachers: Teacher[];
  imageBase64String: string | ArrayBuffer = "";
  teacherForm = new FormGroup({
    date: new FormControl(null),
    titleSelect: new FormControl(""),
    title: new FormControl(""),
    teacherNameSelect: new FormControl(""),
    teacherName: new FormControl(""),
    plateWidth: new FormControl(),
    bookNumber: new FormControl(),
  });

  constructor(
    private teacherService: TeacherService,
    private chapterService: ChapterService,
    private scheduleService: ScheduleService,
    private teacherPlateService: TeacherPlateService
  ) { }

  ngOnInit() {
    this.chapterService.getChapters().then((result) => {
      this.chapters = result;
    });

    this.teacherService.getTeachers().then((result) => {
      this.teachers = result;
    });

    let plateInfo = this.teacherPlateService.getPlateInfo();

    this.teacherForm.patchValue({
      date: plateInfo.date,
      title: plateInfo.title,
      teacherName: plateInfo.teacherName,
      plateWidth: plateInfo.plateWidth,
      bookNumber: plateInfo.bookNumber,
    });

    this.onChanges();
    this.loadSchedule();
  }

  onChanges(): void {
    this.teacherForm.valueChanges.subscribe((val) => {
      this.teacherPlateService.setDate(val.date);
      this.teacherPlateService.setTile(val.title);
      this.teacherPlateService.setTeacherName(val.teacherName);
      this.teacherPlateService.setPlateWidth(val.plateWidth);
      this.teacherPlateService.setBookNumber(val.bookNumber);
    });

    this.teacherForm.get('date').valueChanges.subscribe((val) => {
      this.loadSchedule();
    });

    this.teacherForm.get('teacherNameSelect').valueChanges.subscribe(async (val) => {
      const teacher = this.teachers.find(x => x.id === val);
      if (!teacher) {
        return
      }
      this.teacherForm.patchValue({ teacherName: teacher.fullName });

      const base64 = teacher.imagePath ? await this.getBase64ImageFromUrl(teacher.imagePath) : '';
      if (!base64) {
        this.teacherPlateService.setImage('');
      }
      this.imageBase64String = base64;
    });

    this.teacherForm.get('titleSelect').valueChanges.subscribe((key: string) => {
      const chapter = this.chapters.find(x => x.id === key);
      const chapterName = chapter ? chapter.name : '';
      this.teacherForm.patchValue({ title:  chapterName});

      if (chapterName.length) {
        let firstLetter = chapterName[0];

        if (Number(firstLetter)) {
          this.teacherPlateService.setBookNumber(+firstLetter);
          this.teacherForm.patchValue({ bookNumber: firstLetter });
        }
      }
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
    };
  }

  loadSchedule() {
    this.scheduleService
      .getScheduleByDate(moment(this.teacherForm.get('date').value).format("ddd DD MMM YY"))
      .then((schedules) => {
        if (schedules && schedules.length > 0) {
          let s = schedules[0];
          this.teacherForm.patchValue({
            title: s.chapter ? s.chapter.name : '',
            teacherName: s.teacher ? s.teacher.fullName : '',
            bookNumber: s.chapter ? + s.chapter.name.substring(0, 1) : 1
          });
          if (s.teacher && s.teacher.fullName) {
            let teacher = new Teacher(
              '',
              s.teacher.prefix,
              s.teacher.firstName,
              s.teacher.lastName
            );
            this.getBase64ImageFromUrl(
              `./assets/img/teacher/${teacher.fullNameForPicture}.jpg`
            ).then((x) => {
              this.imageBase64String = x;
            });
          }
        }
      });
  }

  async getBase64ImageFromUrl(imageUrl: string): Promise<string | ArrayBuffer> {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise<string | ArrayBuffer> ((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }
}
