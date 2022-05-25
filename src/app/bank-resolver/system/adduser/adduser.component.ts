import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage } from '../../Models';
import { m_branch } from '../../Models/m_branch';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  brnDtls: m_branch[]=[];

  isLoading=false;
  addUser: FormGroup;
  showMsg: ShowMessage;
  isDel = false;
  isRetrieve = false;
  isNew = false;
  isModify = false;
  isSave = false;
  isClear = false;
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService) { }

  ngOnInit(): void {
    this.GetBranchMaster();
    this.addUser = this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['', Validators.required],
      fname: ['', Validators.required],
      mname: ['', null],
      lname: ['', Validators.required],
      utype: ['', Validators.required],
      branch: ['', Validators.required]
    });
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
  }
  get f() { return this.addUser.controls; }
  closeScreen()
  {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  new()
  {
    this.isDel = false;
    this.isRetrieve = false;
    this.isNew = false;
    this.isModify = false;
    this.isSave = true;
    this.isClear = true;
    this.GetBranchMaster();
  }

  GetBranchMaster()
  {
    this.isLoading=true;
    ;
    this.svc.addUpdDel('Mst/GetBranchMaster', null).subscribe(
      res => {
        ;
        this.brnDtls=res;
        this.isLoading=false;

      },
      err => {this.isLoading=false; ;}
    )
  }
  retrieve ()
  {
    if (this.f.userid.value == null ||  this.f.branch.value==null)
    {
      this.HandleMessage(true, MessageType.Warning,'Please enter User ID and Branch!!' );
    }
    else
    {
    ;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value;
    login.brn_cd = this.f.branch.value;
    this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
      res => {
        ;
        if (res.length==0)
        {
          this.HandleMessage(true, MessageType.Sucess,'User Not found !!!' );
        }
        else
        {
        this.f.fname.setValue(res[0].user_first_name);
        this.f.mname.setValue(res[0].user_middle_name);
        this.f.lname.setValue(res[0].user_last_name);
        this.f.utype.setValue(res[0].user_type);
        this.isDel = true;
        this.isRetrieve = false;
        this.isNew = false;
        this.isModify = true;
        this.isSave = false;
        this.isClear = true;
        }

      },
      err => { ;  this.HandleMessage(true, MessageType.Error,'User Not found !!!' );
      this.initialize();
      this.isDel = false;
      this.isRetrieve = true;
      this.isNew = false;
      this.isModify = false;
      this.isSave = false;
      this.isClear = true;
    }
    )
  }

  }
  saveuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value;
    login.brn_cd = this.f.branch.value;
    login.user_first_name=this.f.fname.value;
    login.user_middle_name=this.f.mname.value;
    login.user_last_name=this.f.lname.value;
    login.user_type=this.f.utype.value;
    login.password=this.f.password.value;
    login.login_status='N';
    ;
    this.svc.addUpdDel('Sys/InsertUserMaster', login).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Sucessfully Saved the User Details' );
        this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Insertion Failed!!' );
              this.isDel = false;
              this.isRetrieve = false;
              this.isNew = false;
              this.isModify = false;
              this.isSave = true;
              this.isClear = true;
    }
    )

  }
  updateuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value;
    login.brn_cd = this.f.branch.value;
    login.user_first_name=this.f.fname.value;
    login.user_middle_name=this.f.mname.value;
    login.user_last_name=this.f.lname.value;
    login.user_type=this.f.utype.value;
    login.password=this.f.password.value;
    //login.login_status='N';
    ;
    this.svc.addUpdDel('Sys/UpdateUserMaster', login).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Sucessfully Updated the User Details' );
        this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Updation Failed!!' );
      this.isDel = false;
      this.isRetrieve = true;
      this.isNew = true;
      this.isModify = true;
      this.isSave = false;
      this.isClear = true;
    }
    )

  }
  deleteuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value;
    login.brn_cd = this.f.branch.value;
    ;
    this.svc.addUpdDel('Sys/DeleteUserMaster', login).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'User Details Deleted' );
        this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Deletion Failed!!' );
      this.initialize();
      this.isDel = false;
      this.isRetrieve = true;
      this.isNew = true;
      this.isModify = false;
      this.isSave = false;
      this.isClear = true;
    }
    )

  }
  clearuser()
  {
    this.initialize();
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
  }
  initialize()
  {
    this.f.fname.setValue(null);
    this.f.mname.setValue(null);
    this.f.lname.setValue(null);
    this.f.utype.setValue(null);
    this.f.branch.setValue(null);
    this.f.userid.setValue(null);
    this.f.password.setValue(null);
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}
