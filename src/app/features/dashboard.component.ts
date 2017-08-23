import { Component, OnDestroy, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
// import { UserActions } from '../user/user.actions';
// import { User } from '../user/user.model';


@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnDestroy, OnInit {
  destroyed$: Subject<any> = new Subject<any>();
  // form: FormGroup;
  // nameLabel = 'Enter your name';
  // user: User;
  // user$: Observable<User>;
  constructor(
    // fb: FormBuilder,
    private store: Store<AppState>,
    // private userActions: UserActions,
  ) {
    // this.form = fb.group({
    //   name: ''
    // });
    // this.user$ = this.store.select(state => state.user.user);
    // this.user$.takeUntil(this.destroyed$)
    // .subscribe(user => { this.user = user; });
  }

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  currentDate = '';
  currentTime = '';

  ngOnInit() {
    // this.form.get('name').setValue(this.user.name);
    this.getCurrentTime();
    this.getCurrentDate();
  }

  logout() {
    // this.store.dispatch(this.userActions.logout());
  }

  getCurrentDate() {
    setInterval(() => {
      let d = new Date();

      this.currentDate = this.monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    },
      50)
  }

  getCurrentTime() {
    setInterval(() => {
      let time = new Date();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let s = time.getSeconds();

      let ampm = hours <= 11 ? ' AM' : ' PM';
      let strTime = [(hours === 12 ? "12" : hours % 12),
      (minutes < 10 ? "0" + minutes : minutes), (s < 10 ? "0" + s : s)
      ].join(':') + ampm;

      this.currentTime = strTime;
    },
      50)
  }

  submitState() {
    // this.store.dispatch(this.userActions.editUser(
    //   Object.assign({}, this.user, { name: this.form.get('name').value }
    //   )));
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
