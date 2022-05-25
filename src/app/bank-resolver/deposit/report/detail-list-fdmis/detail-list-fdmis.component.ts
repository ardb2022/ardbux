import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param } from 'src/app/bank-resolver/Models';
import { mm_constitution } from 'src/app/bank-resolver/Models/deposit/mm_constitution';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';

@Component({
  selector: 'app-detail-list-fdmis',
  templateUrl: './detail-list-fdmis.component.html',
  styleUrls: ['./detail-list-fdmis.component.css']
})
export class DetailListFDMISComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
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
  constitutionList: mm_constitution[] = [];
  constitutionListToBind: mm_constitution[] = [];
  constructor(private svc: RestService, private formBuilder: FormBuilder,
              private modalService: BsModalService, private _domSanitizer: DomSanitizer,
              private router: Router) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, null],
      acc_type_cd: [null, Validators.required],
      constitution_cd: [{ disabled: true }, Validators.required]
    });
    this.getConstitutionList();
    this.onLoadScreen(this.content);
  }
  private onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }

  getConstitutionList() {
    if (undefined !== this.constitutionList &&
      null !== this.constitutionList &&
      this.constitutionList.length > 0) {
      return;
    }

    this.constitutionList = [];
    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
      res => {
        this.constitutionList = Utils.ChkArrNotEmptyRetrnEmptyArr(res);
      },
      err => { // ;
      }
    );
  }

public onAccountTypeChange(): void {
    this.constitutionListToBind = null;
    this.reportcriteria.controls.constitution_cd.reset();
    if (+this.reportcriteria.controls.acc_type_cd.value > 0) {
      this.constitutionListToBind = this.constitutionList.filter(e =>
        e.acc_type_cd === (+this.reportcriteria.controls.acc_type_cd.value));
      this.reportcriteria.controls.constitution_cd.enable();
    }
  }
  public SubmitReport() {
    debugger;
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.showAlert = false;
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.UrlString = this.svc.getReportUrl();
      this.UrlString = this.UrlString + 'WebForm/Deposit/dlfixed?'
        + 'brn_cd=' + this.sys.BranchCode
        + '&acc_type_cd=' + this.reportcriteria.controls.acc_type_cd.value
        + '&const_cd=' + this.reportcriteria.controls.constitution_cd.value
        + '&from_dt=' + Utils.convertDtToString(this.fromdate);
      this.isLoading = true;
      this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
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


  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
}
