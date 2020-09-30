import { Chapter } from './chapter.model';
import { Teacher } from './teacher.model';

export class ScheduleItem {
  public date: string;
  public startTime: string;
  public finishTime: string;
  public chapter: Chapter;
  public teacher: Teacher;

  constructor(
    date: string,
    time: string,
    chapter: Chapter,
    teacher: Teacher) {
    this.setDateTime(date, time);
    this.chapter = chapter;
    this.teacher = teacher;
  }

  setDateTime(date: string, timeString: string) {
    this.date = date ? date : null;

    this.startTime = date && timeString
      ? `${date} ${timeString.substring(0, 5).replace('.', ':')}`
      : null;

    this.finishTime = date && timeString
      ? `${date} ${timeString.substring(8, 13).replace('.', ':')}`
      : null;
  }
}
