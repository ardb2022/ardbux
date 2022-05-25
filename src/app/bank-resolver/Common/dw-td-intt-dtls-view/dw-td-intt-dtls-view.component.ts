import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestService, InAppMessageService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { td_intt_dtls, tm_deposit } from '../../Models';

@Component({
  selector: 'app-dw-td-intt-dtls-view',
  templateUrl: './dw-td-intt-dtls-view.component.html',
  styleUrls: ['./dw-td-intt-dtls-view.component.css']
})
export class DwTdInttDtlsViewComponent implements OnInit, OnDestroy {

  constructor(private svc: RestService, private msg: InAppMessageService) {
    this.subscription = this.msg.getCommonAcctInfo().subscribe(
      res => {
        if (null !== res && undefined !== res &&
          res.cust_cd !== 0) {
          this.acctDtls = res;
          this.getInterestList();
        } else {
          this.interestDetails = [];
        }

      },
      err => { }
    );
  }
  subscription: Subscription;
  acctDtls: tm_deposit;
  interestDetails: td_intt_dtls[] = [];

  ngOnInit(): void {
  }

  private getInterestList() {
    if (undefined !== this.acctDtls &&
      null !== this.acctDtls) {
      const tdIntDtl = new td_intt_dtls();
      tdIntDtl.acc_type_cd = this.acctDtls.acc_type_cd;
      tdIntDtl.acc_num = this.acctDtls.acc_num;
      this.svc.addUpdDel<any>('Deposit/GetInttDetails', tdIntDtl).subscribe(
        res => {
          debugger;
          this.interestDetails = Utils.ChkArrNotEmptyRetrnEmptyArr(res);
        },
        err => { }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
