import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { tt_scroll_book } from 'src/app/bank-resolver/Models/tt_scroll_book';
import { WebDataRocksPivot } from 'src/app/webdatarocks/webdatarocks.angular4';
import { RestService } from 'src/app/_service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';

@Component({
  selector: 'app-scrollbook',
  templateUrl: './scrollbook.component.html',
  styleUrls: ['./scrollbook.component.css']
})
export class ScrollbookComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('CashScroll') child: WebDataRocksPivot;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  scrollbook: tt_scroll_book[] = [];
  prp =new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate:Date;
  isLoading = false;
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
      this.UrlString=this.svc.getReportUrl()
      this.UrlString=this.UrlString+"WebForm/Fin/dayscrollbook?"+"as_brn_cd="+this.sys.BranchCode+"&adt_from_dt="+Utils.convertDtToString(this.fromdate)+"&adt_to_dt="+Utils.convertDtToString(this.todate)
      ;
      this.isLoading = true;
      this.ReportUrl=this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString)
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 5000);
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
    if (!this.isLoading)return ;
    this.prp.brn_cd=this.sys.BranchCode;
    this.prp.from_dt= this.fromdate;
    this.prp.to_dt=this.todate;
    this.prp.acc_cd=parseInt(localStorage.getItem('__cashaccountCD'));
    let fdate = new Date(this.fromdate);
    let tdate = new Date(this.todate);
    this.fd = (("0" + fdate.getDate()).slice(-2)) + "/" + (("0" + (fdate.getMonth() + 1)).slice(-2)) + "/" + (fdate.getFullYear());
    this.td = (("0" + tdate.getDate()).slice(-2)) + "/" + (("0" + (tdate.getMonth() + 1)).slice(-2)) + "/" + (tdate.getFullYear());
    this.dt = new Date();
    this.dt = (("0" + this.dt.getDate()).slice(-2)) + "/" + (("0" + (this.dt.getMonth() + 1)).slice(-2)) + "/" + (this.dt.getFullYear()) + " " + this.dt.getHours() + ":" + this.dt.getMinutes();
    this.child.webDataRocks.off("reportcomplete");
    this.svc.addUpdDel<any>('Report/PopulateDayScrollBook',this.prp).subscribe(
      (data: tt_scroll_book[]) => this.scrollbook = data,
      error => { console.log(error); },
      () => {
          ;
         let totalCr=0;
         let totalDr=0;
         let tmp_cash_account=new tt_scroll_book();
         this.isLoading=false;
         this.child.webDataRocks.setReport({
          dataSource: {
             data:this.scrollbook
          },
          tableSizes: {
            columns: [
              {
                idx: 0,
                width: 80
              },
              {
                idx: 1,
                width: 80
              },
              {
                idx: 2,
                width: 80
              },
              {
                idx: 3,
                width: 200
              },
              {
                idx: 4,
                width: 100
              },
              {
                idx: 5,
                width: 100
              },
              {
                idx: 6,
                width: 100
              },
              {
                idx: 7,
                width: 100
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
                      "uniqueName": "trans_cd",
                      "caption": "Trans CD",
                      "sort": "unsorted"

                  },
                  {
                      "uniqueName": "voucher_id",
                      "caption": "Voucher ID",
                      "sort": "unsorted"
                  },
                  {
                      "uniqueName": "acc_num",
                      "caption": "Account Num",
                      "sort": "unsorted"
                  },
                  {
                    "uniqueName": "cust_narration",
                    "caption": "Head Of A/Cs",
                      "sort": "unsorted"
                },
                {
                    "uniqueName": "cash_pay",
                    "caption": "Pay Cash",
                      "sort": "unsorted"
                },
                {
                    "uniqueName": "trf_pay",
                    "caption": "Pay Trf",
                      "sort": "unsorted"
                },
                {
                  "uniqueName": "cash_recp",
                  "caption": "Rcpt Cash",
                    "sort": "unsorted"
              },
              {
                  "uniqueName": "trf_recp",
                  "caption": "Rcpt Trf",
                    "sort": "unsorted"
              }
              ],
              "measures": [
                {
                  uniqueName: "acc_num",
                  format: "decimal0"
                },
                {
                  uniqueName: "trans_cd",
                  format: "decimal0"
                },
                {
                  uniqueName: "voucher_id",
                  format: "decimal0"
                }],
              "flatOrder": [
                  "Trans CD",
                  "Voucher ID",
                  "Account Num"
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
      title: 'Cash Scroll For The Period ' +this.fd +'-' +this.td
    }
  }
  );
  this.child.webDataRocks.refresh();
  this.child.webDataRocks.exportTo('pdf', { pageOrientation:'potrait',header:"<div>##CURRENT-DATE##&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Synergic Banking&emsp;&emsp;&emsp;Branch : "+localStorage.getItem('__brnName')+"<br>&nbsp</div>",filename:"ScrollBook"});
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
