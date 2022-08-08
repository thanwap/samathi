import { startWith } from 'rxjs/operators';
import { ScheduleItem } from './../shared/models/schedule-item.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { resolve } from 'url';
import { ISchedule, IScheduleRowData } from '../shared/models/schedule-model';
import { LoadingService } from '../loading.service';
import { Teacher } from '../shared/models/teacher.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {


  constructor(private loadingService: LoadingService, private db: AngularFireDatabase) { }

  getScheduleById(id: number): Promise<ISchedule> {
    return new Promise<ISchedule>((resolve) => {
      this.loadingService.setLoading();
      this.db.object('schedule/' + id).snapshotChanges()
      .subscribe((action: SnapshotAction<ISchedule>) => {
        const val = action.payload.val();
        this.loadingService.setLoadingFinish();
        resolve({ ...val, id: action.key });
      });
    });

  }

  getScheduleByDate(date: string) {
    return new Promise<ISchedule[]>((resolve) => {
      this.db.list<ISchedule>('/schedule',
        ref => ref
          .orderByChild('start').startAt(date).limitToFirst(1)).valueChanges()
        .subscribe(result => {
          resolve(result);
        });
    });
  }

  listSchedule() {
    return new Promise<ISchedule[]>((resolve) => {
      this.db.list<ISchedule>('/schedule').snapshotChanges().subscribe(action => {
        let result: ISchedule[] = [];
        action.forEach((x) => {
          let item = <ISchedule>x.payload.val();
          item.id = x.key;
          result.push(item);
        });
        resolve(result);
      });
    });
  }

  listScheduleWithDetail(): Promise<IScheduleRowData[]> {
    return new Promise<IScheduleRowData[]>((resolve) => {
      const rootRef = this.db.database.ref();
      const teachersRef = rootRef.child('teacher');
      const chaptersRef = rootRef.child('chapter');

      this.db.list<IScheduleRowData>('/schedule').snapshotChanges().subscribe(action => {
        let result: IScheduleRowData[] = [];
        action.forEach((x) => {
          let item = <IScheduleRowData>x.payload.val();
          item.id = x.key;

          const teacherRef = teachersRef.child(item.teacherId);
          teacherRef.once('value', (snap) => {
            const teacherSnap = snap.val();
            const teacher = new Teacher(item.teacherId, teacherSnap.prefix, teacherSnap.firstName, teacherSnap.lastName, teacherSnap.phoneNumber, teacherSnap.imagePath);
            item.teacherName = teacher.fullName;
            item.teacherImage = teacher.imagePath;
          });

          const chapterRef = chaptersRef.child(item.chapterId);
          chapterRef.once('value', (snap) => {
            const chapterSnap = snap.val();
            item.chapterName = chapterSnap.name;
          });

          item.startDate = moment(item.start);
          item.finishDate = moment(item.finish);

          result.push(item);
        });
        result = result.sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime())
        resolve(result);
      });
    });
  }

  importSchedule(schedule: ScheduleItem[]) {
    const itemRef = this.db.object('/schedule_temp');
    itemRef.set(schedule);
  }

  addSchedule(schedule: ISchedule): Promise<string> {
    this.loadingService.setLoading();
    const scheduleItem = {
      teacherId: schedule.teacherId,
      chapterId: schedule.chapterId,
      start: schedule.start,
      finish: schedule.finish,
    }

    return new Promise<string>(async (resolve) => {
      const itemRef = this.db.list('schedule');

      itemRef.push(scheduleItem).then(async (t) => {
        const id = t.key;
        resolve(id);
        this.loadingService.setLoadingFinish();
      });
    });
  }

  updateSchedule(schedule: ISchedule): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.loadingService.setLoading();
      const scheduleItem = {
        teacherId: schedule.teacherId,
        chapterId: schedule.chapterId,
        start: schedule.start,
        finish: schedule.finish,
      }

      this.db.object('schedule/' + schedule.id).set(scheduleItem)
        .then(() => resolve())
        .catch(error => reject(error))
        .finally(() => this.loadingService.setLoadingFinish());
    });
  }

  deleteSchedule(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.loadingService.setLoading();
      this.db.object('/schedule/' + id)
        .remove()
        .then(() => {
          resolve();
        }).finally(() => this.loadingService.setLoadingFinish());
    });
  }
}
