import { Chapter, IChapter } from './../../shared/models/chapter.model';
import { map, startWith } from 'rxjs/operators';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchedule } from 'src/app/shared/models/schedule-model';
import { Observable } from 'rxjs';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { TeacherService } from 'src/app/services/teacher.service';
import { ChapterService } from 'src/app/services/chapter.service';
import * as moment from 'moment';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss']
})
export class ScheduleFormComponent implements OnInit {
  mode: string = 'add';
  chapterOptions: IChapter[] = [];
  teacherOptions: Teacher[] = []
  filteredChapterOptions: Observable<IChapter[]>;
  filteredTeacherOptions: Observable<Teacher[]>;
  form = new FormGroup({
    id: new FormControl(''),
    date: new FormControl('', [Validators.required]),
    start: new FormControl('', [Validators.required]),
    finish: new FormControl('', [Validators.required]),
    chapter: new FormControl(null, [Validators.required]),
    teacher: new FormControl(null, [Validators.required]),
  });
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private scheduleService: ScheduleService,
    private teacherService: TeacherService,
    private chapterService: ChapterService,) { }

  async ngOnInit() {
    this.mode = this.activatedRoute.snapshot.data.mode;

    this.chapterOptions = await this.chapterService.getChapters();
    this.teacherOptions = await this.teacherService.getTeachers();
    console.log(this.chapterOptions);
    console.log(this.teacherOptions);


    const chapterControl = this.form.get('chapter');
    const teacherControl = this.form.get('teacher');

    this.filteredChapterOptions = chapterControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => value ? this._filterChapter(value) : this.chapterOptions.slice())
    );

    this.filteredTeacherOptions = teacherControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => value ? this._filterTeacher(value) : this.teacherOptions.slice())
    );

    if (this.mode === 'edit') {
      this.activatedRoute.params.subscribe(async params => {
        const schedule = await this.scheduleService.getScheduleById(params.id);
        console.log(schedule);
        this.form.patchValue({
          id: params.id,
          date: new Date(schedule.start),
          start: moment(schedule.start).format("LT"),
          finish: moment(schedule.finish).format("LT"),
          chapter: this.chapterOptions.find(x => x.id === schedule.chapterId),
          teacher: this.teacherOptions.find(x => x.id === schedule.teacherId)
        });
      });
    }
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

  async save() {
    if (this.form.invalid) {
      return;
    }
    const formValue = this.form.value;

    const schedule: ISchedule = {
      id: formValue.id,
      teacherId: formValue.teacher.id,
      chapterId: formValue.chapter.id,
      start: moment(`${formValue.date.toLocaleDateString()} ${formValue.start}`, 'M/D/YYYY LT').toLocaleString(),
      finish: moment(`${formValue.date.toLocaleDateString()} ${formValue.finish}`, 'M/D/YYYY LT').toLocaleString(),
    }

    if (this.mode === 'add') {
      await this.scheduleService.addSchedule(schedule);
    } else {
      await this.scheduleService.updateSchedule(schedule);
    }

    this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
  }

  cancel() {
    this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
  }

}
