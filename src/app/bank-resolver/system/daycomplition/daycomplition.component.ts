import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/_service';
import { MessageType, ShowMessage, SystemValues } from '../../Models';
import { p_gen_param } from '../../Models/p_gen_param';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-daycomplition',
  templateUrl: './daycomplition.component.html',
  styleUrls: ['./daycomplition.component.css']
})
export class DaycomplitionComponent implements OnInit {
  isOpenFromDp = false;
  sys = new SystemValues();
  constructor(private router: Router,private formBuilder: FormBuilder,private modalService: BsModalService,private svc: RestService) { }
  isLoading = false;
  alertMsg = '';
  closingdate: Date;
  closingdata: FormGroup;
  showMsg: ShowMessage;
  ngOnInit(): void {
    this.closingdate=this.sys.CurrentDate;
    this.closingdata = this.formBuilder.group({
      closingdate: [null, Validators.required],
      closingbal: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])]
    });
  }

  closeScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}

dayComplete() {
  ;
  if (this.closingdata.invalid) {
    this.alertMsg = "Invalid Input.";
    return false;
  }
  else
  {
    this.isLoading = true;
    this.dayCompletionCall(this.closingdata.value['closingdate'], this.closingdata.value['closingbal']);
  }
}
checkComplete()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}
private dayCompletionCall (clsDt :any,clsamt:any)
{
  this.showMsg =null;
  var pgp = new p_gen_param();
  pgp.brn_cd = this.sys.BranchCode;
  pgp.gs_user_type = 'A';//TDB
  pgp.gs_user_id= localStorage.getItem('__userId');
  pgp.ad_prn_amt=parseFloat(clsamt);
  ;
  this.svc.addUpdDel<any>('Sys/W_DAY_CLOSE', pgp).subscribe(
    res => {
      this.isLoading = false;
      this.alertMsg = res.output;
      this.closingdata.setValue['closingbal']=0;
      if (res.flag = -1)
      this.HandleMessage(true, MessageType.Error,this.alertMsg );
      else
      this.HandleMessage(true, MessageType.Error,this.alertMsg );

    },
    err => { ;  this.isLoading = false;}
  );
}

private  convertDate(datestring:string):Date
{
var parts = datestring.match(/(\d+)/g);
return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
}


private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
  this.showMsg = new ShowMessage();
  this.showMsg.Show = show;
  this.showMsg.Type = type;
  this.showMsg.Message = message;
}

}
