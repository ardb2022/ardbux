import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RestService } from 'src/app/_service';
import { WebDataRocksPivot } from 'src/app/webdatarocks/webdatarocks.angular4';
import { tt_cash_account, p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';

@Component({
  selector: 'app-trialbalance',
  templateUrl: './trialbalance.component.html',
  styleUrls: ['./trialbalance.component.css']
})
export class TrialbalanceComponent implements OnInit {

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('TrialBalance') child: WebDataRocksPivot;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  trailbalance: tt_trial_balance[] = [];
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
    this.fromdate = this.sys.CurrentDate;
    this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, null]
    });
    this.onLoadScreen(this.content);
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

    else {
      this.showAlert = false;
      this.fromdate = this.reportcriteria.value.fromDate;
      this.UrlString = this.svc.getReportUrl();
      this.UrlString = this.UrlString + 'WebForm/Fin/trialbalance?'
        + 'brn_cd=' + this.sys.BranchCode + '&trial_dt='
        + Utils.convertDtToString(this.fromdate)
        + '&pl_acc_cd=12302' + '&gp_acc_cd=50001'
        ;
      this.isLoading = true;
      this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 4000);
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
  onPivotReady(TrialBalance: WebDataRocksPivot): void {
    console.log('[ready] WebDataRocksPivot', this.child);
  }


  onReportComplete(): void {

    if (!this.isLoading) { return; }
    this.prp.brn_cd = this.sys.BranchCode;
    this.prp.trial_dt = this.fromdate;
    this.prp.pl_acc_cd = parseInt(localStorage.getItem('__cashaccountCD'));
    this.prp.gp_acc_cd = parseInt(localStorage.getItem('__cashaccountCD'));
    const fdate = new Date(this.fromdate);
    const tdate = new Date(this.todate);
    this.fd = (('0' + fdate.getDate()).slice(-2)) + '/' + (('0' + (fdate.getMonth() + 1)).slice(-2)) + '/' + (fdate.getFullYear());
    this.td = (('0' + tdate.getDate()).slice(-2)) + '/' + (('0' + (tdate.getMonth() + 1)).slice(-2)) + '/' + (tdate.getFullYear());
    this.dt = new Date();
    this.dt = (('0' + this.dt.getDate()).slice(-2)) + '/' + (('0' + (this.dt.getMonth() + 1)).slice(-2)) + '/' + (this.dt.getFullYear()) + ' ' + this.dt.getHours() + ':' + this.dt.getMinutes();
    this.child.webDataRocks.off('reportcomplete');
    this.svc.addUpdDel<any>('Report/PopulateTrialBalance', this.prp).subscribe(
      (data: tt_trial_balance[]) => this.trailbalance = data,
      error => { console.log(error); },
      () => {

        // this.showReport = true;
        // this.generatePdf();
        const totalCr = 0;
        const totalDr = 0;
        this.isLoading = false;
        this.child.webDataRocks.setReport({
          dataSource: {
            data: this.trailbalance
          },
          tableSizes: {
            columns: [
              {
                idx: 0,
                width: 75
              },
              {
                idx: 1,
                width: 400
              },
              {
                idx: 2,
                width: 100
              },
              {
                idx: 3,
                width: 100
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
                uniqueName: 'acc_name',
                caption: 'Account Name',
                sort: 'unsorted'
              },
              {
                uniqueName: 'dr',
                caption: 'Debit',
                sort: 'unsorted'
              },
              {
                uniqueName: 'cr',
                caption: 'Credit',
                sort: 'unsorted'
              }
            ],
            measures: [
              {
                uniqueName: 'acc_cd',
                format: 'decimal0'
              }],
            flatOrder: [
              'Debit',
              'Dr Description',
              'Dr Amount',
              'Credit',
              'Cr Description',
              'Cr Amount',
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

    this.child.webDataRocks.refresh();
  }

  exportPDFTitle() {
    const options = this.child.webDataRocks.getOptions();
    this.child.webDataRocks.setOptions({
      grid: {
        title: 'Trial Balance as on ' + this.fd
      }
    }
    );
    this.child.webDataRocks.refresh();
    this.child.webDataRocks.exportTo('pdf', { pageOrientation: 'potrait', header: '<div>##CURRENT-DATE##&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Synergic Banking&emsp;&emsp;&emsp;Branch : ' + localStorage.getItem('__brnName') + '<br>&nbsp</div>', filename: 'TrialBalance' });
    this.child.webDataRocks.on('exportcomplete', function() {
      this.child.webDataRocks.off('exportcomplete');
      this.child.webDataRocks.setOptions(options);
      this.child.webDataRocks.refresh();
    });
  }
  closeScreen() {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }

}
