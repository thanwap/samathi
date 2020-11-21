import { LoadingService } from './loading.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'samathi';

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    public loadingSerivce: LoadingService) {
  }
  ngOnInit(): void {
  }

  async logout() {
    await this.auth.auth.signOut();
    this.router.navigate(['/login']);
  }
}
