import { ScheduleService } from '../../services/schedule.service';
import { ChapterService } from '../../services/chapter.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { TeacherService } from 'src/app/services/teacher.service';
import { TeacherPlateService } from 'src/app/services/teacher-plate.service';
import * as moment from 'moment';
import { IChapter } from 'src/app/shared/models/chapter.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: "app-teacher-plate-form-2",
  templateUrl: "./teacher-plate-form-2.component.html",
  styleUrls: ["./teacher-plate-form-2.component.scss"],
})
export class TeacherPlateForm2Component implements OnInit {
  chapters: IChapter[];
  imageChangedEvent: any = "";
  teachers: Teacher[];
  imageBase64String: string | ArrayBuffer = "";
  chapterOptions: IChapter[] = [];
  teacherOptions: Teacher[] = []
  filteredChapterOptions: Observable<IChapter[]>;
  filteredTeacherOptions: Observable<Teacher[]>;
  teacherForm = new FormGroup({
    date: new FormControl(null),
    title: new FormControl(""),
    teacherName: new FormControl(""),
    plateWidth: new FormControl(),
    bookNumber: new FormControl(),
    chapter: new FormControl(null),
    teacher: new FormControl(null),
  });

  constructor(
    private teacherService: TeacherService,
    private chapterService: ChapterService,
    private scheduleService: ScheduleService,
    private teacherPlateService: TeacherPlateService
  ) { }

  async ngOnInit() {
    const chapters = await this.chapterService.getChapters();
    const teachers = await this.teacherService.getTeachers();
    this.chapterOptions = chapters;
    this.teacherOptions = teachers;
    this.chapters = chapters;
    this.teachers = teachers;

    let plateInfo = this.teacherPlateService.getPlateInfo();

    const chapterControl = this.teacherForm.get('chapter');
    const teacherControl = this.teacherForm.get('teacher');

    this.filteredChapterOptions = chapterControl.valueChanges
    .pipe(
      startWith(''),
      map((value: string | IChapter) => typeof value === 'string' ? value : value.name),
      map((value: string) => value ? this._filterChapter(value) : this.chapterOptions.slice())
    );

    this.filteredTeacherOptions = teacherControl.valueChanges
    .pipe(
      startWith(''),
      map((value: string | Teacher) => typeof value === 'string' ? value : value.fullName),
      map((value: string) => value ? this._filterTeacher(value) : this.teacherOptions.slice())
    );

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

    this.teacherForm.get('teacher').valueChanges.subscribe(async (val: Teacher | string) => {
      if (typeof val === 'string') {
        return;
      }
      this.teacherForm.patchValue({ teacherName: val.fullName });

      const base64 = val.imagePath ? await this.getBase64ImageFromUrl(val.imagePath) : '';
      if (!base64) {
        this.teacherPlateService.setImage('');
      }
      this.imageBase64String = base64;
    });

    this.teacherForm.get('chapter').valueChanges.subscribe((val: IChapter | string) => {
      if (typeof val === 'string') {
        return;
      }
      const chapterName = val.name;
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

  private _filterChapter(value: string): IChapter[] {
    const filterValue = value.toLowerCase();

    return this.chapterOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private _filterTeacher(value: string): Teacher[] {
    const filterValue = value.toLowerCase();

    return this.teacherOptions.filter(option => option.fullName.toLowerCase().includes(filterValue));
  }

  displayChapterFn(chapter: IChapter): string {
    return chapter && chapter.name ? chapter.name : '';
  }

  displayTeacherFn(teacher: Teacher): string {
    return teacher && teacher.fullName ? teacher.fullName : '';
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
    const date = moment(this.teacherForm.get('date').value).format("ddd MMM DD YYYY");
    this.scheduleService
      .getScheduleByDate(date)
      .then((schedules) => {
        if (schedules && schedules.length > 0) {
          const schedule = schedules[0];
          const chapter = this.chapters.find(x => x.id === schedule.chapterId);
          const teacher = this.teachers.find(x => x.id === schedule.teacherId);
          this.teacherForm.patchValue({
            title: chapter ? chapter.name : '',
            teacherName: teacher ? teacher.fullName : '',
            bookNumber: chapter ? chapter.bookNo : 1
          });
          if (teacher) {
            this.getBase64ImageFromUrl(
              teacher.imagePath
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
