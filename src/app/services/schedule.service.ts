import { ScheduleItem } from './../shared/models/schedule-item.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {


  constructor(private db: AngularFireDatabase) { }

  getScheduleById(id: number) {
    this.db.object('schedule_temp/' + id).valueChanges()
      .subscribe(x => {
        console.log(x);
      });
  }

  getScheduleByDate(date: string) {
    return new Promise<ScheduleItem[]>((resolve, reject) => {
      this.db.list<ScheduleItem>('/schedule_temp',
        ref => ref
          .orderByChild('date').equalTo(date)).valueChanges()
        .subscribe(result => {
          resolve(result);
        });
    });
  }

  listSchedule() {
    return new Promise<ScheduleItem[]>((resolve, reject) => {
      this.db.list<ScheduleItem>('/schedule_temp').snapshotChanges().subscribe(action => {
        let result: ScheduleItem[] = [];
        action.forEach((x) => {
          let item = <ScheduleItem>x.payload.val();
          item.id = x.key;
          result.push(item);
        });
        resolve(result);
      });
      // this.db.list<ScheduleItem>('/schedule_temp').valueChanges()
      //   .subscribe(result => {
      //     console.log('result', result);
      //     resolve(result);
      //   });
    });
  }

  importSchedule(schedule: ScheduleItem[]) {
    const itemRef = this.db.object('/schedule_temp');
    itemRef.set(schedule);
  }

  updateSchedule(schedule: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.object('schedule_temp/' + schedule.id).set(schedule).then(() => {
        resolve();
      }).catch(error => { reject(error); });
    });
  }
}
