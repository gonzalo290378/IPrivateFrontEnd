// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class FollowService {
//   private baseUrl = 'http://localhost:8090/ms-follow/api/v1/follow';

//   constructor(private http: HttpClient) {}

//   follow(followedId: number): Observable<void> {
//     return this.http.post<void>(`${this.baseUrl}/${followedId}`, {});
//   }

//   unfollow(followedId: number): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/${followedId}`);
//   }

//   getFollowers(userId: number): Observable<FollowResponseDTO[]> {
//     return this.http.get<FollowResponseDTO[]>(
//       `${this.baseUrl}/${userId}/followers`,
//     );
//   }

//   getFollowing(userId: number): Observable<FollowResponseDTO[]> {
//     return this.http.get<FollowResponseDTO[]>(
//       `${this.baseUrl}/${userId}/following`,
//     );
//   }

//   getCounts(userId: number): Observable<FollowCountDTO> {
//     return this.http.get<FollowCountDTO>(`${this.baseUrl}/${userId}/count`);
//   }

//   isFollowing(followedId: number): Observable<{ following: boolean }> {
//     return this.http.get<{ following: boolean }>(
//       `${this.baseUrl}/is-following/${followedId}`,
//     );
//   }
// }
