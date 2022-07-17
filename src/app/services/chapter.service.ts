import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { IChapter } from '../shared/models/chapter.model';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  constructor(private db: AngularFireDatabase) { }

  getChapters(): Promise<IChapter[]> {
    return new Promise<IChapter[]>((resolve) => {
      this.db.list('/chapter').snapshotChanges()
        .subscribe(result => {
          resolve(result.map((action) => {
            const val = action.payload.val() as IChapter;

            return {...val, id: action.key} as IChapter;
          }));
        });
    });
  }
}
