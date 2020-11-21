import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Teacher } from '../shared/models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private db: AngularFireDatabase) { }

  getTeachers(): Promise<Teacher[]> {
    return new Promise<Teacher[]>((resolve, reject) => {
      this.db.list('/teacher')
        .snapshotChanges()
        .subscribe(result => {
          resolve(result.map(action => {
            const val = action.payload.val();
            return new Teacher(
              action['key'],
              val['prefix'],
              val['name'],
              val['lastName'],
              val['phoneNumber']);
          }));
        });
    });
  }

  findTeachers(name: string, lastName: string) {
    return new Promise((resolve, reject) => {
      this.db.list('/teacher',
        ref => ref.orderByChild('name')
          .startAt(name)
          .endAt(name + '\uf8ff')
      )
        .snapshotChanges()
        .subscribe(result => {
          resolve(result.map(action => {
            const val = action.payload.val();
            return new Teacher(
              action['key'],
              val['prefix'],
              val['name'],
              val['lastName'],
              val['phoneNumber']);
          }));
        });
    });
  }

  addTeacher(teacher: Teacher): Promise<number> {
    const teacherItem = {
      prefix: teacher.prefix,
      name: teacher.name,
      lastName: teacher.lastName,
      phoneNumber: teacher.phoneNumber
    };

    return new Promise<number>((resolve, reject) => {
      const itemRef = this.db.list('teacher_temp');

      itemRef.push(teacherItem).then((t) => {
        resolve(0);
      });
    });
  }

  addTeachers(teachers: any) {
    console.log(teachers);
    return new Promise<number>((resolve, reject) => {
      let teacherItems = teachers.map((t) => {
        return {
          prefix: t.prefix,
          name: t.name,
          lastName: t.lastName,
          phoneNumber: t.phoneNumber
        };
      });

      const itemRef = this.db.object('teacher_temp');
      itemRef.set(teacherItems);
    });

  }
}
