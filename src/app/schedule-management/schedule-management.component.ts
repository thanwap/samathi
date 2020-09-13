import { TeacherService } from 'src/app/services/teacher.service';
import { ScheduleService } from './../services/schedule.service';
import { Component, OnInit } from '@angular/core';
import { ThaiDatePipe } from '../directives/thaidate.pipe';
import * as moment from 'moment';

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
    private scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    const now = moment();
    this.scheduleService.listSchedule().then(x => {
      this.scheduleList = x;
      this.scheduleList.map(y => {
        if (y.teacher) {
          y.teacher.imagePath = `./assets/img/teacher/${y.teacher.prefix}${y.teacher.name} ${y.teacher.lastName}.jpg`;
        }
        if (now.isAfter(moment(y.date), 'day')) {
          console.log('yo');
          y.dayStatus = 'previous';
        } else if (now.isSame(moment(y.date), 'day')) {
          y.dayStatus = 'today';
        } else {
          y.dayStatus = 'future';
        }

        return y;
      });

      console.log(this.scheduleList);
    });
  }
}
