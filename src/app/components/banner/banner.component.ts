import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {

  public slideOpts: { [k: string]: any } = {
    autoplay: {
      delay: 2500,
      // disableOnInteraction: false,
    }
  };
  constructor(private navCntrl: NavController) { }

  ngOnInit() {}

  goTo(page){
    this.navCntrl.navigateForward(page);
  }
}
