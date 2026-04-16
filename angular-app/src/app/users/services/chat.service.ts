import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Message } from "../../models/messages";

@Injectable({ providedIn: 'root' })
export class MessageService {

  private api = '/api/v1/messages';

  constructor(private http: HttpClient) {}

  getConversation(senderId: string, receiverId: string) {
    return this.http.get<Message[]>(
      `${this.api}/${senderId}/${receiverId}`
    );
  }
}