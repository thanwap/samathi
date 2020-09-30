import { ScheduleService } from './../../services/schedule.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-schedule',
  templateUrl: './dialog-schedule.component.html',
  styleUrls: ['./dialog-schedule.component.scss']
})
export class DialogScheduleComponent implements OnInit {
  filteredOptions: Observable<string[]>;
  teachers = [];

  scheduleForm = new FormGroup({
    teacherFilter: new FormControl(),
    teacherSelect: new FormControl()
  });

  myControl = new FormControl();

  constructor(
    private scheduleService: ScheduleService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.scheduleService.getScheduleById(this.data.id);
    this.teachers = this.data.teachers;

    this.scheduleForm.get('teacherFilter').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.fullName),
        map(value => this._filter(value))
      ).subscribe();
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    this.teachers = this.data.teachers.filter(option => option.fullName.toLowerCase().includes(filterValue));
  }

  displayFn(teacher?: any): string | undefined {
    return teacher ? teacher.fullName : undefined
  }

}
