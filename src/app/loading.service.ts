import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public isLoading = false;
  constructor() { }

  setLoading() {
    this.isLoading = true;
  }

  setLoadingFinish() {
    this.isLoading = false;
  }
}
