import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/_service';
import { MessageType, ShowMessage, SystemValues } from '../../Models';
import { p_gen_param } from '../../Models/p_gen_param';
import { sd_day_operation } from '../../Models/sd_day_operation';

@Component({
  selector: 'app-dayinitialization',
  templateUrl: './dayinitialization.component.html',
  styleUrls: ['./dayinitialization.component.css']
})
export class DayinitializationComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService,
    private modalService: BsModalService,
    ) { }
  isLoading = false;
  sys = new SystemValues();
  sdoRet: sd_day_operation[] = [];
  showMsg: ShowMessage;
  initcriteria: FormGroup;
  fromdate: Date;
  alertMsg = '';
  closeResult='';
  showAlert = false;
  isRetrieve=false;
  isOk=false;
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  ngOnInit(): void {
    //this.fromdate=this.convertDate(localStorage.getItem('__currentDate'));
    this.initcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required]
    });
    this.isRetrieve=true;
    this.isOk=false;
  }
private getDayOpertion ()
{
  ;
  this.showMsg =null;
  var sdo = new sd_day_operation();
  //sdo.operation_dt =this.convertDate(localStorage.getItem('__currentDate'));// new Date();
  sdo.operation_dt =this.sys.CurrentDate;
  ;
  this.svc.addUpdDel<any>('Sys/GetDayOperation', sdo).subscribe(
    res => {
      ;
      this.isLoading = false;
      //var a=res.find(x=>x.cls_flg==="N").cls_flg ;
      if (res.findIndex(x=>x.cls_flg==='N')==0)
      {
        this.HandleMessage(true, MessageType.Info,'Branches Are Opened' );
        this.sdoRet = res;
        this.isRetrieve=true;
        this.isOk=false;
        this.sdoRet.forEach(x=>x.operation_dt=this.convertDate(x.operation_dt.toString()))
        }
      else
      {
      this.sdoRet = res;
      this.isRetrieve=false;
      this.isOk=true;
      this.sdoRet.forEach(x=>x.operation_dt=this.convertDate(x.operation_dt.toString()))
      }
    },
    err => { ;  this.isLoading = false;}
  );
}
dayInitialize()
{
  this.onLoadScreen(this.content)
}

private onLoadScreen(content) {
  this.modalRef = this.modalService.show(content, this.config);
}

public SubmitInit() {
  if (this.initcriteria.invalid) {
    this.HandleMessage(true, MessageType.Error,'Invalid Input.' );
    return false;
  }
  else
  {
    this.isLoading = true;
    this.dayInitiationCall(this.initcriteria.value['fromDate']);
  }
}
private dayInitiationCall (opnDt :any)
{
  this.showMsg =null;
  var pgp = new p_gen_param();
  pgp.adt_trans_dt = opnDt;
  pgp.gs_user_id= localStorage.getItem('__userId');

  ;
  this.svc.addUpdDel<any>('Sys/W_DAY_OPEN', pgp).subscribe(
    res => {
      debugger;
      this.isLoading = false;
      this.alertMsg = res.output;
      this.HandleMessage(true, MessageType.Sucess,this.alertMsg===null?"Day Initialization is Successfull." :this.alertMsg);
      this.isRetrieve=true;
      this.isOk=false;
      this.modalRef.hide();
    },
    err => { debugger;  this.isLoading = false;
      this.isRetrieve=true;
      this.isOk=false;
      this.modalRef.hide();
    }
  );
}
closeScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}
dayRetrieve()
{
  this.getDayOpertion();
}
private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
  this.showMsg = new ShowMessage();
  this.showMsg.Show = show;
  this.showMsg.Type = type;
  this.showMsg.Message = message;
}
private  convertDate(datestring:string):Date
{
var parts = datestring.match(/(\d+)/g);
return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
}

}
