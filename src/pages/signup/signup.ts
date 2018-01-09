import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import {Md5} from 'ts-md5/dist/md5';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

	signUpComponents = {
		email:'',
		fname:'',
		lname:'',
		cne:null,
		password:'',
		passwordconfirm:'',
    field:null
	};

  Fields : any;

  dbUrl = 'http://192.168.1.2:8888/';

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private http:HttpClient, private toastCtrl: ToastController) {
  }

  ngOnInit(){
    this.getFields();
  }

  getFields(){

    return new Promise(resolve =>{
       this.http.get(this.dbUrl+'gestiondesnotes/get.php?get=fields').subscribe((response) => {
        resolve(response);
      }, err => {
        console.log(err);
      });
    }).then(res=>{
      this.Fields = res['content'];
    });
  }

  postUser(){
    let data = 'post=signup&'+'email='+this.signUpComponents.email+'&fname='+this.signUpComponents.fname+'&lname='+this.signUpComponents.lname+'&cne='+this.signUpComponents.cne+'&password='+this.signUpComponents.password+'&field='+this.signUpComponents.field;
    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
    
    return new Promise(resolve =>{
       this.http.post(this.dbUrl+'gestiondesnotes/post.php', data, config).subscribe((response) => {
        resolve(response);

        if(!response['isValide']){
          this.presentAlert("Error", response['content']);
        }else{
           this.presentToast(response['content']);
           this.signIn();
        }

      }, err => {
        console.log(err);
      });
    });
  }

  signIn(){
    this.navCtrl.pop();
  }

  signUp(){
  	let emailValide = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.signUpComponents.email);
  	if(!emailValide)
  		this.presentAlert('Wrong Email', 'Email should be in this format x@x.xx');
  	else if(this.signUpComponents.fname.length<3 )
  		this.presentAlert('Wrong First Name', 'First name should be at least 3 characters');
  	else if(this.signUpComponents.lname.length<3)
  		this.presentAlert('Wrong Last Name', 'Last name should be at least 3 characters');
  	else if((this.signUpComponents.cne+"").length!=10)
  		this.presentAlert('Wrong CNE', 'CNE should be a 10 digits number');
  	else if(this.signUpComponents.password.length<8)
  		this.presentAlert('Wrong Password', 'Password should be at least 8 charachters');
  	else if(Md5.hashStr(this.signUpComponents.password)!==Md5.hashStr(this.signUpComponents.passwordconfirm))
  		this.presentAlert('Wrong Password Confirmation', "Password Confirmation and Password doesn't much");
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
