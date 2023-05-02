import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommentsService } from '../services/comments.service';
import { ActiveCommentInterface } from '../types/activeComment.interface';
import { ActiveCommentTypeEnum } from '../types/activeCommentType.enum';
import { CommentInterface } from '../types/comment-interface';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnChanges {

  @Input() comment!: CommentInterface;
  @Input() comments!: CommentInterface[];
  @Input() parentId!: string | null;
  @Input() currentUserId: string | undefined;
  @Input() activeComment: ActiveCommentInterface | null = null;
  @Output() setActiveComment = new EventEmitter<ActiveCommentInterface | null>()
  @Output() addComment = new EventEmitter<{text: string; parentId: string | null}>()
  @Output() refreshComments = new EventEmitter<void>();
  @Output() updateComment = new EventEmitter<{ text: string; commentId: string }>();

  replyId: string | null = null;
  activeCommentType = ActiveCommentTypeEnum;
  replies: CommentInterface[] = [];

  createdAt = '';
  canReply = false;
  canEdit = false;
  canDelete = false;

  constructor(private commentService: CommentsService) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.replies = this.getReplies(this.comment.id);
  }

  ngOnInit(): void {
    //console.log("comment onInit, allComments = "+JSON.stringify(this.comments));
    this.replies = this.getReplies(this.comment.id);
    const fiveMinutes = 300000;
    const timePassed = new Date().getMilliseconds() - new Date(this.comment.createdAt).getMilliseconds() > fiveMinutes;

    this.canReply = !!this.currentUserId;
    this.canEdit = this.currentUserId === this.comment.userId; //&& !timePassed;
    this.canDelete = this.currentUserId === this.comment.userId // && this.replies.length > 0; //&& !timePassed;
    //console.log('comment = ' + this.comment + ' currentUserId = ' + this.currentUserId + ', cR: '+this.canReply + ', cE: ' + this.canEdit + ', cD: ' + this.canDelete);
    this.replyId = this.comment.id;
  }

  getReplies(commentId: string): CommentInterface[] {
    const replies = this.comments.filter(c => c.parentId === commentId).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return replies;
  }

  isReplying(): boolean {
    if(!this.activeComment) {
      return false;
    }
    return (
      this.activeComment.id === this.comment.id &&
      this.activeComment.type === this.activeCommentType.replying
    );
  }

  isEditing(): boolean {
    if(!this.activeComment) {
      return false;
    }
    //console.log("Active comment = " + JSON.stringify(this.activeComment) + ", this comment = "+JSON.stringify(this.comment));
    return (
      this.activeComment.id === this.comment.id &&
      this.activeComment.type === this.activeCommentType.editing
    );
  }

  deleteCommentAndChildren(id: string) {
    const replies: string[] = this.getReplies(id).map(c => c.id);
    const allCommentIds = this.getRepliesRecursive(id, replies, [...replies, id]);

    this.commentService.deleteMultipleComments(allCommentIds).subscribe(_ => this.refreshComments.emit())

  }

  getRepliesRecursive(parentId: string, childrenIds: string[], allChildrenIds: string[]): string[] {
    //console.log(`getRepliesRecursive(${parentId}, ${childrenIds}, ${allChildrenIds})`);

    for(var r of childrenIds) {
      const replies: string[] = this.getReplies(r).map(r => r.id);
      allChildrenIds.push(...replies)

      this.getRepliesRecursive(r, replies, allChildrenIds)
    }

    return allChildrenIds;
  }
}
