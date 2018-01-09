import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, NavParams } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { DashboardPage } from '../dashboard/dashboard';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	splash = true;
  dbUrl = 'http://192.168.1.2:8888/';

  signInComponents = {
    email:'',
    password:''
  };

  constructor(public navCtrl: NavController, private navParams:NavParams, private alertCtrl:AlertController, private toastCtrl:ToastController, private http:HttpClient, private storage: Storage) {
    this.splash = this.navParams.data;
  }

  ionViewDidLoad(){

    this.storage.get('user').then((val) => {
      if(val){
        this.navCtrl.setRoot(DashboardPage);
      }
    });

    setTimeout(() => {

    		this.splash=false;
    	
    }, 3000);
  
  }

  postUser(){
    let data = 'post=signin&'+'email='+this.signInComponents.email+'&password='+this.signInComponents.password;
    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
    
    return new Promise(resolve =>{
       this.http.post(this.dbUrl+'gestiondesnotes/post.php', data, config).subscribe((response) => {
        resolve(response);

        if(!response['isValide']){
          this.presentAlert("Error", response['content']);
        }else{
           this.presentToast(response['msg']);
           this.storage.set('user', response['content']);
           this.navCtrl.setRoot(DashboardPage);
           
        }

      }, err => {
        console.log(err);
      });
    });
  }

  signUp(){
    this.navCtrl.push(SignupPage);
  }

  signIn(){
    let emailValide = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.signInComponents.email);
    if(!emailValide)
      this.presentAlert('Wrong Email', 'reCheck your Email');
    else if(this.signInComponents.password.length<8)
      this.presentAlert('Wrong Password', 'reCheck your Password');
    else
      this.postUser();
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
