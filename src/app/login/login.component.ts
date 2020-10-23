import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error: string | null = '';

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

  ngOnInit() {
  }

  async login() {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      try {
        await this.afAuth.auth.signInWithEmailAndPassword(username, password);
        console.log('yo');
        this.router.navigate(['/plate']);
      } catch (error) {
        console.log(error);
        this.error = 'Username หรือ Password ผิด';
      }
    }
  }

  loginWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        console.log('You have been successfully logged in!');
        this.router.navigate(['/plate']);
      }).catch((error) => {
        console.log(error);
      });
  }
}
