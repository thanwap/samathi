import { LoadingService } from './../loading.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
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
    return new Promise<Teacher>((resolve) => {
      this.loadingService.setLoading();
      this.db.object('/teacher/' + id)
        .snapshotChanges()
        .subscribe((action: SnapshotAction<Teacher>) => {
          const val = action.payload.val();

          resolve(new Teacher(
            action.key,
            val.prefix,
            val.firstName,
            val.lastName,
            val.phoneNumber,
            val.imagePath
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
          resolve(result.map((action: SnapshotAction<Teacher>) => {
            const val = action.payload.val();
            return new Teacher(
              action.key,
              val.prefix,
              val.firstName,
              val.lastName,
              val.phoneNumber,
              val.imagePath);
          }));
          this.loadingService.setLoadingFinish();
        });
    });
  }

  findTeachers(firstName: string) {
    return new Promise((resolve, reject) => {
      this.loadingService.setLoading();
      this.db.list('/teacher',
        (ref) => {
          if (firstName) {
            ref.orderByChild('firstName')
              .startAt(firstName)
              .endAt(firstName + '\uf8ff');
          }

          return ref;
        }
      )
        .snapshotChanges()
        .subscribe(result => {
          resolve(result.map((action: SnapshotAction<Teacher>) => {
            const val = action.payload.val();
            return new Teacher(
              action.key,
              val.prefix,
              val.firstName,
              val.lastName,
              val.phoneNumber,
              val.imagePath
            );
          }));
          this.loadingService.setLoadingFinish();
        });
    });
  }

  addTeacher(teacher: Teacher, file: File): Promise<string> {
    this.loadingService.setLoading();
    const teacherItem =
    {
      prefix: teacher.prefix,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      phoneNumber: teacher.phoneNumber,
      imagePath: "",
    };

    return new Promise<string>(async (resolve) => {
      const itemRef = this.db.list('teacher');

      if (file) {
        teacherItem.imagePath = await this.uploadImage(file);
      }

      itemRef.push(teacherItem).then(async (t) => {
        const id = t.key;
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

      this.db.object('/teacher/' + teacher.id)
        .update({
          prefix: teacher.prefix,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          phoneNumber: teacher.phoneNumber,
          imagePath: file ? await this.uploadImage(file) : ''
        }).then(() => {
          resolve();
        }).finally(() => this.loadingService.setLoadingFinish());
    });
  }

  deleteTeacher(id: string): Promise<void> {
    return new Promise((resolve) => {
      this.loadingService.setLoading();
      this.db.object('/teacher/' + id)
        .remove()
        .then(() => {
          resolve();
        }).finally(() => this.loadingService.setLoadingFinish());
    });
  }

  uploadImage(file: File): Promise<string> {
    this.loadingService.setLoading();
    return new Promise((resolve) => {
      const path = `images/teachers/${Date.now()}_${file.name}`;
      // const ref = this.storage.ref(path);
      this.storage.upload(path, file).then(async f => {
        const pathImage = await f.ref.getDownloadURL();
        resolve(pathImage);
        this.loadingService.setLoadingFinish();
        // this.db.object('/teacher/' + id).update({ images: [pathImage] }).then(() => {
        //   resolve(pathImage);
        //   this.loadingService.setLoadingFinish()
        // }).finally(() => this.loadingService.setLoadingFinish());
      });
    });
  }
}
