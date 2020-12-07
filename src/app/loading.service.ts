import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public isLoading = false;
  public loadingStack = [];
  constructor() { }

  setLoading() {
    this.isLoading = true;
    this.loadingStack.push(new Date());
  }

  setLoadingFinish() {
    this.isLoading = false;
    if (this.loadingStack.length > 0) {
      this.loadingStack.pop();
    }
  }

  setLoadingFinishMust() {
    this.isLoading = false;
    if (this.loadingStack.length > 0) {
      this.loadingStack = [];
    }
  }
}
