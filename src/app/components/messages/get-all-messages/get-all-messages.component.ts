import { Message } from '../../../interfaces/message';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { InteractionService } from 'src/app/services/interaction.service';
import { MessageService } from 'src/app/services/messages/message.service';

@Component({
  selector: 'app-get-all-messages',
  templateUrl: './get-all-messages.component.html',
  styleUrls: ['./get-all-messages.component.scss'],
})
export class GetAllMessagesComponent implements OnInit {

  @Input('user') currentUser: User;
  messages: Message[];
  messagesTotalReceived: {sent: Message[],recieved: Message[]} = {sent: [],recieved: []};

  currentSegmentType:string = 'sent';

  constructor(private messageService: MessageService,
    private interactionService: InteractionService) { }

  ngOnInit() {
    this.subscribetoMessages()
    this.getAllMessages();
  }


  getAllMessages() {
    this.interactionService.createLoading("Loading Your Message !! ..")
      .then(() => {
        this.messageService.getMessages()
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false) {
              this.messages = result;
              if (this.messages.length != 0) {3
                this.filterMessages(result);
                this.interactionService.createToast('Your Messages has been loaded !', 'success', 'bottom');
              }
              else {
                this.interactionService.createToast('You dont have any messages !', 'warning', 'bottom');
              }
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();
            this.interactionService.hide();
            if (err.status == 404) {
              this.interactionService.createToast('No meesages Found !', 'warrning', 'bottom');
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          });
      })
  }

  subscribetoMessages() {
    this.messageService.getMessagesSubject()
      .subscribe(messages => {
        this.messages = messages;
        this.filterMessages(messages);
      })
  }


  
  filterMessages(messages: Message[]) {
    this.messagesTotalReceived = {sent: [],recieved: []};

    messages.map(message => {
      if (message.from._id != this.currentUser._id){
        this.messagesTotalReceived.recieved.push(message);
      }
      else {
        this.messagesTotalReceived.sent.push(message);
      }
      
    });
    console.log(this.messagesTotalReceived);
  }

  segmentChanged(event){
    this.currentSegmentType = event.detail.value;
  }

}



