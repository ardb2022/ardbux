import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { MessageType, ShowMessage, SystemValues, mm_ifsc_code, td_outward_payment, m_acc_master, mm_acc_type, td_def_trans_trf, mm_customer } from '../../Models';
import { p_gen_param } from '../../Models/p_gen_param';

@Component({
  selector: 'app-neft-outward',
  templateUrl: './neft-outward.component.html',
  styleUrls: ['./neft-outward.component.css']
})
export class NeftOutwardComponent implements OnInit {

  constructor(private svc: RestService, private router: Router, private modalService: BsModalService,
  ) { }
  @ViewChild('ifsc', { static: true }) ifsc: TemplateRef<any>;
  modalRef: BsModalRef;

  alertMsgType: string;
  alertMsg: string;
  disabledAll = false;
  showAlert = false;
  isLoading = false;
  showMsg: ShowMessage;
  branchCode = '0';
  userName = '';
  sys = new SystemValues();
  isRetrieve = true;
  suggestedIfsc: mm_ifsc_code[];
  isOpenFromDp = false;
  suggestedCustomer: mm_customer[];

  neftPay = new td_outward_payment();
  neftPayRet = new td_outward_payment();
  acc_master: m_acc_master[] = [];
  accountTypeList: mm_acc_type[] = [];
  __ifsc = '';
  __ifscbank = '';
  __ifscbranch = '';
  __ifscaddress = '';
  __ifsccity = '';
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };

  ngOnInit(): void {
    //this.neftPayRet = new td_outward_payment();
    this.branchCode = this.sys.BranchCode;
    this.userName = this.sys.UserId;
    this.neftPayRet.brn_cd = this.sys.BranchCode;
    this.neftPayRet.trans_dt = this.sys.CurrentDate;
    this.neftPayRet.dr_acc_no = this.sys.NeftPayDrAcc;
    this.neftPayRet.date_of_payment = this.sys.CurrentDate;
    this.getAccountTypeList();
    this.clearData();
    
  }
  setCharge(amt : number){
   let param = new p_gen_param();
  param.ad_prn_amt=amt;    
  this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetNeftCharge', param).subscribe(
      res => {
          this.neftPayRet.charge_ded = res;
          this.isLoading = false;
          
      },
      err => {
        this.isLoading = false;
        this.isRetrieve = true;
        this.neftPayRet.charge_ded = 0;
      }
    );

  }
  
  GetNeftOutDtls() {
    this.isLoading = true;
    this.neftPay.brn_cd = this.sys.BranchCode;
    this.neftPayRet.trans_dt = this.sys.CurrentDate;
    this.neftPay.trans_cd = this.neftPayRet.trans_cd;
    this.svc.addUpdDel<any>('Deposit/GetNeftOutDtls', this.neftPay).subscribe(
      res => {
        if (res.length === 0) {
          this.neftPayRet.trans_cd = null;
          this.isLoading = false;
          this.isRetrieve = true;
          this.HandleMessage(true, MessageType.Error, 'No Data Found!!!!');
          return;
        }
        else {
          this.neftPayRet = res[0];
          this.isLoading = false;
          this.isRetrieve = true;
        }

      },
      err => {
        this.isLoading = false;
        this.isRetrieve = true;
        this.HandleMessage(true, MessageType.Error, 'No Data Found!!!!');
      }
    );
  }


  public closeAlertMsg() {
    this.showAlert = false;
    this.disabledAll = false;
  }


  public showAlertMsg(msgTyp: string, msg: string) {
    this.alertMsgType = msgTyp;
    this.alertMsg = msg;
    this.showAlert = true;
    this.disabledAll = true;
  }

  clearData() {
    this.isRetrieve = true;
    this.neftPayRet = new td_outward_payment();
    // this.neftPayRet=null;
    this.neftPayRet.brn_cd = this.sys.BranchCode;
    this.neftPayRet.trans_dt = this.sys.CurrentDate;
    this.neftPayRet.dr_acc_no=this.sys.NeftPayDrAcc;
    this.neftPayRet.date_of_payment=this.sys.CurrentDate;
    this.neftPayRet.bene_ifsc_code='';
    this.neftPayRet.credit_narration='';
    this.neftPayRet.charge_ded=0;
    this.__ifsc='';
    this.__ifscbank='';
    this.__ifscbranch='';
    this.__ifscaddress='';
    this.__ifsccity='';
  }

  retrieveData() {
    this.isRetrieve = false;
    this.neftPayRet = new td_outward_payment();
    this.neftPayRet.brn_cd = this.sys.BranchCode;
    this.neftPayRet.trans_dt = this.sys.CurrentDate;
    this.neftPayRet.dr_acc_no=this.sys.NeftPayDrAcc;
    this.neftPayRet.date_of_payment=this.sys.CurrentDate;
    this.neftPayRet.bene_ifsc_code='';
    this.neftPayRet.credit_narration='';
    this.neftPayRet.charge_ded=0;
    this.__ifsc='';
    this.__ifscbank='';
    this.__ifscbranch='';
    this.__ifscaddress='';
    this.__ifsccity='';
    //this.neftPayRet=null;
    this.neftPayRet.bene_ifsc_code='';
  }
  openModal() {
    if (this.__ifsc === '' && this.neftPayRet.bene_ifsc_code.length > 8) {
      const ifscentred = this.neftPayRet.bene_ifsc_code;
      const neftPaySearch = new td_outward_payment();
      neftPaySearch.bene_ifsc_code = ifscentred.toUpperCase();
      this.isLoading = true;
      this.svc.addUpdDel<any>('Deposit/GetIfscCode', neftPaySearch).subscribe(
        res => {

          this.isLoading = false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.__ifsc = res[0].ifsc;
            this.__ifscbank = res[0].bank;
            this.__ifscbranch = res[0].branch;
            this.__ifscaddress = res[0].address;
            this.__ifsccity = res[0].city;
            this.modalRef = this.modalService.show(this.ifsc, this.config);
          } else {
            this.__ifsc = '';
            this.__ifscbank = '';
            this.__ifscbranch = '';
            this.__ifscaddress = '';
            this.__ifsccity = '';
          }
        },
        err => { this.isLoading = false; }
      );

    }
    else {
      this.modalRef = this.modalService.show(this.ifsc, this.config);
    }
  }

  deleteData() {
    if (this.neftPayRet.trans_cd === 0 || this.neftPayRet.trans_cd == null) {
      this.HandleMessage(true, MessageType.Error, 'Retrieve a unapprove transaction for delete!!!');
      return;
    }
    if (this.neftPayRet.approval_status === 'A' && this.neftPayRet.trans_cd > 0) {
      this.HandleMessage(true, MessageType.Error, 'Already Approved Transaction!!!');
      return;
    }
    if (!(confirm('Are you sure you want to Delete The Transaction '))) {
      return;
    }

    this.isRetrieve = true;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/DeleteNeftOutDtls', this.neftPayRet).subscribe(
      res => {

        this.isLoading = false;
        if (res === 0) {
          this.HandleMessage(true, MessageType.Sucess, 'Deleted Successfully!!!');
          this.neftPayRet = new td_outward_payment();
          // this.neftPayRet=null;
          this.__ifsc = '';
          this.__ifscbank = '';
          this.__ifscbranch = '';
          this.__ifscaddress = '';
          this.__ifsccity = '';
          this.neftPayRet.bene_ifsc_code = '';
          this.neftPayRet.brn_cd = this.sys.BranchCode;
          this.neftPayRet.trans_dt = this.sys.CurrentDate;
          this.neftPayRet.dr_acc_no=this.sys.NeftPayDrAcc;
          this.neftPayRet.date_of_payment=this.sys.CurrentDate;
          this.neftPayRet.charge_ded=0;
          this.neftPayRet.credit_narration='';
        }
        else {
          this.HandleMessage(true, MessageType.Error, 'Delete Failed!!!');
        }

      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, 'Delete Failed!!!');
      }
    );

  }

  approveData() {
    if (this.neftPayRet.trans_cd === 0 || this.neftPayRet.trans_cd == null) {
      this.HandleMessage(true, MessageType.Error, 'Retrieve a unapprove transaction first!!!');
      return;
    }
    if (this.neftPayRet.approval_status === 'A' && this.neftPayRet.trans_cd > 0) {
      this.HandleMessage(true, MessageType.Error, 'Already Approved Transaction!!!');
      return;
    }

    this.isRetrieve = true;
    this.isLoading = true;
    this.neftPayRet.approval_status = 'A';
    this.neftPayRet.approved_by = this.sys.UserId;
    this.neftPayRet.approved_dt = this.sys.CurrentDate;
    this.svc.addUpdDel<any>('Deposit/ApproveNeftPaymentTrans', this.neftPayRet).subscribe(
      res => {

        this.isLoading = false;
        if (res === 0) {
          this.HandleMessage(true, MessageType.Sucess, 'Approved Successfully!!!');
        }
        else {
          this.HandleMessage(true, MessageType.Error, 'Approve Failed!!!');
        }
      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, 'Approve Failed!!!');
      }
    );
  }

  setPaymentType(accType: string) {

    this.neftPayRet.payment_type = accType;
  }
  saveData() {

    if (this.neftPayRet.approval_status === 'A' && this.neftPayRet.trans_cd > 0) {
      this.HandleMessage(true, MessageType.Error, 'Already Approved Transaction!!!');
      return;
    }
    if (this.neftPayRet.payment_type == null || this.neftPayRet.payment_type === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Payment Type Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bene_name == null || this.neftPayRet.bene_name === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary Name Can not be Blank');
      return;
    }
    else if (this.neftPayRet.amount == null || this.neftPayRet.amount === 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount Can not be Blank');
      return;
    }
    else if (this.neftPayRet.date_of_payment == null) {
      this.HandleMessage(true, MessageType.Error, 'Date of Payment Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bene_acc_no == null || this.neftPayRet.bene_acc_no === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary Account No Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bene_ifsc_code == null || this.neftPayRet.bene_ifsc_code === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary IFSC Can not be Blank');
      return;
    }
    else if (this.neftPayRet.dr_acc_no == null || this.neftPayRet.dr_acc_no === 0) {
      this.HandleMessage(true, MessageType.Error, 'Dr. A/C No Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bank_dr_acc_type == null || this.neftPayRet.bank_dr_acc_type === 0) {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary A/C Type Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bank_dr_acc_no == null || this.neftPayRet.bank_dr_acc_no === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Bank Dr. A/C No Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bank_dr_acc_name == null || this.neftPayRet.bank_dr_acc_name === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Bank Dr. A/C name Can not be Blank');
      return;
    }
    else if (this.neftPayRet.credit_narration == null || this.neftPayRet.credit_narration === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Credit Narration Can not be Blank');
      return;
    }
    this.isRetrieve = true;

    this.neftPayRet.created_by = this.sys.UserId;
    this.neftPayRet.modified_by = this.sys.UserId;
    if (this.neftPayRet.trans_cd > 0) {
      this.svc.addUpdDel<any>('Deposit/UpdateNeftOutDtls', this.neftPayRet).subscribe(
        res => {

          this.isLoading = false;
          this.HandleMessage(true, MessageType.Sucess, 'Transaction Updated Successfully!!!');
        },
        err => {
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, 'Updated Failed!!!');
        }
      );

    }
    else {
      this.neftPayRet.approval_status = 'U';
      this.svc.addUpdDel<any>('Deposit/InsertNeftOutDtls', this.neftPayRet).subscribe(
        res => {

          this.neftPayRet.trans_cd = res;
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Sucess,
            'Transaction Saved Successfully. Trans Code : '
            + this.neftPayRet.trans_cd.toString());
        },
        err => {
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, 'Insert Failed!!!');
        }
      );
    }

  }
  suggestIfsc(ifscent : string): void {
debugger;

    if (ifscent.length > 3) {
      const ifscentred = ifscent;
      let neftPaySearch = new td_outward_payment();
      neftPaySearch.bene_ifsc_code = ifscentred.toUpperCase();
      this.isLoading = true;
      this.svc.addUpdDel<any>('Deposit/GetIfscCode', neftPaySearch).subscribe(
        res => {
debugger;
          this.isLoading = false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedIfsc = res.slice(0, 10);
          } else {
            this.suggestedIfsc = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedIfsc = null;
      this.isLoading = false;
    }
  }
  public SelectedIfsc(cust: any): void {
    this.__ifsc = '';
    this.__ifscbank = '';
    this.__ifscbranch = '';
    this.__ifscaddress = '';
    this.__ifsccity = '';
    this.neftPayRet.bene_ifsc_code = (cust.ifsc);
    this.__ifsc = cust.ifsc;
    this.__ifscbank = cust.bank;
    this.__ifscbranch = cust.branch;
    this.__ifscaddress = cust.address;
    this.__ifsccity = cust.city;
    this.suggestedIfsc = null;
  }


  backScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

  checkAndSetDebitAccType(tfrType: string) {
    this.HandleMessage(false);
    debugger;
    this.suggestedCustomer = null;
    if (tfrType.length === 1) {
      this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          debugger;
          this.accountTypeList = res;
          this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
          this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
          let temp_acc_type = new mm_acc_type();
          temp_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString()
            === tfrType)[0];

          if (temp_acc_type === undefined || temp_acc_type === null) {
            this.HandleMessage(true, MessageType.Error, 'Invalid Account Type');
            return;
          }
        },
        err => {
          this.HandleMessage(true, MessageType.Error, 'Invalid Account Type');
          return;
        }
      );

    }
    else if (tfrType.length > 1) {
      if (tfrType === this.sys.CashAccCode.toString()) {
        this.HandleMessage(true, MessageType.Error, this.sys.CashAccCode.toString() +
          ' cash acount code is not permissible.');
        return;
      }

        if (this.acc_master === undefined || this.acc_master === null || this.acc_master.length === 0) {
          this.isLoading = true;
          let temp_acc_master = new m_acc_master();
          this.svc.addUpdDel<any>('Mst/GetAccountMaster', null).subscribe(
            res => {
              ;
              this.acc_master = res;
              this.isLoading = false;
              temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tfrType)[0];
              if (temp_acc_master === undefined || temp_acc_master === null) {
                this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
                return;
              }
              else {
                this.neftPayRet.bank_dr_acc_no='0000';
                this.neftPayRet.bank_dr_acc_name=temp_acc_master.acc_name;
                this.neftPayRet.credit_narration='TRF FRM '+temp_acc_master.acc_name;
              }
            },
            err => {
              ;
              this.isLoading = false;
            }        
        );
      }
      else {
        let temp_acc_master = new m_acc_master();
        temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tfrType)[0];
        if (temp_acc_master === undefined || temp_acc_master === null) {
          this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
          return;
        }
        else {
          let temp_acc_master = new m_acc_master();
          temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tfrType)[0];
          if (temp_acc_master === undefined || temp_acc_master === null) {
            this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
            return;
          }
          else {
            this.neftPayRet.bank_dr_acc_no='0000';
            this.neftPayRet.bank_dr_acc_name=temp_acc_master.acc_name;
            this.neftPayRet.credit_narration='TRF FRM '+temp_acc_master.acc_name;
          }
        }
      }
    }

  }

  getAccountTypeList() {
    debugger;
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        debugger;
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {

      }
    );
  }

  public suggestCustomer(): void {
    if (this.neftPayRet.bank_dr_acc_type == null || this.neftPayRet.bank_dr_acc_type === 0) {
      this.HandleMessage(true, MessageType.Error, 'Bene A/C Type can not be Blank');
      return;
    }
    if (this.neftPayRet.bank_dr_acc_type > 1000) {
      this.neftPayRet.bank_dr_acc_no = '0000';
      this.HandleMessage(true, MessageType.Error, 'Please change Bene A/C Type First!!!');
      return;
    }
    if (this.neftPayRet.bank_dr_acc_no.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = +this.neftPayRet.bank_dr_acc_type;
      prm.as_cust_name = this.neftPayRet.bank_dr_acc_no.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res.slice(0, 10);
          } else {
            this.suggestedCustomer = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }
  public SelectCustomer(cust: any): void {
    this.neftPayRet.bank_dr_acc_no=cust.acc_num;
    this.neftPayRet.bank_dr_acc_name=cust.cust_name;
    this.neftPayRet.credit_narration='TRF FRM '+cust.cust_name;
    this.suggestedCustomer = null;
  }

}
