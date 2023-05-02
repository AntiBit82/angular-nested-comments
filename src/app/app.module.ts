import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommentFormComponent } from './comments/comment-form/comment-form.component';
import { CommentComponent } from './comments/comment/comment.component';
import { CommentsModule } from './comments/comments.module';
import { CommentsComponent } from './comments/comments/comments.component';
import { CommentsService } from './comments/services/comments.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommentsModule,
    HttpClientModule,
  ],
  providers: [CommentsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
