import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    constructor(private titleService: Title) {
        var title = 'Versa - Signup';
        this.titleService.setTitle(title);
    }

  ngOnInit(): void {
  }

}
