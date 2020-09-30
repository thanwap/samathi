import { TeacherService } from './../services/teacher.service';
import { ScheduleService } from './../services/schedule.service';
import { Component, OnInit } from '@angular/core';
import { ThaiDatePipe } from '../directives/thaidate.pipe';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogScheduleComponent } from './dialog-schedule/dialog-schedule.component';

@Component({
  selector: 'app-schedule-management',
  templateUrl: './schedule-management.component.html',
  styleUrls: ['./schedule-management.component.scss']
})
export class ScheduleManagementComponent implements OnInit {
  public schedules: any[] = [];
  public teachers: any[] = [];
  public scheduleList: any[] = [];
  private now = moment();
  displayedColumns: string[] = ['date', 'chapterName', 'teacherName', 'teacherImage', 'actions'];
  searchForm = new FormGroup({
    periodSelect: new FormControl('present'),
  });
  periods = [
    { value: 'present', viewValue: 'ปัจจุบัน' },
    { value: 'all', viewValue: 'ทั้งหมด' }
  ];

  selectedPeriod: string;

  constructor(
    private scheduleService: ScheduleService,
    private teacherService: TeacherService,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    const period = this.searchForm.get('periodSelect').value;
    this.scheduleList = await this.scheduleService.listSchedule();
    this.teachers = await this.teacherService.getTeachers();
    this.scheduleList.map((s, index) => {
      return this.setSchedule(s, index);
    });

    this.setSchedules(period);
    this.onChanges();
  }

  onChanges(): void {
    this.searchForm.get('periodSelect').valueChanges.subscribe((val) => {
      this.setSchedules(val);
    });
  }

  setSchedules(period: string): void {
    if (period === 'present') {
      this.schedules = this.scheduleList.filter(x => x.dayStatus !== 'previous');
    } else {
      this.schedules = this.scheduleList;
    }
  }

  editSchedule(id: any) {
    this.dialog.open(DialogScheduleComponent, {
      width: '80%',
      data: {
        teachers: this.teachers,
        id
      }
    });
  }

  setSchedule(schedule: any, index: number) {
    if (schedule.teacher) {
      schedule.teacher.imagePath = `./assets/img/teacher/${schedule.teacher.prefix}${schedule.teacher.name} ${schedule.teacher.lastName}.jpg`;
    }
    if (!schedule.teacher || schedule.teacher.id === '0') {
      schedule.dayStatus = 'live';
    } else if (this.now.isAfter(moment(schedule.date), 'day')) {
      schedule.dayStatus = 'previous';
    } else if (this.now.isSame(moment(schedule.date), 'day')) {
      schedule.dayStatus = 'today';
    } else {
      schedule.dayStatus = 'future';
    }

    schedule.id = index;
    return schedule;
  }
}
