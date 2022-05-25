import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { mm_customer, SystemValues } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { RestService } from 'src/app/_service';

@Component({
  selector: 'app-networth-statement',
  templateUrl: './networth-statement.component.html',
  styleUrls: ['./networth-statement.component.css']
})
export class NetworthStatementComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,
    private router: Router) { }
  modalRef: BsModalRef;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true, // disable backdrop click to close the modal
    // class: 'modal-lg'
  };
  showReport = false;
  showAlert = false;
  isLoading = false;
  reportcriteria: FormGroup;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  suggestedCustomer: mm_customer[];
  ngOnInit(): void {
    this.reportcriteria = this.formBuilder.group({
      cust_name: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
  }

  private onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  public suggestCustomer(): void {
    if (this.reportcriteria.controls.cust_name.value.length > 0) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.reportcriteria.controls.cust_name.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res.slice(0, 15);
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
  public SelectCustomer(cust: mm_customer): void {
    this.reportcriteria.controls.cust_name.setValue(cust.cust_cd);
    this.suggestedCustomer = null;
  }

  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.showAlert = false;
      this.UrlString = this.svc.getReportUrl();
      this.UrlString = this.UrlString + 'WebForm/UCIC/NetWorth?'
        + 'brn_cd=' + this.sys.BranchCode + '&cust_cd='
        + this.reportcriteria.controls.cust_name.value;
      this.isLoading = true;
      this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 20000);
      // debugger;
      // this.svc.getViewMethodPost<any>(this.UrlString).subscribe(
      //   res => {
      //     debugger;
      //   },
      //   err => {
      //     debugger;
      //    }
      // );
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
