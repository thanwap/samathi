import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  constructor(private db: AngularFireDatabase) { }

  getChapters(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db.list('/chapter_temp').snapshotChanges()
        .subscribe(result => {
          resolve(result.map((action) => {
            return { key: action.key, value: action.payload.val() };
          }));
        });
    });
  }
}
