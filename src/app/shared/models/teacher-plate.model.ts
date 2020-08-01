export class TeacherPlate {
  image: string | ArrayBuffer;
  date: Date;
  title: string;
  teacherName: string;
  plateWidth: number = 0;
  bookNumber: number = 0;

  constructor(
    title: string,
    name: string,
    plateWidth: number,
    bookNumber: number) {

    this.image = 'http://placehold.it/180',
    this.date = new Date();
    this.title = title;
    this.teacherName = name;
    this.plateWidth = plateWidth;
    this.bookNumber = bookNumber;
  }
}
