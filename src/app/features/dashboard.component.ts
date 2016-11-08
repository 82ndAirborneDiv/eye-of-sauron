import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
// import { UserActions } from '../user/user.actions';
// import { User } from '../user/user.model';
import { Site } from '../sites/site.model';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnDestroy, OnInit {
  destroyed$: Subject<any> = new Subject<any>();
  form: FormGroup;
  nameLabel = 'Enter your name';
  // user: User;
  // user$: Observable<User>;
  constructor(
    fb: FormBuilder,
    private store: Store<AppState>,
    // private userActions: UserActions,
  ) {
    this.form = fb.group({
      name: ''
    });
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
      var d = new Date();

      this.currentDate = this.monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    },
      1000)
  }

  getCurrentTime() {
    setInterval(() => {
      var time = new Date();
      var hours = time.getHours();
      var minutes = time.getMinutes();
      var s = time.getSeconds();

      var ampm = hours <= 11 ? ' AM' : ' PM';
      var strTime = [(hours === 12 ? "12" : hours % 12),
      (minutes < 10 ? "0" + minutes : minutes)
      ].join(':') + ampm;

      this.currentTime = strTime;
    },
      1000)
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
