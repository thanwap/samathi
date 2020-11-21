import { LoadingService } from './../loading.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Teacher } from '../shared/models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  constructor(
    private loadingService: LoadingService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) { }

  getTeacherById(id: any): Promise<Teacher> {
    return new Promise<Teacher>((resolve, reject) => {
      this.loadingService.setLoading();
      this.db.object('/teacher/' + id)
        .snapshotChanges()
        .subscribe(action => {
          const val: any = action.payload.val();
          console.log(val);

          resolve(new Teacher(
            action.key,
            val.prefix,
            val.name,
            val.lastName,
            val.phoneNumber,
            val.images
          ));
          this.loadingService.setLoadingFinish();
        });
    });
  }

  getTeachers(): Promise<Teacher[]> {
    return new Promise<Teacher[]>((resolve, reject) => {
      this.loadingService.setLoading();
      this.db.list('/teacher', ref => ref.orderByChild('name'))
        .snapshotChanges()
        .subscribe(result => {
          resolve(result.map(action => {
            const val: any = action.payload.val();
            return new Teacher(
              action.key,
              val.prefix,
              val.name,
              val.lastName,
              val.phoneNumber,
              val.images);
          }));
          this.loadingService.setLoadingFinish();
        });
    });
  }

  findTeachers(name: string, lastName: string) {
    return new Promise((resolve, reject) => {
      this.loadingService.setLoading();
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
          this.loadingService.setLoadingFinish();
        });
    });
  }

  addTeacher(teacher: Teacher, file: File): Promise<string> {
    this.loadingService.setLoading();
    const teacherItem = {
      prefix: teacher.prefix,
      name: teacher.name,
      lastName: teacher.lastName,
      phoneNumber: teacher.phoneNumber
    };

    return new Promise<string>((resolve, reject) => {
      const itemRef = this.db.list('teacher');

      itemRef.push(teacherItem).then(async (t) => {
        const id = t.key;
        if (file) {
          await this.uploadImage(id, file);
        }
        resolve(id);
        this.loadingService.setLoadingFinish();
      });
    });
  }

  addTeachers(teachers: any) {
    return new Promise<number>((resolve, reject) => {
      this.loadingService.setLoading();
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
      this.loadingService.setLoadingFinish();
    });
  }

  saveTeacher(teacher: Teacher, file: File): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.loadingService.setLoading();
      if (file) {
        await this.uploadImage(teacher.id, file);
      }
      this.db.object('/teacher/' + teacher.id)
        .update({
          prefix: teacher.prefix,
          name: teacher.name,
          lastName: teacher.lastName,
          fullName: `${teacher.name} ${teacher.lastName}`,
          phoneNumber: teacher.phoneNumber
        }).then(() => {
          resolve();
        }).finally(() => this.loadingService.setLoadingFinish());
    });
  }

  deleteTeacher(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadingService.setLoading();
      this.db.object('/teacher/' + id)
        .remove()
        .then(() => {
          resolve();
        }).finally(() => this.loadingService.setLoadingFinish());
    });
  }

  uploadImage(id: string, file: File): Promise<string> {
    this.loadingService.setLoading();
    return new Promise((resolve, reject) => {
      const path = `Plate/teachers/${id}/${Date.now()}_${file.name}`;
      // const ref = this.storage.ref(path);
      this.storage.upload(path, file).then(async f => {
        console.log(f);
        const pathImage = await f.ref.getDownloadURL();
        console.log(id);
        this.db.object('/teacher/' + id).update({ images: [pathImage] }).then(() => {
          resolve(pathImage);
          this.loadingService.setLoadingFinish()
        }).finally(() => this.loadingService.setLoadingFinish());
      });
    });
  }
}
