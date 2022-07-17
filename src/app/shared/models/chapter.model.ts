
export class Chapter {
  public name: string;
  public vieoMiniutes: number;

  constructor(chapter: string, minute: any) {
    this.name = chapter;
    this.vieoMiniutes = minute && Number.isInteger(minute)
      ? Number.parseFloat(minute.trim()) : 0;
  }
}

export interface IChapter {
  id: string,
  bookNo: string,
  name: string,
  no: string,
  periodTime: number
}
