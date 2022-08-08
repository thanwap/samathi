import { ISchedule, IScheduleRowData } from './../../shared/models/schedule-model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ConfirmDialogComponent } from 'src/app/shared/dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})
export class ScheduleListComponent implements OnInit {
  schedules: IScheduleRowData[] = [];
  allSchedules: IScheduleRowData[] = [];
  teachers: any[] = [];
  today = moment().startOf('day');
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
    this.allSchedules = [...this.schedules];
    if (period === 'present') {
      this.schedules = this.allSchedules.filter(x => x.startDate.startOf('day') >= this.today);
    } else {
      this.schedules = this.allSchedules;
    }
  }

  addSchedule() {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }

  editSchedule(id: string) {
    this.router.navigate(['../' + id], { relativeTo: this.route });
  }

  deleteSchedule(id: string) {
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
