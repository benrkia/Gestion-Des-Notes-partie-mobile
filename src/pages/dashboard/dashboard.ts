import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { AddnotePage } from '../addnote/addnote';
import { HomePage } from '../home/home';
import { NotePage } from '../note/note';


@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

	UserInfo : any = {
    USER_FNAME:'',
    USER_LNAME:''
  };
	Notes : any;
  initNotes : any;
	Elements : any;
	noteExist=false;
  dbUrl = 'http://192.168.1.2:8888/';

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, private http:HttpClient, private alertCtrl:AlertController) {
  }

  ngOnInit(){
  	this.storage.get('user').then((val) => {
		  this.UserInfo=val;
    	this.getNotes();
	  });
  }

  getNotes(){

    return new Promise(resolve =>{
    	let url = this.dbUrl+'gestiondesnotes/get.php?get=notes&field='+this.UserInfo.FILED_ID+'&user='+this.UserInfo.USER_ID;
       	this.http.get(url).subscribe((response) => {
        	resolve(response);
      	}, err => {
        	console.log(err);
      	});
    }).then(res=>{
      this.Elements = res['content'];
      this.Notes = res['notes']['content'];
      this.noteExist = res['notes']['exist'];
      if(this.noteExist){
        for(let i=0,k=this.Notes.length;i<k;i++){
         this.Notes.DATE = new Date(this.Notes[i].DATE);
        }
        this.initNotes = this.Notes;
      }
      
    });
  }

  addNote(){
  	this.navCtrl.push(AddnotePage, this.Elements);
  }

  logOut(){
    let confirm = this.alertCtrl.create({
      title: 'Logout Confirmation',
      message: 'Are you sure, you want to logout',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.storage.clear();
            this.navCtrl.setRoot(HomePage, false);
          }
        }
      ]
    });
    confirm.present();
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeNotes();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.Notes = this.Notes.filter((note) => {
        return (note.NOTE_NAME.toLowerCase().indexOf(val.toLowerCase()) > -1 || note.CONTENT.toLowerCase().indexOf(val.toLowerCase()) > -1 || note.ELEMENT_NAME.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  initializeNotes(){
    this.Notes = this.initNotes;
  }

  goToNote(index:number){
    this.navCtrl.push(NotePage, this.Notes[index]);
  }

}
