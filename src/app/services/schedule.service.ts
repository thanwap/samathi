import { ScheduleItem } from './../shared/models/schedule-item.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private db: AngularFireDatabase) { }

  getScheduleByDate(date: string) {
    return new Promise<ScheduleItem[]>((resolve, reject) => {
      this.db.list<ScheduleItem>('/schedule',
        ref => ref
          .orderByChild('date').equalTo(date)).valueChanges()
        .subscribe(result => {
          resolve(result);
        });
    });
  }

  listSchedule() {
    return new Promise<ScheduleItem[]>((resolve, reject) => {
      this.db.list<ScheduleItem>('/schedule').valueChanges()
        .subscribe(result => {
          resolve(result);
        });
    });
  }

  importSchedule(schedule: ScheduleItem[]) {
    console.log(schedule);
    const itemRef = this.db.object('/schedule');
    itemRef.remove();
    itemRef.set(schedule);
  }
}
