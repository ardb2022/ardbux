import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { mm_acc_type, SystemValues, tm_deposit, tm_depositall } from 'src/app/bank-resolver/Models';
import { RestService } from 'src/app/_service/rest.service';


@Component({
  selector: 'app-lien-acc-lock-unlock',
  templateUrl: './lien-acc-lock-unlock.component.html',
  styleUrls: ['./lien-acc-lock-unlock.component.css']
})
export class LienAccLockUnlockComponent implements OnInit {


  constructor(private svc: RestService,
    private router: Router,
    ) {   }

    alertMsgType: string;
    alertMsg: string;
    disabledAll = false;
    showAlert = false;
    isLoading = false;
    operationType: string;
    branchCode = '0';
    userName = '';
    sys = new SystemValues();


    accountTypeList: mm_acc_type[] = [];
    tm_deposit = new tm_deposit();
    tm_depositall = new tm_depositall();


    LockUnlockList = [
      { lockMode: 'L', lockModeDesc: 'Lock' },
      { lockMode: 'U', lockModeDesc: 'UnLock'  }
    ];


  ngOnInit(): void {

    this.branchCode = this.sys.BranchCode;
    this.userName = this.sys.UserId;
    this.getAccountTypeList();
  }


  getAccountTypeList() {
    ;
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];
    this.isLoading = true;
    debugger;

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }


  setAccountType(accType: number) {
    this.tm_depositall.acc_type_cd = Number(accType);
    this.tm_depositall.acc_type_desc = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;
  }

  setLockUnlockMode(lockTyp: string) {
    if(lockTyp == undefined || lockTyp == null)
    {
      lockTyp = 'U';
    }
    this.tm_depositall.lock_mode = lockTyp;
    this.tm_depositall.lock_mode_desc = this.LockUnlockList.filter(x => x.lockMode.toString() === lockTyp.toString())[0].lockModeDesc;
  }

  getAccountStatus()
  {
    debugger;
    this.tm_depositall.brn_cd = this.branchCode;
    var tmDepositAll :  tm_depositall [];
    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', this.tm_depositall).subscribe(
      res => {
        debugger;
        tmDepositAll = res;

        if (tmDepositAll == undefined || tmDepositAll == null || tmDepositAll.length == 0)
        {
          this.showAlertMsg('WARNING' , 'Account Details not found !!');
        }
        else
        {
        this.tm_depositall = tmDepositAll[0];
        this.setAccountType(this.tm_depositall.acc_type_cd);
        this.setLockUnlockMode(this.tm_depositall.lock_mode);
        this.operationType = 'Q'
        }

        this.isLoading = false;
      },
      err => {
        debugger;
        this.isLoading = false;
        this.showAlertMsg('WARNING' , 'Account Details not found !!');
      }
    );
  }

  public suggestCustomer(): void {

    }

    public setCustDtls(cust_cd: number): void {
    }

    public closeAlertMsg() {
      this.showAlert = false;
      this.disabledAll = false;
    }


    public showAlertMsg(msgTyp: string , msg: string) {
      this.alertMsgType = msgTyp;
      this.alertMsg     = msg;
      this.showAlert = true;
      this.disabledAll = true;
    }

    initializeModels()
    {
      this.tm_deposit = new tm_deposit();
      this.tm_depositall = new tm_depositall();
    }

    clearData()
    {
      this.operationType = '';
      this.initializeModels();
      this.closeAlertMsg();
    }

    retrieveData()
    {
      this.clearData();
      this.operationType = 'R';

    }

    modifyData() {
      if ( this.operationType !== 'Q' )
      {
        this.showAlertMsg('WARNING' , 'Record not retrived to modify');
        return;
      }
      this.operationType = 'U';

    }

  saveData() {
    if (this.operationType !== 'U') {
      this.showAlertMsg('WARNING', 'Record not updated to save');
      return;
    }
    else {
      debugger;
      this.tm_deposit.brn_cd = this.branchCode;
      this.tm_deposit.acc_num = this.tm_depositall.acc_num;
      this.tm_deposit.acc_type_cd = this.tm_depositall.acc_type_cd;
      this.tm_deposit.lock_mode = this.tm_depositall.lock_mode;
      this.tm_deposit.modified_by = this.userName;
      var ret = 0;
      this.isLoading = false;

      this.svc.addUpdDel<any>('Deposit/UpdateDepositLockUnlock', this.tm_deposit).subscribe(
        res => {
          debugger;
          ret = res;

          if (ret == 0) {
            this.showAlertMsg('WARNING', 'Record saved successfully !!');
          }
          else
          {
            this.showAlertMsg('WARNING', 'Record not saved !!');
          }

          this.isLoading = false;
        },
        err => {
          debugger;
          this.isLoading = false;
          this.showAlertMsg('WARNING', 'Record not saved !!');
        }
      );
    }


  }

    backScreen() {
      this.router.navigate([this.sys.BankName + '/la']);
    }


}
