import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommentsService } from '../services/comments.service';
import { ActiveCommentInterface } from '../types/activeComment.interface';
import { CommentInterface } from '../types/comment-interface';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnChanges {
  @Input() currentUserId!: string;

comments: CommentInterface[] = [];
activeComment: ActiveCommentInterface | null = null;

  constructor(private commentsService: CommentsService) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("Change: "+changes)
  }

  ngOnInit(): void {
    this.refreshComments();
  }

  refreshComments(): void {
    console.log("refresh comments")
    this.commentsService.getComments().subscribe((c) => {
      this.comments = c;      
      console.log("comments = ", this.comments);
    });
  }

  get rootComments() {
    return this.comments.filter(comment => comment.parentId === null);
  }

  addComment({ text, parentId }: { text: string, parentId: string | null }): void {
    this.commentsService.createComment(text, parentId).subscribe((created) => {
      console.log("addComment: "+JSON.stringify(created));
      this.comments = [...this.comments, created];      
      this.activeComment = null;
    });
  }

  updateComment({ text, commentId }: { text: string, commentId: string }): void {
    this.commentsService.updateComment(text, commentId).subscribe(updatedComment => {
      console.log("updateComment: " + JSON.stringify(updatedComment));
      this.comments = this.comments.map((comment) => {
        if(comment.id === commentId) {
          return updatedComment;
        } else {
          return comment;
        }
      });      
      this.activeComment = null;
    });
  }

  deleteComments(commentIds: string[]):void {
    console.log("DELETE "+commentIds);
  }

  getReplies(commentId: string): CommentInterface[] {
    return this.comments.filter((c) => c.parentId === commentId).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  setActiveComment(activeComment: ActiveCommentInterface | null) {
    this.activeComment = activeComment;
    console.log("setActiveComment = " + JSON.stringify(this.activeComment));
  }

}
