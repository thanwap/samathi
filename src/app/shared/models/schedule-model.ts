export interface ISchedule {
  id: string,
  teacherId: string,
  chapterId: string,
  start: string,
  finish: string,
}

export interface IScheduleRowData extends ISchedule {
  teacherName: string,
  teacherImage: string,
  chapterName: string,
  startDate: moment.Moment,
  finishDate: moment.Moment
}
