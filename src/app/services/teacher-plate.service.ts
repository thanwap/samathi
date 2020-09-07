import { Injectable, OnInit, Output, EventEmitter } from '@angular/core';
import { TeacherPlate } from '../shared/models/teacher-plate.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherPlateService implements OnInit {
  private plateInfo: TeacherPlate;
  public readonly minPlateWidth: number = 400;
  public readonly defaultPlateWidth: number = 543;
  public readonly defaultBookNumber: number = 1;

  constructor() {
    this.plateInfo = new TeacherPlate(
      '',
      '',
      this.defaultPlateWidth,
      this.defaultBookNumber
    );
  }

  ngOnInit(): void {}

  getPlateInfo(): TeacherPlate {
    return this.plateInfo;
  }

  setDate(date: Date): void {
    this.plateInfo.date = date;
  }

  setTile(title: string): void {
    this.plateInfo.title = title;
  }

  setTeacherName(name: string): void {
    this.plateInfo.teacherName = name;
  }

  setImage(imageSrc: any): void {
    this.plateInfo.image = imageSrc;
  }

  setPlateWidth(width: number): void {
    if (width >= this.minPlateWidth) {
        this.plateInfo.plateWidth = width;
    } else {
    this.plateInfo.plateWidth = this.defaultPlateWidth;
    }
  }

  setBookNumber(bookNumber: number): void {
    this.plateInfo.bookNumber = bookNumber;
  }
}
