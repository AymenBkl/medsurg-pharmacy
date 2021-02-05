import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';
import { Message } from 'src/app/interfaces/message';
import { MessageResponse } from 'src/app/interfaces/messageResponse';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messageUrl = config.baseURL + 'messages/messages/';
  private messages : Subject<Message[]> = new Subject<Message[]>();
  private messagess: Message[] = [];
  constructor(private httpClient: HttpClient) { 
  }

  postMessage(message: Message) {
    return new Promise((resolve, reject) => {
      this.httpClient.post<MessageResponse>(this.messageUrl + 'addmessage', message)
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            this.messagess.unshift(message);
            this.messages.next(this.messagess);
            resolve(response.message);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
  }

  getMessages() {
      return new Promise((resolve, reject) => {
        this.httpClient.get<MessageResponse>(this.messageUrl + 'getmessages')
          .subscribe(response => {
            console.log(response);
            if (response.status === 200) {
              this.messagess = response.message;
              resolve(response.message);
            }
            else {
              resolve(false);
            }
          }, err => {
            reject(err);
          });
        });
  }

  getMessagesSubject() {
    this.messages.next(this.messagess);
    return this.messages;
  }


  


}
