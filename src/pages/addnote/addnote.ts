import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { DashboardPage } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-addnote',
  templateUrl: 'addnote.html',
})
export class AddnotePage {

	Note = {
		NOTE_NAME:'',
		CHAPT_TITLE:'',
		CONTENT:'',
		NOTES:'',
		ELEMENT_ID:null,
		USER_ID:null
	};
	Elements : any;
  dbUrl = 'http://192.168.1.2:8888/';

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, private alertCtrl:AlertController, private toastCtrl:ToastController, private http:HttpClient) {
  }

  ngOnInit(){
  	this.Elements = this.navParams.data;
  	this.storage.get('user').then((val) => {
		this.Note.USER_ID=val.USER_ID;
	});
  }

  postNote(){
    let data = 'post=addnote&NOTE_NAME='+this.Note.NOTE_NAME+'&CHAPT_TITLE='+this.Note.CHAPT_TITLE+'&CONTENT='+this.Note.CONTENT+'&NOTES='+this.Note.NOTES+'&ELEMENT_ID='+this.Note.ELEMENT_ID+'&USER_ID='+this.Note.USER_ID;
    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
    
    return new Promise(resolve =>{
       this.http.post(this.dbUrl+'gestiondesnotes/post.php', data, config).subscribe((response) => {
        resolve(response);

        if(!response['isValide']){
          this.presentAlert("Error", response['content']);
        }else{
           this.presentToast(response['content']);
           this.navCtrl.setRoot(DashboardPage);
        }

      }, err => {
        console.log(err);
      });
    });
  }

  addNote(){

  	if(this.Note.NOTE_NAME.length<5 || this.Note.NOTE_NAME.length>30)
  		this.presentAlert('Note Error', 'The Note name should be between 5 and 30 chars');
  	else if(this.Note.CHAPT_TITLE.length<5)
  		this.presentAlert('Note Error', 'The Chapter title should be at least 5 chars');
  	else if(this.Note.ELEMENT_ID==null)
  		this.presentAlert('Note Error', 'You should select the an Element');
  	else if(this.Note.CONTENT.length<10)
  		this.presentAlert('Note Error', 'The Chapter title should be at least 10 chars');
  	else
  		this.postNote();

  }

	presentAlert(title:string, subTitle:string) {
	  let alert = this.alertCtrl.create({
	    title: title,
	    subTitle: subTitle,
	    buttons: ['Ok']
	  });
	  alert.present();
	}

  presentToast(msg:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


}
