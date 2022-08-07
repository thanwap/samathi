import { ISchedule, IScheduleRowData } from './../../shared/models/schedule-model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ScheduleService } from 'src/app/services/schedule.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { DialogScheduleComponent } from '../dialog-schedule/dialog-schedule.component';
import { ConfirmDialogComponent } from 'src/app/shared/dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})
export class ScheduleListComponent implements OnInit {
  schedules: IScheduleRowData[] = [];
  teachers: any[] = [];
  now = moment();
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
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.getSchedules();
    // this.scheduleList.map((s, index) => {
    //   return this.setSchedule(s, index);
    // });

    // this.setSchedules(period);
    this.onChanges();
  }

  onChanges(): void {
    this.searchForm.get('periodSelect').valueChanges.subscribe(async (val) => {
      await this.getSchedules();
    });
  }

  async getSchedules(): Promise<void> {
    const period = this.searchForm.get('periodSelect').value;
    this.schedules = await this.scheduleService.listScheduleWithDetail();
    // this.schedules = this.scheduleList;
    // if (period === 'present') {
    //   this.schedules = this.scheduleList.filter(x => x.dayStatus !== 'previous');
    // } else {
    //   this.schedules = this.scheduleList;
    // }
  }

  addSchedule() {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

  editSchedule(id: string) {
    this.router.navigate(['../' + id], { relativeTo: this.route });
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

  deleteSchedule(id: string) {
    console.log('abc');
    this.openConfirmDialog(async () => {
      await this.scheduleService.deleteSchedule(id);
      await this.getSchedules();
    });
  }

  openConfirmDialog(callback: () => Promise<void>): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: null
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && callback) {
        await callback();
      }
    });
  }

}
