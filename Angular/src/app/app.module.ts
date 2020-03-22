import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SignupComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatButtonModule
    ],
    exports: [
        MatSidenavModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatButtonModule
    ],
    providers: [
        Title
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
