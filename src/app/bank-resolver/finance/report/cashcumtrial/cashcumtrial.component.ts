import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RestService } from 'src/app/_service';
import { WebDataRocksPivot } from 'src/app/webdatarocks/webdatarocks.angular4';
import { tt_cash_account, p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { tt_cash_cum_trial } from 'src/app/bank-resolver/Models/tt_cash_cum_trial';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';

@Component({
  selector: 'app-cashcumtrial',
  templateUrl: './cashcumtrial.component.html',
  styleUrls: ['./cashcumtrial.component.css']
})
export class CashcumtrialComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('CashCumTrial') child: WebDataRocksPivot;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  cashcumtrial: tt_cash_cum_trial[] = [];
  prp =new p_report_param();
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
  todate:Date;
  constructor(private svc: RestService,private formBuilder: FormBuilder,
    private modalService: BsModalService,private _domSanitizer : DomSanitizer,
    private router: Router ) { }
  ngOnInit(): void {
    this.fromdate=this.sys.CurrentDate;
    this.todate=this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
  }
  private onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }


  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
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
      this.fromdate=this.reportcriteria.value['fromDate'];
      this.todate=this.reportcriteria.value['toDate'];
      //this.isLoading=true;
      //this.onReportComplete();
      // this.modalService.dismissAll(this.content);
      this.UrlString=this.svc.getReportUrl()
      this.UrlString=this.UrlString+"WebForm/Fin/cashcumtrail?"+"brn_cd="+this.sys.BranchCode+"&from_dt="+Utils.convertDtToString(this.fromdate)+"&to_dt="+Utils.convertDtToString(this.todate)
      ;
      this.isLoading = true;
      this.ReportUrl=this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString)
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 10000);
    }
  }
  public oniframeLoad(): void {
    this.isLoading = false;
    this.modalRef.hide();
  }
  public closeAlert() {
    this.showAlert = false;
  }
  //private pdfmake : pdfMake;
  onPivotReady(CashCumTrial: WebDataRocksPivot): void {
    console.log("[ready] WebDataRocksPivot", this.child);
  }


  onReportComplete(): void {
    ;
    if (!this.isLoading)return ;
    this.prp.brn_cd=this.sys.BranchCode;
    this.prp.from_dt= this.fromdate;
    this.prp.to_dt=this.todate;
    let fdate = new Date(this.fromdate);
    let tdate = new Date(this.todate);
    this.fd = (("0" + fdate.getDate()).slice(-2)) + "/" + (("0" + (fdate.getMonth() + 1)).slice(-2)) + "/" + (fdate.getFullYear());
    this.td = (("0" + tdate.getDate()).slice(-2)) + "/" + (("0" + (tdate.getMonth() + 1)).slice(-2)) + "/" + (tdate.getFullYear());
    this.dt = new Date();
    this.dt = (("0" + this.dt.getDate()).slice(-2)) + "/" + (("0" + (this.dt.getMonth() + 1)).slice(-2)) + "/" + (this.dt.getFullYear()) + " " + this.dt.getHours() + ":" + this.dt.getMinutes();
    this.child.webDataRocks.off("reportcomplete");
    this.svc.addUpdDel<any>('Report/PopulateCashCumTrial',this.prp).subscribe(
      (data: tt_cash_cum_trial[]) => this.cashcumtrial = data,
      error => { console.log(error); },
      () => {
          ;
          //this.showReport = true;
         // this.generatePdf();
         this.isLoading=false;
         let totalCr=0;
         let totalDr=0;
         let tmp_cash_account=new tt_cash_cum_trial();
         this.child.webDataRocks.setReport({
          dataSource: {
             data:this.cashcumtrial
          },
          tableSizes: {
            columns: [
              {
                idx: 0,
                width: 75
              },
              {
                idx: 1,
                width: 200
              },
              {
                idx: 2,
                width: 80
              },
              {
                idx: 3,
                width: 80
              },
              {
                idx: 4,
                width: 80
              },
              {
                idx: 5,
                width: 80
              },
              {
                idx: 6,
                width: 80
              },
              {
                idx: 7,
                width: 80
              }
            ]
          },
          "options": {
            "grid": {
                "type": "flat",
                "showTotals": "off",
                "showGrandTotals": "off"
            }
            },
            "slice": {
              "rows": [
                  {
                      "uniqueName": "acc_cd",
                      "caption": "Account Code",
                      "sort": "unsorted"

                  },
                  {
                      "uniqueName": "acc_name",
                      "caption": "Account Name",
                      "sort": "unsorted"
                  },
                  {
                      "uniqueName": "opng_dr",
                      "caption": "Opening Debit",
                      "sort": "unsorted"
                  },
                  {
                    "uniqueName": "opng_cr",
                    "caption": "Opening Credit",
                      "sort": "unsorted"
                },
                {
                    "uniqueName": "dr",
                    "caption": "Debit During Period",
                      "sort": "unsorted"
                },
                {
                    "uniqueName": "cr",
                    "caption": "Credit During Perion",
                      "sort": "unsorted"
                },
                {
                  "uniqueName": "clos_dr",
                  "caption": "Closing Debit",
                    "sort": "unsorted"
              },
              {
                "uniqueName": "clos_cr",
                "caption": "Closing Credit",
                  "sort": "unsorted"
            }
              ],
              "measures": [
                {
                  uniqueName: "acc_cd",
                  format: "decimal0"
                }],
              "flatOrder": [
                  "Account Code",
                  "Account Name",
                  "Opening Debit",
                  "Opening Credit",
                  "Debit During Period",
                  "Credit During Period",
                  "Closing Debit",
                  "Closing Credit"
              ]
          },

            "formats": [{
              "name": "",
              "thousandsSeparator": ",",
              "decimalSeparator": ".",
              "decimalPlaces": 2,
              "maxSymbols": 20,
              "currencySymbol": "",
              "currencySymbolAlign": "left",
              "nullValue": " ",
              "infinityValue": "Infinity",
              "divideByZeroValue": "Infinity"
          },
          {
            name: "decimal0",
            decimalPlaces: 0,
            thousandsSeparator: "",
            textAlign:"left"
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
  var options = this.child.webDataRocks.getOptions();
  this.child.webDataRocks.setOptions( {
    grid: {
      title: 'Cash Cum Trial Balance For The Period ' +this.fd +'-' +this.td
    }
  }
  );
  this.child.webDataRocks.refresh();
  this.child.webDataRocks.exportTo('pdf', { pageOrientation:'potrait',header:"<div>##CURRENT-DATE##&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Synergic Banking&emsp;&emsp;&emsp;Branch : "+localStorage.getItem('__brnName')+"<br>&nbsp</div>",filename:"CashCumTrial"});
  this.child.webDataRocks.on('exportcomplete', function () {
    this.child.webDataRocks.off('exportcomplete')
    this.child.webDataRocks.setOptions(options);
    this.child.webDataRocks.refresh();
  });
}

closeScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}

}
