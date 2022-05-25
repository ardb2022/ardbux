import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WebDataRocksPivot } from 'src/app/webdatarocks/webdatarocks.angular4';
import { p_report_param, SystemValues, tt_cash_cum_trial, tt_gl_trans } from 'src/app/bank-resolver/Models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestService } from 'src/app/_service';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';

@Component({
  selector: 'app-gen-ledger2',
  templateUrl: './gen-ledger2.component.html',
  styleUrls: ['./gen-ledger2.component.css']
})
export class GenLedger2Component implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('GenLedgerDtl') child: WebDataRocksPivot;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  genLdgerTrans: tt_gl_trans[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  isLoading = false;
  showAlert = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  urlToCall: '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  constructor(private svc: RestService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private _domSanitizer : DomSanitizer,
    private router: Router) { }

  ngOnInit(): void {
    this.fromdate=this.sys.CurrentDate;
    this.todate=this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      fromAcc: [null, Validators.required],
      toAcc: [null, Validators.required],
    });
    this.onLoadScreen(this.content);
  }

  get r() { return this.reportcriteria.controls; }

  private onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }



  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else if (new Date(this.r.fromDate.value) > new Date(this.r.toDate.value)) {
      this.showAlert = true;
      this.alertMsg = 'To Date cannot be greater than From Date!';
      return false;
    }
    else {
      this.showAlert = false;
      this.fromdate=this.reportcriteria.value['fromDate'];
      this.todate=this.reportcriteria.value['toDate'];
      this.UrlString=this.svc.getReportUrl()
      this.UrlString=this.UrlString+"WebForm/Fin/generalledgerdtls?"+"brn_cd="+this.sys.BranchCode+"&adt_from_dt="+Utils.convertDtToString(this.fromdate)+"&adt_to_dt="+Utils.convertDtToString(this.todate)+"&ad_from_acc_cd="+parseInt(this.reportcriteria.value['fromAcc'])+"&ad_to_acc_Cd="+parseInt (this.reportcriteria.value['toAcc'])
      ;
      this.isLoading = true;
      this.ReportUrl=this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString)
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 4000);
    }
  }

  public oniframeLoad(): void {
    this.isLoading = false;
    this.modalRef.hide();
  }

  public closeAlert() {
    this.showAlert = false;
  }
  // private pdfmake : pdfMake;
  onPivotReady(GenLedgerDtl: WebDataRocksPivot): void {
    console.log('[ready] WebDataRocksPivot', this.child);
  }


  onReportComplete(): void {
    ;
    if (!this.isLoading)return ;
    this.prp.brn_cd = this.sys.BranchCode;
    this.prp.from_dt = this.fromdate;
    this.prp.to_dt = this.todate;
    this.prp.ad_from_acc_cd = parseInt(this.r.fromAcc.value);
    this.prp.ad_to_acc_Cd = parseInt(this.r.toAcc.value);
    const fdate = new Date(this.fromdate);
    const tdate = new Date(this.todate);
    this.fd = (('0' + fdate.getDate()).slice(-2)) + '/' + (('0' + (fdate.getMonth() + 1)).slice(-2)) + '/' + (fdate.getFullYear());
    this.td = (('0' + tdate.getDate()).slice(-2)) + '/' + (('0' + (tdate.getMonth() + 1)).slice(-2)) + '/' + (tdate.getFullYear());
    this.dt = new Date();
    this.dt = (('0' + this.dt.getDate()).slice(-2)) + '/' + (('0' + (this.dt.getMonth() + 1)).slice(-2)) + '/' + (this.dt.getFullYear()) + ' ' + this.dt.getHours() + ':' + this.dt.getMinutes();
    this.child.webDataRocks.off('reportcomplete');
    // Api call to get data
    this.svc.addUpdDel<any>('Report/GLTD2', this.prp).subscribe(
      (data: tt_gl_trans[]) => {
        this.genLdgerTrans = data;
        ;
      },
      error => { console.log(error); },
      () => {
        this.isLoading = false;
        ;
        this.child.webDataRocks.setReport({
          dataSource: {
            data: this.genLdgerTrans
          },
          tableSizes: {
            columns: [
              {
                idx: 0,
                width: 105
              },
              {
                idx: 1,
                width: 105
              },
              {
                idx: 2,
                width: 105
              },
              {
                idx: 3,
                width: 105
              },
              {
                idx: 4,
                width: 105
              },
              {
                idx: 5,
                width: 105
              },
              {
                idx: 6,
                width: 105
              }
            ]
          },
          options: {
            grid: {
              type: 'flat',
              showTotals: 'off',
              showGrandTotals: 'off'
            }
          },
          slice: {
            rows: [
              {
                uniqueName: 'acc_cd',
                caption: 'Account Code',
                sort: 'unsorted'

              },
              {
                uniqueName: 'voucher_dt',
                caption: 'Voucher Date',
                sort: 'unsorted'
              },
              {
                uniqueName: 'dr_amt',
                caption: 'Debit Amount',
                sort: 'unsorted'
              },
              {
                uniqueName: 'cr_amt',
                caption: 'Credit Amount',
                sort: 'unsorted'
              },
              {
                uniqueName: 'trans_month',
                caption: 'Month of Transaction',
                sort: 'unsorted'
              },
              {
                uniqueName: 'trans_year',
                caption: 'Year of Transaction',
                sort: 'unsorted'
              },
              {
                uniqueName: 'opng_bal',
                caption: 'Opening Balance',
                sort: 'unsorted'
              }
            ],
            measures: [
              {
                uniqueName: 'acc_cd'
              }],
            flatOrder: [
              'Account Code',
              'Voucher Dt',
              'Debit Amount',
              'Credit Amount',
              'Month of Transaction',
              'Year of Transaction',
              'Opening Balance'
            ]
          },

          formats: [{
            name: '',
            thousandsSeparator: ',',
            decimalSeparator: '.',
            decimalPlaces: 2,
            maxSymbols: 20,
            currencySymbol: '',
            currencySymbolAlign: 'left',
            nullValue: ' ',
            infinityValue: 'Infinity',
            divideByZeroValue: 'Infinity'
          },
          {
            name: 'decimal0',
            decimalPlaces: 0,
            thousandsSeparator: '',
            textAlign: 'left'
          }
          ]
        });
        this.modalRef.hide();
      }
    );
  }

  setOption(option, value) {
    this.child.webDataRocks.setOptions({
      grid: {
        [option]: value
      }
    });
    ;
    this.child.webDataRocks.refresh();
  }

  exportPDFTitle() {
    const options = this.child.webDataRocks.getOptions();
    this.child.webDataRocks.setOptions({
      grid: {
        title: 'Cash Cum Trial Balance For The Period ' + this.fd + '-' + this.td
      }
    }
    );
    this.child.webDataRocks.refresh();
    this.child.webDataRocks.exportTo('pdf', { pageOrientation:'potrait',header:"<div>##CURRENT-DATE##&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Synergic Banking&emsp;&emsp;&emsp;Branch : "+localStorage.getItem('__brnName')+"<br>&nbsp</div>",filename:"GeneralLedgerTransactions"});
    this.child.webDataRocks.on('exportcomplete', function () {
      this.child.webDataRocks.off('exportcomplete');
      this.child.webDataRocks.setOptions(options);
      this.child.webDataRocks.refresh();
    });
  }
  closeScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}


}
