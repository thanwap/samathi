import { LoadingService } from './loading.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'samathi';
  loadingStack = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private auth: AngularFireAuth,
    private router: Router,
    public loadingSerivce: LoadingService) {
  }
  ngOnInit(): void {
    this.loadingStack = this.loadingSerivce.loadingStack;
  }

  async logout() {
    await this.auth.auth.signOut();
    this.router.navigate(['/login']);
  }
}
