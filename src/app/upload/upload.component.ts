import { LoadingService } from './../loading.service';
import { Teacher } from './../shared/models/teacher.model';
import { Component, OnInit } from '@angular/core';
import { ScheduleItem } from '../shared/models/schedule-item.model';
import { Chapter } from '../shared/models/chapter.model';
import { ThaiDatePipe } from '../directives/thaidate.pipe';
import { TeacherService } from '../services/teacher.service';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  public schedules: any[] = [];

  constructor(
    private thaiDatePipe: ThaiDatePipe,
    private teacherService: TeacherService,
    private scheduleService: ScheduleService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() { }

  async fileChangeListener($event: any): Promise<void> {
    const files = $event.srcElement.files;

    let teacherList = await this.teacherService.getTeachers();
    let scheduleList = await this.scheduleService.listSchedule();

    if (this.isCSVFile(files[0])) {
      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = async (data) => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);

        this.schedules = this.getSchedulesFromCSVFile(csvRecordsArray);
        console.log(this.schedules);
        let teachers = this.schedules
          .map((x) => {
            let teacher = Object.assign({}, x.teacher);
            delete teacher.id;
            return teacher;
          })
          .filter((x) => x.prefix !== '');

        teachers = this.distinctTeacher(teachers);
        this.teacherService.addTeachers(
          teachers.filter((x) => !teacherList.includes(x.fullName))
        );
        teachers = await this.teacherService.getTeachers();
        this.schedules.forEach((s) => {
          s.teacher =
            teachers.find((x) => x.fullName === s.teacher.fullName) || null;
        });
        let s = [...scheduleList].concat(this.schedules);
        s = this.distinctSchedule(s);
        // this.scheduleService.importSchedule(s);
      };

      reader.onerror = () => {
        alert('Unable to read ' + input.files[0]);
      };
    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  getSchedulesFromCSVFile(rows: any): ScheduleItem[] {
    const schedules = [];

    for (let i = 3; i < rows.length; i++) {
      const data = rows[i].split(',');

      if (data.length <= 1) {
        return schedules;
      }

      let chapter = new Chapter(data[3].trim(), data[4].trim());
      let teacher = new Teacher(
        '',
        data[5].trim(),
        data[6].trim(),
        data[7].trim(),
        data[8].trim()
      );

      schedules.push(
        new ScheduleItem(data[1].trim(), data[2].trim(), chapter, teacher)
      );
    }

    return schedules;
  }

  isCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  fileReset() { }

  distinctTeacher(teachers: any) {
    let result = [];
    let temp = {};

    teachers.forEach((x) => {
      if (!temp.hasOwnProperty(x.fullName)) {
        temp[x.fullName] = '';
        result.push(x);
      }
    });

    return result;
  }

  distinctSchedule(schedules: any) {
    let result = [];
    let temp = {};

    schedules.forEach((x) => {
      if (!temp.hasOwnProperty(x.date)) {
        temp[x.date] = '';
        result.push(x);
      }
    });

    return result;

  }

  async mapScheduleTeacher() {
    this.loadingService.setLoading();
    const schedules = await this.scheduleService.listSchedule();
    const teachers = await this.teacherService.getTeachers();
    const teacherDic = teachers.reduce((p, c) => ({ ...p, [c.fullName]: c }), {});

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < schedules.length; i++) {
      let schedule = schedules[i];
      // if (!schedule.teacher) { continue; }
      // const teacher = teacherDic[schedule.teacher.fullName];
      // if (!teacher) { continue; }
      // schedule.teacher.id = teacher.id;

      // await this.scheduleService.updateSchedule(schedule);
    }
    this.loadingService.setLoadingFinishMust();
  }
}
