import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { forkJoin, Observable } from 'rxjs';
import { CommentInterface } from '../types/comment-interface';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private httpClient: HttpClient) { }

  getComments(): Observable<CommentInterface[]> {
    return this.httpClient.get<CommentInterface[]>(
      'http://localhost:3000/comments'
    );
  }

  createComment(
    text: string,
    parentId: string | null = null
  ): Observable<CommentInterface> {
    return this.httpClient.post<CommentInterface>(
      'http://localhost:3000/comments',
      {
        body: text,
        parentId: parentId,
        // Set this stuff in the backend!
        createdAt: new Date().toISOString(),
        userId: '1',
        username: 'Antonio B.',
      }
    );
  }

  updateComment(text: string, commentId: string): Observable<CommentInterface> {
    return this.httpClient.patch<CommentInterface>(
      `http://localhost:3000/comments/${commentId}`,
      {
        body: text
      }
    )
  }

  private deleteComment(commentId: string): Observable<CommentInterface> {
    return this.httpClient.delete<CommentInterface>(`http://localhost:3000/comments/${commentId}`);
  }

  deleteMultipleComments(commendIds: string[]): Observable<CommentInterface[]> {
    let obs: Observable<CommentInterface>[] = [];
    commendIds.forEach(id => obs.push(this.deleteComment(id)));
    return forkJoin(obs);
  }
}
