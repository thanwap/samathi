
export class Chapter {
  public name: string;
  public vieoMiniutes: number;

  constructor(chapter: string, minute: string) {
    this.name = chapter;
    this.vieoMiniutes = minute
      ? Number.parseFloat(minute.trim()) : 0;
  }
}
