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
          let val = action.payload.val();
          return new Teacher(
            action['key'],
            val['prefix'],
            val['name'],
            val['lastName']);
        }));
      });
    });
  }

  addTeacher(teacher: Teacher): Promise<number> {
    const teacherItem = { prefix: teacher.prefix,
      name: teacher.name,
      lastName: teacher.lastName,
      phoneNumber: teacher.phoneNumber
    };

    return new Promise<number>((resolve, reject) => {
      const itemRef = this.db.list('teacher');

      itemRef.push(teacherItem).then((t) => {
        resolve(0);
      });
    });
  }

  addTeachers(teachers: Teacher[]): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      let teacherItems = teachers.map((t) => {
        return { prefix: t.prefix,
          name: t.name,
          lastName: t.lastName,
          phoneNumber: t.phoneNumber
        };
      });

      const itemRef = this.db.list('teacher');

      itemRef.push(teacherItems).then((t) => {
        resolve(0);
      });
    });

  }
}
