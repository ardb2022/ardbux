import { SystemValues } from './../../../Models/SystemValues';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RestService } from 'src/app/_service';
import { WebDataRocksPivot } from 'src/app/webdatarocks/webdatarocks.angular4';
import { tt_cash_account, p_report_param } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';

@Component({
  selector: 'app-dailybook',
  templateUrl: './dailybook.component.html',
  styleUrls: ['./dailybook.component.css']
})
export class DailybookComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('DailyCashBook') child: WebDataRocksPivot;
  //ReportUrl :SafeResourceUrl;
  //UrlString:string ="http://localhost:63011/"
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  //UrlString = 'http://36.255.3.143/Report/DayBookViewer?';
  //UrlString = 'http://36.255.3.143/Report/DayBookViewer?brn_cd=101&from_dt=20/01/2019&to_dt=31/03/2021&acc_cd=28101';
  // Modal configuration
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  bsInlineValue = new Date();
  maxDate = new Date();
  dailyCash: tt_cash_account[] = [];
  prp = new p_report_param();
  sys = new SystemValues();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  isLoading = false;
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService,private _domSanitizer : DomSanitizer
    // private modalService: NgbModal,
    , private router: Router) {  }
  ngOnInit(): void {
    ;
    this.fromdate = this.sys.CurrentDate; // new Date(localStorage.getItem('__currentDate'));
    this.todate = this.sys.CurrentDate; // new Date(localStorage.getItem('__currentDate'));
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }



  private onLoadScreen(content) {
    // this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    // },
    //   (reason) => {
    //     this.closeResult = 'Dismissed ${this.getDismissReason(reason)}';
    //   });
    this.modalRef = this.modalService.show(content, this.config);
  }
  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }

  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.alertMsg = "Invalid Input.";
      return false;
    }
    else if (new Date(this.reportcriteria.value['fromDate']) > new Date(this.reportcriteria.value['toDate'])) {
      this.showAlert = true;
      this.alertMsg = "To Date cannot be greater than From Date!";
      return false;
    }
    else {
      this.showAlert = false;
      this.fromdate = this.reportcriteria.value['fromDate'];
      this.todate = this.reportcriteria.value['toDate'];
      //this.isLoading = true;
      //this.onReportComplete();
      // this.modalService.dismissAll(this.content);
      this.UrlString=this.svc.getReportUrl()
      this.UrlString=this.UrlString+"WebForm/Fin/DayBookViewer?"+"brn_cd="+this.sys.BranchCode+"&from_dt="+Utils.convertDtToString(this.fromdate)+"&to_dt="+Utils.convertDtToString(this.todate)+"&acc_cd="+localStorage.getItem('__cashaccountCD')
      ;
      this.isLoading = true;
      this.ReportUrl=this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString)
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 3000);
    }
  }
  public oniframeLoad(): void {
    this.isLoading = false;
    this.modalRef.hide();
  }

  public closeAlert() {
    this.showAlert = false;
  }
  onPivotReady(DailyCashBook: WebDataRocksPivot): void {
    console.log("[ready] WebDataRocksPivot", this.child);
  }

  onReportComplete(): void {
    ;
    if (!this.isLoading) return;
    this.prp.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    this.prp.from_dt = this.fromdate;
    this.prp.to_dt = this.todate;
    this.prp.acc_cd = parseInt(localStorage.getItem('__cashaccountCD'));
    //this.ReportUrl=this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString)
    // let fdate = new Date(this.fromdate);
    // let tdate = new Date(this.todate);
    // this.fd = (("0" + fdate.getDate()).slice(-2)) + "/" + (("0" + (fdate.getMonth() + 1)).slice(-2)) + "/" + (fdate.getFullYear());
    // this.td = (('0' + tdate.getDate()).slice(-2)) + '/' + (("0" + (tdate.getMonth() + 1)).slice(-2)) + "/" + (tdate.getFullYear());
    // this.dt = new Date();
    // this.dt = (('0' + this.dt.getDate()).slice(-2)) + '/' + (('0' + (this.dt.getMonth() + 1)).slice(-2)) + "/" + (this.dt.getFullYear()) + " " + this.dt.getHours() + ":" + this.dt.getMinutes();
    // this.child.webDataRocks.off('reportcomplete');
    // this.svc.addUpdDel<any>('Report/PopulateDailyCashBook', this.prp).subscribe(
    //   (data: tt_cash_account[]) => this.dailyCash = data,
    //   error => { console.log(error); },
    //   () => {
    //     ;
    //     let totalCr = 0;
    //     let totalDr = 0;
    //     let tmp_cash_account = new tt_cash_account();
    //     this.dailyCash.forEach(x => totalCr += x.cr_amt);
    //     this.dailyCash.forEach(x => totalDr += x.dr_amt);
    //     this.dailyCash.forEach(x => x.cr_acc_cd = (x.cr_acc_cd == '0' ? '' : '' + x.cr_acc_cd.toString()));
    //     this.dailyCash.forEach(x => x.dr_acc_cd = (x.dr_acc_cd == '0' ? '' : '' + x.dr_acc_cd.toString()));
    //     this.dailyCash.forEach(x => x.dr_amt = (x.dr_amt == 0.00 ? null : x.dr_amt));
    //     this.dailyCash.forEach(x => x.cr_amt = (x.cr_amt == 0.00 ? null : x.cr_amt));
    //     this.dailyCash.forEach(x => x.dr_particulars = (x.dr_particulars == null ? ' ' : x.dr_particulars));
    //     this.dailyCash.forEach(x => x.cr_particulars = (x.cr_particulars == null ? ' ' : x.cr_particulars));
    //     tmp_cash_account.cr_amt = totalCr;
    //     tmp_cash_account.dr_amt = totalDr;
    //     tmp_cash_account.dr_particulars = 'Total Debit: ';
    //     tmp_cash_account.cr_particulars = 'Total Credit: ';
    //     this.dailyCash.push(tmp_cash_account);
    //     this.isLoading = false;
    //     this.child.webDataRocks.setReport({
    //       dataSource: {
    //         data: this.dailyCash
    //       },
    //       tableSizes: {
    //         columns: [
    //           {
    //             idx: 0,
    //             width: 75
    //           },
    //           {
    //             idx: 1,
    //             width: 200
    //           },
    //           {
    //             idx: 2,
    //             width: 100
    //           },
    //           {
    //             idx: 3,
    //             width: 75
    //           },
    //           {
    //             idx: 4,
    //             width: 200
    //           },
    //           {
    //             idx: 5,
    //             width: 100
    //           }
    //         ]
    //       },
    //       "options": {
    //         "grid": {
    //           "type": "flat",
    //           "showTotals": "off",
    //           "showGrandTotals": "off"
    //         }
    //       },
    //       "slice": {
    //         "rows": [
    //           {
    //             "uniqueName": "dr_acc_cd",
    //             "caption": "Debit",
    //             "sort": "unsorted"

    //           },
    //           {
    //             "uniqueName": "dr_particulars",
    //             "caption": "Dr Description",
    //             "sort": "unsorted"
    //           },
    //           {
    //             "uniqueName": "dr_amt",
    //             "caption": "Dr Amount",
    //             "sort": "unsorted"
    //           },
    //           {
    //             "uniqueName": "cr_acc_cd",
    //             "caption": "Credit",
    //             "sort": "unsorted"
    //           },
    //           {
    //             "uniqueName": "cr_particulars",
    //             "caption": "Cr Description",
    //             "sort": "unsorted"
    //           },
    //           {
    //             "uniqueName": "cr_amt",
    //             "caption": "Cr Amount",
    //             "sort": "unsorted"
    //           }
    //         ],
    //         "measures": [
    //           {
    //             uniqueName: "dr_acc_cd",
    //             format: "decimal0"
    //           },
    //           {
    //             uniqueName: "cr_acc_cd",
    //             format: "decimal0"
    //           }],
    //         "flatOrder": [
    //           "Debit",
    //           "Dr Description",
    //           "Dr Amount",
    //           "Credit",
    //           "Cr Description",
    //           "Cr Amount",
    //         ]
    //       },

    //       "formats": [{
    //         "name": "",
    //         "thousandsSeparator": ",",
    //         "decimalSeparator": ".",
    //         "decimalPlaces": 2,
    //         "maxSymbols": 20,
    //         "currencySymbol": "",
    //         "currencySymbolAlign": "left",
    //         "nullValue": " ",
    //         "infinityValue": "Infinity",
    //         "divideByZeroValue": "Infinity"
    //       },
    //       {
    //         name: "decimal0",
    //         decimalPlaces: 0,
    //         thousandsSeparator: "",
    //         textAlign: "left"
    //       }
    //       ]
    //     });
    //     // close the modal
    //     this.modalRef.hide();
    //   }
    // );
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
  closeScreen() {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  exportPDFTitle() {
    var options = this.child.webDataRocks.getOptions();
    this.child.webDataRocks.setOptions({
      grid: {
        title: 'Day Book For The Period ' + this.fd + '-' + this.td
      }
    }
    );
    let brnName = "Main Branch";
    this.child.webDataRocks.refresh();
    this.child.webDataRocks.exportTo('pdf', { pageOrientation: 'potrait', header: "<div>##CURRENT-DATE##&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Synergic Banking&emsp;&emsp;&emsp;Branch : " + localStorage.getItem('__brnName') + "<br>&nbsp</div>", filename: "DayBook" });
    this.child.webDataRocks.on('exportcomplete', function () {
      this.child.webDataRocks.off('exportcomplete')
      this.child.webDataRocks.setOptions(options);
      this.child.webDataRocks.refresh();
    });
  }



}
