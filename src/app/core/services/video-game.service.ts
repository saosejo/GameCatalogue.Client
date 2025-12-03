import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideoGame, UpdateVideoGameVm, PaginatedResult } from '../../features/video-games/models/video-game.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoGameService {
  private apiUrl = `${environment.apiUrl}/Videogames`;

  constructor(private http: HttpClient) { }

  getVideoGames(
    pageIndex: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
    sortBy?: string,
    sortDescending: boolean = false
  ): Observable<PaginatedResult<VideoGame>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    if (sortBy) {
      params = params.set('sortBy', sortBy);
      params = params.set('sortDescending', sortDescending.toString());
    }

    return this.http.get<PaginatedResult<VideoGame>>(`${this.apiUrl}/GetVideoGames`, { params });
  }

  getById(id: number) {
    return this.http.get<VideoGame>(`${this.apiUrl}/GetVideoGame/${id}`);
  }

  update(model: UpdateVideoGameVm) {
    return this.http.put(`${this.apiUrl}/UpdateVideoGame/${model.id}`, model);
  }

}