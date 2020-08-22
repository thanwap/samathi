import { TeacherService } from 'src/app/services/teacher.service';
import { ScheduleService } from './../services/schedule.service';
import { Component, OnInit } from '@angular/core';
import { ThaiDatePipe } from '../directives/thaidate.pipe';
import { ScheduleItem } from '../shared/models/schedule-item.model';
import { Chapter } from '../shared/models/chapter.model';
import { Teacher } from '../shared/models/teacher.model';

@Component({
  selector: 'app-schedule-management',
  templateUrl: './schedule-management.component.html',
  styleUrls: ['./schedule-management.component.scss']
})
export class ScheduleManagementComponent implements OnInit {
  public schedules: any[] = [];
  public scheduleList: any[] = [];
  displayedColumns: string[] = ['date', 'chapterName', 'teacherName', 'teacherImage'];

  constructor(
    private thaiDatePipe: ThaiDatePipe,
    private teacherService: TeacherService,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    this.scheduleService.listSchedule().then(x => {
      this.scheduleList = x;
      this.scheduleList.map(y => {
        y.teacher.imagePath = `./assets/img/teacher/${y.teacher.prefix}${y.teacher.name} ${y.teacher.lastName}.jpg`;
        return y;
      });
      console.log(this.scheduleList);
    });
    // this.teacherService.getTeachers().then(x => console.log(x));
    // this.scheduleService.listSchedule().then((schedule) => {
    //   if (schedule && schedule.length > 0) {
    //   }
    // });
  }

  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;

    if (this.isCSVFile(files[0])) {
      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = (data) => {
        const csvData = reader.result;
        const csvRecordsArray = (csvData as string).split(/\r\n|\n/);

        this.teacherService.getTeachers().then(teachers => {
          this.schedules = this.getSchedulesFromCSVFile(csvRecordsArray, teachers);
          console.log('start');
          this.scheduleService.importSchedule(this.schedules);
        });
      };

      reader.onerror = () => {
        alert('Unable to read ' + input.files[0]);
      };
    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  getSchedulesFromCSVFile(rows: any, teachers: Teacher[]): ScheduleItem[] {
    const schedules = [];

    let teacherDic = teachers.reduce((obj, t) => {
      obj[t.fullName] = t;
      return obj;
    }, {});

    for (let i = 4; i < rows.length; i++) {
      const data = rows[i].split(',');

      if (data.length <= 1) {
        return schedules;
      }

      let chapter = new Chapter(data[3].trim(), data[4].trim());
      let teacher = new Teacher('', data[5].trim(), data[6].trim(), data[7].trim(), data[8].trim());

      if (!teacherDic[teacher.fullName]) {
        teacher.id = teacherDic[teacher.fullName].id;
      }

      schedules.push(new ScheduleItem(
        data[1].trim(),
        data[2].trim(),
        chapter,
        teacher
      ));
    }

    return schedules;
  }

  isCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  fileReset() {

  }

}
