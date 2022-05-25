import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { RestService } from 'src/app/_service';
import { WebDataRocksPivot } from 'src/app/webdatarocks/webdatarocks.angular4';
import { tt_cash_account, p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';


@Component({
  selector: 'app-cashaccount',
  templateUrl: './cashaccount.component.html',
  styleUrls: ['./cashaccount.component.css']
})
export class CashaccountComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('CashAccount') child: WebDataRocksPivot;
  @ViewChild('external') external: ElementRef;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  // bsInlineValue = new Date();
  dailyCash: tt_cash_account[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  called = 0;
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,
    private router: Router) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate; // new Date(localStorage.getItem('__currentDate'));
    this.todate = this.sys.CurrentDate; // new Date(localStorage.getItem('__currentDate'));
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
  }

  ngAfterViewInit() {
    this.external.nativeElement.o();
  }

  private onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }


  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else if (new Date(this.reportcriteria.value.fromDate) > new Date(this.reportcriteria.value.toDate)) {
      this.showAlert = true;
      this.alertMsg = 'To Date cannot be greater than From Date!';
      return false;
    }
    else {
      this.showAlert = false;
      this.fromdate = this.reportcriteria.value.fromDate;
      this.todate = this.reportcriteria.value.toDate;
      // this.isLoading=true;
      // this.onReportComplete();
      // this.modalService.dismissAll(this.content);
      this.UrlString = this.svc.getReportUrl();
      this.UrlString = this.UrlString + 'WebForm/Fin/cashaccount?' + 'brn_cd=' + this.sys.BranchCode + '&from_dt=' + Utils.convertDtToString(this.fromdate) + '&to_dt=' + Utils.convertDtToString(this.todate) + '&acc_cd=' + localStorage.getItem('__cashaccountCD')
        ;
      this.isLoading = true;
      this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString); // 20/01/2019
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 3000);
    }
  }
  public oniframeLoad(): void {
    this.isLoading = false;
    this.modalRef.hide();
    // if (this.called > 0) {
    //   this.isLoading = false;
    //   this.modalRef.hide();
    // } else {
    //   this.called = this.called + 1;
    // }
  }

  public closeAlert() {
    this.showAlert = false;
  }
  // private pdfmake : pdfMake;
  onPivotReady(CashAccount: WebDataRocksPivot): void {
    console.log('[ready] WebDataRocksPivot', this.child);
  }



  // onReportComplete(): void {
  //   ;
  //   if (!this.isLoading) { return; }
  //   this.prp.brn_cd = this.sys.BranchCode;
  //   this.prp.from_dt = this.fromdate;
  //   this.prp.to_dt = this.todate;
  //   this.prp.acc_cd = 28101;
  //   const fdate = new Date(this.fromdate);
  //   const tdate = new Date(this.todate);
  //   this.fd = (('0' + fdate.getDate()).slice(-2)) + '/' + (('0' + (fdate.getMonth() + 1)).slice(-2)) + '/' + (fdate.getFullYear());
  //   this.td = (('0' + tdate.getDate()).slice(-2)) + '/' + (('0' + (tdate.getMonth() + 1)).slice(-2)) + '/' + (tdate.getFullYear());
  //   this.dt = new Date();
  //   this.dt = (('0' + this.dt.getDate()).slice(-2)) + '/' + (('0' + (this.dt.getMonth() + 1)).slice(-2)) + '/' + (this.dt.getFullYear()) + ' ' + this.dt.getHours() + ':' + this.dt.getMinutes();
  //   this.child.webDataRocks.off('reportcomplete');
  //   this.svc.addUpdDel<any>('Report/PopulateDailyCashBook', this.prp).subscribe(
  //     (data: tt_cash_account[]) => this.dailyCash = data,
  //     error => { console.log(error); },
  //     () => {
  //       ;
  //       this.isLoading = false;
  //       let totalCr = 0;
  //       let totalDr = 0;
  //       const tmp_cash_account = new tt_cash_account();
  //       this.dailyCash.forEach(x => totalCr += x.cr_amt);
  //       this.dailyCash.forEach(x => totalDr += x.dr_amt);
  //       this.dailyCash.forEach(x => x.cr_acc_cd = (x.cr_acc_cd == '0' ? '' : '' + x.cr_acc_cd.toString()));
  //       this.dailyCash.forEach(x => x.dr_acc_cd = (x.dr_acc_cd == '0' ? '' : '' + x.dr_acc_cd.toString()));
  //       this.dailyCash.forEach(x => x.dr_amt = (x.dr_amt == 0.00 ? null : x.dr_amt));
  //       this.dailyCash.forEach(x => x.cr_amt = (x.cr_amt == 0.00 ? null : x.cr_amt));
  //       this.dailyCash.forEach(x => x.dr_particulars = (x.dr_particulars == null ? ' ' : x.dr_particulars));
  //       this.dailyCash.forEach(x => x.cr_particulars = (x.cr_particulars == null ? ' ' : x.cr_particulars));
  //       tmp_cash_account.cr_amt = totalCr;
  //       tmp_cash_account.dr_amt = totalDr;
  //       tmp_cash_account.dr_particulars = 'Total Debit: ';
  //       tmp_cash_account.cr_particulars = 'Total Credit: ';
  //       this.dailyCash.push(tmp_cash_account);
  //       this.child.webDataRocks.setReport({
  //         dataSource: {
  //           data: this.dailyCash
  //         },
  //         tableSizes: {
  //           columns: [
  //             {
  //               idx: 0,
  //               width: 75
  //             },
  //             {
  //               idx: 1,
  //               width: 200
  //             },
  //             {
  //               idx: 2,
  //               width: 100
  //             },
  //             {
  //               idx: 3,
  //               width: 75
  //             },
  //             {
  //               idx: 4,
  //               width: 200
  //             },
  //             {
  //               idx: 5,
  //               width: 100
  //             }
  //           ]
  //         },
  //         'options': {
  //           'grid': {
  //             'type': 'flat',
  //             'showTotals': 'off',
  //             'showGrandTotals': 'off'
  //           }
  //         },
  //         'slice': {
  //           'rows': [
  //             {
  //               'uniqueName': 'dr_acc_cd',
  //               'caption': 'Debit',
  //               'sort': 'unsorted'

  //             },
  //             {
  //               'uniqueName': 'dr_particulars',
  //               'caption': 'Dr Description',
  //               'sort': 'unsorted'
  //             },
  //             {
  //               'uniqueName': 'dr_amt',
  //               'caption': 'Dr Amount',
  //               'sort': 'unsorted'
  //             },
  //             {
  //               'uniqueName': 'cr_acc_cd',
  //               'caption': 'Credit',
  //               'sort': 'unsorted'
  //             },
  //             {
  //               'uniqueName': 'cr_particulars',
  //               'caption': 'Cr Description',
  //               'sort': 'unsorted'
  //             },
  //             {
  //               'uniqueName': 'cr_amt',
  //               'caption': 'Cr Amount',
  //               'sort': 'unsorted'
  //             }
  //           ],
  //           'measures': [
  //             {
  //               uniqueName: 'dr_acc_cd',
  //               format: 'decimal0'
  //             },
  //             {
  //               uniqueName: 'cr_acc_cd',
  //               format: 'decimal0'
  //             }],
  //           'flatOrder': [
  //             'Debit',
  //             'Dr Description',
  //             'Dr Amount',
  //             'Credit',
  //             'Cr Description',
  //             'Cr Amount',
  //           ]
  //         },

  //         'formats': [{
  //           'name': '',
  //           'thousandsSeparator': ',',
  //           'decimalSeparator': '.',
  //           'decimalPlaces': 2,
  //           'maxSymbols': 20,
  //           'currencySymbol': '',
  //           'currencySymbolAlign': 'left',
  //           'nullValue': ' ',
  //           'infinityValue': 'Infinity',
  //           'divideByZeroValue': 'Infinity'
  //         },
  //         {
  //           name: 'decimal0',
  //           decimalPlaces: 0,
  //           thousandsSeparator: '',
  //           textAlign: 'left'
  //         }
  //         ]
  //       });
  //       this.modalRef.hide();
  //     }
  //   );
  // }

  setOption(option, value) {
    this.child.webDataRocks.setOptions({
      grid: {
        [option]: value
      }
    });

    this.child.webDataRocks.refresh();
  }

  exportPDFTitle() {
    const options = this.child.webDataRocks.getOptions();
    this.child.webDataRocks.setOptions({
      grid: {
        title: 'Cash Account For The Period ' + this.fd + '-' + this.td
      }
    }
    );
    this.child.webDataRocks.refresh();
    this.child.webDataRocks.exportTo('pdf', { pageOrientation: 'potrait', header: '<div>##CURRENT-DATE##&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Synergic Banking&emsp;&emsp;&emsp;Branch : ' + localStorage.getItem('__brnName') + '<br>&nbsp</div>', filename: 'CashAccount' });

    this.child.webDataRocks.on('exportcomplete', function () {
      this.child.webDataRocks.off('exportcomplete');
      this.child.webDataRocks.setOptions(options);
      this.child.webDataRocks.refresh();
    });
  }


  closeScreen() {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }


}
