import { Router } from '@angular/router';
import { AccOpenDM } from './../../Models/deposit/AccOpenDM';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestService, InAppMessageService } from 'src/app/_service';
import {
  MessageType, mm_acc_type, mm_customer,
  mm_operation, m_acc_master, ShowMessage, SystemValues,
  td_def_trans_trf, td_intt_dtls, td_rd_installment, tm_deposit, tm_depositall
} from '../../Models';
import { tm_denomination_trans } from '../../Models/deposit/tm_denomination_trans';
import { DatePipe } from '@angular/common';
import { tm_transfer } from '../../Models/deposit/tm_transfer';
import { tt_denomination } from '../../Models/deposit/tt_denomination';
import { mm_constitution } from '../../Models/deposit/mm_constitution';
import Utils from 'src/app/_utility/utils';
import { p_gen_param } from '../../Models/p_gen_param';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { mm_oprational_intr } from '../../Models/deposit/mm_oprational_intr';
import { LoanOpenDM } from '../../Models/loan/LoanOpenDM';

@Component({
  selector: 'app-accoun-transactions',
  templateUrl: './accoun-transactions.component.html',
  styleUrls: ['./accoun-transactions.component.css'],
  providers: [DatePipe]
})
export class AccounTransactionsComponent implements OnInit {
  constructor(private svc: RestService, private msg: InAppMessageService,
    private frmBldr: FormBuilder, public datepipe: DatePipe, private router: Router,
    private modalService: BsModalService) { }
  get f() { return this.accTransFrm.controls; }
  get td() { return this.tdDefTransFrm.controls; }
  static existingCustomers: mm_customer[] = [];
  static constitutionList: mm_constitution[] = [];
  static operationalInstrList: mm_oprational_intr[] = [];
  public static operations: mm_operation[] = [];
  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;
  @ViewChild('unappconfirm', { static: true }) unappconfirm: TemplateRef<any>;
  operations: mm_operation[];
  unApprovedTransactionLst: td_def_trans_trf[] = [];
  unApprovedTransactionLstOfAcc: td_def_trans_trf[] = [];
  selectedUnapprovedTransactionToEdit: td_def_trans_trf;
  disableOperation = true;
  AcctTypes: mm_operation[];
  transType: DynamicSelect;
  isLoading: boolean;
  sys = new SystemValues();
  accTransFrm: FormGroup;
  tdDefTransFrm: FormGroup;
  showTransMode = false;
  showTransactionDtl = false;
  hideOnClose = false;
  showAmtDrpDn = false;
  disableSave = true;
  TrfTotAmt = 0;
  showInterestDtls = false;
  showRdInstalment = false;
  showMisInstalment = false;
  accDtlsFrm: FormGroup;
  ShadowBalance: number;
  showBalance = false;
  showTransfrTyp = true;
  suggestedCustomer: mm_customer[];
  customerList: mm_customer[] = [];
  td_deftrans = new td_def_trans_trf();
  td_deftranstrfList: td_def_trans_trf[] = [];
  tm_transferList: tm_transfer[] = [];
  accountTypeList: mm_acc_type[] = [];
  acc_master: m_acc_master[] = [];
  tm_deposit = new tm_deposit();

  accNoEnteredForTransaction: tm_depositall;
  rdInstallemntsForSelectedAcc: td_rd_installment[] = [];
  misInstallemntsForSelectedAcc: td_intt_dtls[] = [];
  preTransactionDtlForSelectedAcc: td_def_trans_trf[] = [];
  rdInstallamentOption: number[] = [];
  showOnRenewal = false;
  showOnClose = false;
  // showTranferType = true;
  showMsg: ShowMessage;
  showInstrumentDtl = false;
  tm_denominationList: tm_denomination_trans[] = [];
  denominationList: tt_denomination[] = [];
  denominationGrandTotal = 0;
  modalRef: BsModalRef;
  editDeleteMode = false;
  showCloseInterest = false;
  suggestedCustomerCr: mm_customer[];
  indxsuggestedCustomerCr = 0;

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  ngOnInit(): void {
    this.isLoading = false;
    setTimeout(() => {
      this.getOperationMaster();
      this.getAccountTypeList();
      this.getCustomerList();
      this.getDenominationList();
      this.getConstitutionList();
      this.getOperationalInstr();
      // this.getAllCustomer();
    }, 150);

    this.accTransFrm = this.frmBldr.group({
      acc_type_cd: [''],
      oprn_cd: [''],
      acct_num: ['']
    });
    this.tdDefTransFrm = this.frmBldr.group({
      trans_dt: [''],
      trans_cd: [''],
      acc_type_cd: [''],
      acc_type_desc: [''],
      acc_num: [''],
      trans_type_key: [''],
      trans_type: [''],
      trans_mode: [''],
      amount: [''],
      instrument_dt: [''],
      instrument_num: [''],
      paid_to: [''],
      token_num: [''],
      approval_status: [''],
      approved_by: [''],
      approved_dt: [''],
      particulars: [''],
      tr_acc_type_cd: [''],
      tr_acc_num: [''],
      voucher_dt: [''],
      voucher_id: [''],
      trf_type: [''],
      tr_acc_cd: [''],
      acc_cd: [''],
      share_amt: [''],
      sum_assured: [''],
      paid_amt: [''],
      curr_prn_recov: [''],
      ovd_prn_recov: [''],
      curr_intt_recov: [''],
      ovd_intt_recov: [''],
      remarks: [''],
      crop_cd: [''],
      activity_cd: [''],
      curr_intt_rate: [''],
      ovd_intt_rate: [''],
      instl_no: [''],
      instl_start_dt: [''],
      periodicity: [''],
      disb_id: [''],
      comp_unit_no: [''],
      ongoing_unit_no: [''],
      mis_advance_recov: [''],
      audit_fees_recov: [''],
      sector_cd: [''],
      spl_prog_cd: [''],
      borrower_cr_cd: [''],
      intt_till_dt: [''],
      acc_name: [''],
      brn_cd: [''],
      trf_type_desc: [''],
      constitution_cd: [''],
      constitution_cd_desc: [''],
      cert_no: [''],
      opening_dt: [''],
      mat_dt: [''],
      dep_period_y: [''],
      dep_period_m: [''],
      dep_period_d: [''],
      intt_trf_type: [''],
      intt_rate: [''],
      interest: [''],
      td_def_mat_amt: [''],
      closeIntrest: [''],
      balance: ['']
    });
    this.resetTransfer();
    this.resetAccDtlsFrmFormData();
  }

  // private getAllCustomer(): void {
  //   if (undefined !== AccounTransactionsComponent.existingCustomers &&
  //     null !== AccounTransactionsComponent.existingCustomers &&
  //     AccounTransactionsComponent.existingCustomers.length > 0) {
  //   } else {
  //     const cust = new mm_customer(); cust.cust_cd = 0;
  //     this.isLoading = true;
  //     this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
  //       res => {
  //         AccounTransactionsComponent.existingCustomers = res;
  //         this.isLoading = false;
  //       },
  //       err => { this.isLoading = false; }
  //     );
  //   }
  // }

  public suggestCustomer(): void {
    if (this.f.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.f.acct_num.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res.slice(0, 10);
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

  processInterest(): void {
    const temp_gen_param = new p_gen_param();

    temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;

    if (this.td.acc_type_cd.value === 6) {
      // if (this.td.instl_amt.value === undefined || this.td.instl_amt.value === null ||
      //   this.td.instl_no.value === undefined || this.td.instl_no.value === null ||
      //   this.td.intt_rt.value === undefined || this.td.intt_rt.value === null)
      // // temp_gen_param.an_intt_rate === undefined || temp_gen_param.an_intt_rate === null )
      // {
      //   return;
      // }

      temp_gen_param.ad_instl_amt = +this.td.instl_amt.value;
      temp_gen_param.an_instl_no = +this.td.instl_no.value;
      temp_gen_param.an_intt_rate = +this.td.intt_rt.value;
      this.calCrdIntReg(temp_gen_param);
    }
    else {

      // if (((this.tm_deposit.year === undefined || this.tm_deposit.year === null) &&
      //   (this.tm_deposit.month === undefined || this.tm_deposit.month === null) &&
      //   (this.tm_deposit.day === undefined || this.tm_deposit.day === null)) ||
      //   this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null || this.tm_deposit.prn_amt === 0 ||
      //   this.tm_deposit.intt_trf_type === undefined || this.tm_deposit.intt_trf_type === null) {
      //   return;
      // }
      if (this.td.intt_trf_type.value === '' ||
        this.td.intt_rate.value === '') {
        return;
      }
      // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      // this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
      // this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
      // this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);


      // var temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = +this.td.acc_type_cd.value;
      temp_gen_param.ad_prn_amt = +this.td.amount.value;
      temp_gen_param.adt_temp_dt = Utils.convertStringToDt(this.td.opening_dt.value);
      temp_gen_param.as_intt_type = this.td.intt_trf_type.value;
      // tslint:disable-next-line: max-line-length
      // if (typeof (this.td.opening_dt) === 'string') {
      //   this.tm_deposit.opening_dt = Utils.convertStringToDt(this.td.opening_dt.value);
      // }

      // if (typeof (this.tm_deposit.mat_dt) === 'string') {
      //   this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
      // }

      const o = Utils.convertStringToDt(this.td.opening_dt.value);
      const m = Utils.convertStringToDt(this.td.mat_dt.value);
      const diffDays = Math.ceil((Math.abs(m.getTime() - o.getTime())) / (1000 * 3600 * 24));

      temp_gen_param.ai_period = diffDays;
      temp_gen_param.ad_intt_rt = +this.td.intt_rate.value;

      this.f_calctdintt_reg(temp_gen_param);
    }
  }

  calCrdIntReg(tempGenParam: p_gen_param): void {
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/F_CALCRDINTT_REG', tempGenParam).subscribe(
      res => {
        this.tm_deposit.intt_amt = res;
        this.tm_deposit.mat_val = Number(this.tm_deposit.intt_amt) + Number(this.tm_deposit.prn_amt);
        this.isLoading = false;
      },
      err => {
        this.tm_deposit.intt_amt = 0;
        this.isLoading = false;

      }
    );
  }

  f_calctdintt_reg(temp_gen_param: p_gen_param): void {
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
      res => {
        this.tdDefTransFrm.patchValue({
          interest: +res
        });
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;

      }
    );
  }

  F_CALC_SB_INTT(): void {
    this.isLoading = true;
    const prm = new p_gen_param();
    prm.as_acc_num = this.f.acct_num.value;
    prm.from_dt = this.sys.SBInttCalTillDt;
    prm.to_dt = this.sys.CurrentDate;
    prm.brn_cd = this.sys.BranchCode;
    this.svc.addUpdDel<any>('Deposit/F_CALC_SB_INTT', prm).subscribe(
      res => {
        this.showCloseInterest = true;
        this.tdDefTransFrm.patchValue({
          amount: this.accNoEnteredForTransaction.curr_bal + (+res),
          closeIntrest: (+res)
        });
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }

  getOperationalInstr() {
    // debugger;
    if (AccounTransactionsComponent.operationalInstrList.length > 0) {
      return;
    }

    AccounTransactionsComponent.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
      res => {
        AccounTransactionsComponent.operationalInstrList = res;
      },
      err => { }
    );
  }

  getConstitutionList() {
    if (AccounTransactionsComponent.constitutionList.length > 0) {
      return;
    }

    AccounTransactionsComponent.constitutionList = [];
    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
      res => {
        // debugger;
        AccounTransactionsComponent.constitutionList = res;
      },
      err => { // ;
      }
    );
  }

  private resetAccDtlsFrmFormData(): void {
    this.showRdInstalment = false;
    this.showMisInstalment = false;
    this.accDtlsFrm = this.frmBldr.group({
      brn_cd: [''],
      acc_type_cd: [''],
      acc_num: [''],
      renew_id: [''],
      cust_cd: [''],
      intt_trf_type: [''],
      constitution_cd: [''],
      constitution_cd_desc: [''],
      oprn_instr_cd: [''],
      oprn_instr_cd_desc: [''],
      opening_dt: [''],
      prn_amt: [''],
      intt_amt: [''],
      mat_amt: [''],
      dep_period: [''],
      instl_amt: [''],
      instl_no: [''],
      mat_dt: [''],
      intt_rt: [''],
      tds_applicable: [''],
      last_intt_calc_dt: [''],
      acc_close_dt: [''],
      closing_prn_amt: [''],
      closing_intt_amt: [''],
      penal_amt: [''],
      ext_instl_tot: [''],
      mat_status: [''],
      acc_status: [''],
      curr_bal: [''],
      clr_bal: [''],
      standing_instr_flag: [''],
      cheque_facility_flag: [''],
      created_by: [''],
      created_dt: [''],
      modified_by: [''],
      modified_dt: [''],
      approval_status: [''],
      approved_by: [''],
      approved_dt: [''],
      user_acc_num: [''],
      lock_mode: [''],
      loan_id: [''],
      cert_no: [''],
      bonus_amt: [''],
      penal_intt_rt: [''],
      bonus_intt_rt: [''],
      transfer_flag: [''],
      transfer_dt: [''],
      agent_cd: [''],
      cust_type: [''],
      title: [''],
      first_name: [''],
      middle_name: [''],
      last_name: [''],
      cust_name: [''],
      guardian_name: [''],
      cust_dt: [''],
      dt_of_birth: [''],
      age: [''],
      sex: [''],
      marital_status: [''],
      catg_cd: [''],
      community: [''],
      caste: [''],
      permanent_address: [''],
      ward_no: [''],
      state: [''],
      dist: [''],
      pin: [''],
      vill_cd: [''],
      block_cd: [''],
      service_area_cd: [''],
      occupation: [''],
      phone: [''],
      present_address: [''],
      constitution_desc: [''],
      shadow_bal: [''],
      dep_period_y: [''],
      dep_period_m: [''],
      dep_period_d: [''],
    });
  }

  private setAccDtlsFrmForm(): void {
    // debugger;
    if (undefined !== this.accNoEnteredForTransaction && Object.keys(this.accNoEnteredForTransaction).length !== 0) {
      this.resetAccDtlsFrmFormData();
      this.getShadowBalance();
      if (this.accNoEnteredForTransaction.acc_type_cd === 2
        || this.accNoEnteredForTransaction.acc_type_cd === 3
        || this.accNoEnteredForTransaction.acc_type_cd === 4) {
        this.showInterestDtls = true;
        this.accNoEnteredForTransaction.ShowClose = true;
      }
      if (this.accNoEnteredForTransaction.acc_type_cd === 6) {
        this.showRdInstalment = true;
        this.accNoEnteredForTransaction.ShowClose = true;
      }
      if (this.accNoEnteredForTransaction.acc_type_cd === 5) {
        this.showMisInstalment = true;
        this.showInterestDtls = true;
        this.accNoEnteredForTransaction.ShowClose = true;
      }
      const constitution = AccounTransactionsComponent.constitutionList.filter(e => e.constitution_cd
        === this.accNoEnteredForTransaction.constitution_cd)[0];
      const OprnInstrDesc = AccounTransactionsComponent.operationalInstrList.filter(e => e.oprn_cd
        === this.accNoEnteredForTransaction.oprn_instr_cd)[0];

      let intrestType = '';
      if (this.accNoEnteredForTransaction.intt_trf_type === 'O') {
        intrestType = 'On Maturity';
      } else if (this.accNoEnteredForTransaction.intt_trf_type === 'H') {
        intrestType = 'Half Yearly';
      } else if (this.accNoEnteredForTransaction.intt_trf_type === 'Q') {
        intrestType = 'Quarterly';
      } else if (this.accNoEnteredForTransaction.intt_trf_type === 'M') {
        intrestType = 'Monthly';
      }

      this.accDtlsFrm.patchValue({
        brn_cd: this.accNoEnteredForTransaction.brn_cd,
        acc_type_cd: this.accNoEnteredForTransaction.acc_type_cd,
        acc_num: this.accNoEnteredForTransaction.acc_num,
        renew_id: this.accNoEnteredForTransaction.renew_id,
        cust_cd: this.accNoEnteredForTransaction.cust_cd,
        cust_name: this.accNoEnteredForTransaction.cust_name,
        intt_trf_type: intrestType,
        constitution_cd: this.accNoEnteredForTransaction.constitution_cd,
        constitution_cd_desc: (undefined !== constitution && null !== constitution
          && undefined !== constitution.constitution_desc && null !== constitution.constitution_desc) ?
          constitution.constitution_desc : null,
        oprn_instr_cd: this.accNoEnteredForTransaction.oprn_instr_cd,
        oprn_instr_cd_desc: (undefined !== OprnInstrDesc && null !== OprnInstrDesc
          && undefined !== OprnInstrDesc.oprn_desc && null !== OprnInstrDesc.oprn_desc) ?
          OprnInstrDesc.oprn_desc : null,
        opening_dt: this.accNoEnteredForTransaction.opening_dt.toString().substr(0, 10),
        prn_amt: this.accNoEnteredForTransaction.prn_amt,
        intt_amt: this.accNoEnteredForTransaction.intt_amt,
        mat_amt: this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt,
        dep_period_y: null === this.accNoEnteredForTransaction.dep_period ? ''
          : (this.accNoEnteredForTransaction.dep_period.split(';')[0].split('=')[1]),
        dep_period_m: null === this.accNoEnteredForTransaction.dep_period ? ''
          : (this.accNoEnteredForTransaction.dep_period.split(';')[1].split('=')[1]),
        dep_period_d: null === this.accNoEnteredForTransaction.dep_period ? ''
          : (this.accNoEnteredForTransaction.dep_period.split(';')[2].split('=')[1]),
        instl_amt: this.accNoEnteredForTransaction.instl_amt,
        instl_no: this.accNoEnteredForTransaction.instl_no,
        mat_dt: this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10),
        intt_rt: this.accNoEnteredForTransaction.intt_rt,
        tds_applicable: this.accNoEnteredForTransaction.tds_applicable,
        last_intt_calc_dt: this.accNoEnteredForTransaction.last_intt_calc_dt.toString().substr(0, 10),
        acc_close_dt: this.accNoEnteredForTransaction.ShowClose ? Utils.getTodaysDtInCorrectFormat() : null,
        closing_prn_amt: this.accNoEnteredForTransaction.closing_prn_amt,
        closing_intt_amt: this.accNoEnteredForTransaction.closing_intt_amt,
        penal_amt: this.accNoEnteredForTransaction.penal_amt,
        ext_instl_tot: this.accNoEnteredForTransaction.ext_instl_tot,
        mat_status: this.accNoEnteredForTransaction.mat_status,
        acc_status: this.accNoEnteredForTransaction.acc_status,
        curr_bal: this.accNoEnteredForTransaction.curr_bal,
        clr_bal: this.accNoEnteredForTransaction.clr_bal,
        standing_instr_flag: this.accNoEnteredForTransaction.standing_instr_flag,
        cheque_facility_flag: this.accNoEnteredForTransaction.cheque_facility_flag,
        approval_status: this.accNoEnteredForTransaction.approval_status,
        approved_by: this.accNoEnteredForTransaction.approved_by,
        approved_dt: this.accNoEnteredForTransaction.approved_dt,
        user_acc_num: this.accNoEnteredForTransaction.user_acc_num,
        lock_mode: this.accNoEnteredForTransaction.lock_mode,
        loan_id: this.accNoEnteredForTransaction.loan_id,
        cert_no: this.accNoEnteredForTransaction.cert_no,
        bonus_amt: this.accNoEnteredForTransaction.bonus_amt,
        penal_intt_rt: this.accNoEnteredForTransaction.penal_intt_rt,
        bonus_intt_rt: this.accNoEnteredForTransaction.bonus_intt_rt,
        transfer_flag: this.accNoEnteredForTransaction.transfer_flag,
        transfer_dt: this.accNoEnteredForTransaction.transfer_dt,
        agent_cd: this.accNoEnteredForTransaction.agent_cd,
      });
    } else {
      this.accDtlsFrm.reset();
      this.showRdInstalment = false;
      this.showMisInstalment = false;
    }
  }

  private getShadowBalance(): void {
    const tmDep = new tm_deposit();
    this.ShadowBalance = 0;
    tmDep.acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
    tmDep.brn_cd = this.accNoEnteredForTransaction.brn_cd;
    tmDep.acc_num = this.accNoEnteredForTransaction.acc_num;
    this.svc.addUpdDel<any>('Deposit/GetShadowBalance', tmDep).subscribe(
      res => {
        if (undefined !== res && null !== res && !isNaN(+res)) {
          this.ShadowBalance = res;
          this.accDtlsFrm.patchValue({
            shadow_bal: res
          });
        }
      },
      err => { this.isLoading = false; console.log(err); }
    );
  }

  private getDenominationList(): void {
    let denoList: tt_denomination[] = [];
    this.svc.addUpdDel<any>('Common/GetDenomination', null).subscribe(
      res => {
        denoList = res;
        this.denominationList = denoList.sort((a, b) => (a.value < b.value) ? 1 : -1);
      },
      err => { // ;
      }
    );
  }

  getCustomerList() {
    const cust = new mm_customer();
    cust.cust_cd = 0;
    cust.brn_cd = this.sys.BranchCode;

    if (this.customerList === undefined || this.customerList === null || this.customerList.length === 0) {
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
        res => {
          this.isLoading = false;
          this.customerList = res;
        },
        err => {
          this.isLoading = false;

        }
      );
    }
    else { this.isLoading = false; }
  }

  private getOperationMaster(): void {

    this.isLoading = true;
    if (undefined !== AccounTransactionsComponent.operations &&
      null !== AccounTransactionsComponent.operations &&
      AccounTransactionsComponent.operations.length > 0) {
      this.isLoading = false;
      this.AcctTypes = AccounTransactionsComponent.operations.filter(e => e.module_type === 'DEPOSIT')
        .filter((thing, i, arr) => {
          return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
        });
      this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
    } else {
      this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
        res => {

          AccounTransactionsComponent.operations = res;
          this.isLoading = false;
          this.AcctTypes = AccounTransactionsComponent.operations.filter(e => e.module_type === 'DEPOSIT')
            .filter((thing, i, arr) => {
              return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
            });
          this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
        },
        err => { this.isLoading = false; }
      );
    }
  }

  /** method fires on account type change */
  public onAcctTypeChange(): void {
    this.tm_denominationList = [];
    this.accNoEnteredForTransaction = undefined;
    this.resetTransfer();
    this.f.acct_num.reset(); this.f.oprn_cd.reset();
    this.tdDefTransFrm.reset(); this.showTransactionDtl = false;
    this.HandleMessage(false);
    const acctTypCdTofilter = +this.f.acc_type_cd.value;
    const acctTypeDesription = AccounTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter)[0].acc_type_desc;
    this.tdDefTransFrm.patchValue({
      acc_type_desc: acctTypeDesription,
      acc_type_cd: acctTypCdTofilter
    });
    this.operations = AccounTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter);
    // this.f.oprn_cd.enable();
    this.f.acct_num.enable();
    this.f.oprn_cd.disable();
    // this.refresh = false;
    // this.msg.sendCommonTmDepositAll(null);
    // this.refresh = true;
  }

  public SelectCustomer(cust: any): void {
    this.f.acct_num.setValue(cust.acc_num);
    this.onAccountNumTabOff();
    this.suggestedCustomer = null;
  }

  public onAccountNumTabOff(): void {
    this.tm_denominationList = [];
    this.resetTransfer();
    this.tdDefTransFrm.reset(); this.showTransactionDtl = false;
    this.f.oprn_cd.disable(); this.f.oprn_cd.reset();
    this.disableOperation = true;
    // this.showTranferType = true;
    // console.log('onAccountNumTabOff -' + this.f.acct_num.value);
    this.isLoading = true;
    this.showMsg = null;
    let acc = new tm_depositall();
    acc.acc_num = '' + this.f.acct_num.value;
    acc.acc_type_cd = +this.f.acc_type_cd.value;
    acc.brn_cd = this.sys.BranchCode;
    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', acc).subscribe(
      res => {
        debugger;
        this.isLoading = false;
        let foundOneUnclosed = false;
        if (undefined !== res && null !== res && res.length > 0) {
          res.forEach(element => {
            if (element.acc_status === null || element.acc_status.toUpperCase() !== 'C') {
              foundOneUnclosed = true;
              acc = element;
              if (this.validationOnAcctTabOff(acc)) {
                this.disableOperation = false;
                this.accNoEnteredForTransaction = acc;
                this.setAccDtlsFrmForm();
                this.getPreviousTransactionDtl(acc);
                this.tdDefTransFrm.patchValue({
                  acc_num: acc.acc_num,
                });
                this.f.oprn_cd.enable();
              }
            }
          });
          if (!foundOneUnclosed) {
            this.HandleMessage(true, MessageType.Error,
              'Account number ' + this.f.acct_num.value + ' is closed.');
            this.onResetClick();
            return;
          }
        } else {
          this.HandleMessage(true, MessageType.Error,
            'Account number does not exists.');
          this.onResetClick();
          return;
        }
      },
      err => {
        this.f.oprn_cd.disable(); this.isLoading = false;
        console.log(err);
        this.resetAccDtlsFrmFormData();
      }
    );
  }

  private getPreviousTransactionDtl(acc: tm_depositall): void {
    debugger;
    this.preTransactionDtlForSelectedAcc = [];
    const t = new td_def_trans_trf();
    t.brn_cd = this.sys.BranchCode;
    t.acc_num = acc.acc_num;
    t.acc_type_cd = acc.acc_type_cd;
    console.log(JSON.stringify(t));
    this.svc.addUpdDel<any>('Deposit/GetPrevTransaction', t).subscribe(
      res => {
        let prTrans = [];
        prTrans = Utils.ChkArrNotEmptyRetrnEmptyArr(res);
        this.preTransactionDtlForSelectedAcc = [];
        let tot = acc.clr_bal;
        this.preTransactionDtlForSelectedAcc.push(prTrans[0]);
        this.preTransactionDtlForSelectedAcc[0].Balance = tot;
        for (let i = 0; i <= prTrans.length; i++) {
          prTrans[i].TransDtAsString = prTrans[i].trans_dt.toString().substring(0, 10);
          if (i > 0) {
            if (prTrans[i - 1].trans_type === 'D') { // deposit
              tot -= +(prTrans[i - 1].amount);
            } else {
              tot += +(prTrans[i - 1].amount);
            }
            prTrans[i].Balance = tot;
            this.preTransactionDtlForSelectedAcc.push(prTrans[i]);
          }
        }
        // this.preTransactionDtlForSelectedAcc = this.preTransactionDtlForSelectedAcc.((a, b) => (a.trans_dt < b.trans_dt ? -1 : 1));
      },
      err => { console.log(err); }
    );
  }

  private validationOnAcctTabOff(acc: tm_depositall): boolean {
    // debugger;
    if (undefined === acc) {
      this.HandleMessage(true, MessageType.Error,
        'Account number ' + this.f.acct_num.value + ' is not Valid/Present/Account Type doesnt match.');
      this.onResetClick();
      return false;
    }
    // /* check if account is not closed */
    // if (acc.acc_status.toUpperCase() === 'C') {
    //   this.HandleMessage(true, MessageType.Error,
    //     'Account number ' + this.f.acct_num.value + ' is closed.');
    //   this.onResetClick();
    //   return false;
    // }

    if (acc.acc_type_cd === 1 ||
      acc.acc_type_cd === 2 ||
      acc.acc_type_cd === 3 ||
      acc.acc_type_cd === 4 ||
      acc.acc_type_cd === 5 ||
      acc.acc_type_cd === 6) {
      /* check if account is not Locked */
      if (null !== acc.lock_mode
        && acc.lock_mode.toUpperCase() === 'L') {
        this.HandleMessage(true, MessageType.Error,
          `Account number ${this.f.acct_num.value} is locked.`);
        this.onResetClick();
        return false;
      }
    }
    this.getUnapprovedDepTransAskViewEditOption();
    /** Account type wise validation if any */
    switch (acc.acc_type_cd) {
      case 1: // SB
        /* check if constituion is set for No transaction is dormant */
        const constitution = AccounTransactionsComponent.constitutionList.filter
          (e => e.constitution_cd === acc.constitution_cd)[0];
        if (undefined !== constitution && null !== constitution
          && null !== constitution.allow_trans
          && constitution.allow_trans.toUpperCase() === 'N') {
          this.HandleMessage(true, MessageType.Error,
            `No transaction allowed for this constituion ${constitution.constitution_desc}.`);
          this.onResetClick();
          return false;
        }
        /* check if account is dormant */
        const temp = new tm_deposit();
        temp.brn_cd = this.sys.BranchCode;
        temp.acc_num = acc.acc_num;
        console.log(JSON.stringify(temp));
        this.svc.addUpdDel<any>('Deposit/isDormantAccount', temp).subscribe(
          res => {
            if (undefined !== res && null !== res && res === 0) {
              this.HandleMessage(true, MessageType.Warning,
                `Account number ${this.f.acct_num.value} is dormant.`);
            }
          },
          err => { console.log(err); }
        );
        break;
      case 6: // RD
        const cDt = this.sys.CurrentDate.getTime();
        const chDt = Utils.convertStringToDt(acc.mat_dt.toString()).getTime();
        if (cDt > chDt) {
          this.HandleMessage(true, MessageType.Error,
            `Maturity date of account number ${this.f.acct_num.value} has crossed ${Utils.convertDtToString(this.sys.CurrentDate)}`);
          this.onResetClick();
          return false;
        }
        /** For RD get the RD installament */
        const rdInstallament = new td_rd_installment();
        rdInstallament.acc_num = acc.acc_num;
        this.svc.addUpdDel<any>('Deposit/GetRDInstallment', rdInstallament).subscribe(
          rdInstallamentRes => {
            this.rdInstallemntsForSelectedAcc = [];
            this.rdInstallemntsForSelectedAcc = Utils.ChkArrNotEmptyRetrnEmptyArr(rdInstallamentRes);
            let i = 1;
            this.rdInstallemntsForSelectedAcc.forEach(e => {
              if (e.status.toLocaleLowerCase() === 'p') {
                this.rdInstallamentOption.push(acc.instl_amt * i);
                i = i + 1;
              }
            });
          },
          rdInstallamentErr => { console.log(rdInstallamentErr); }
        );
        break;

      case 5: // MIS
        this.showMisInstalment = false;
        const misInstalments = new td_intt_dtls();
        misInstalments.brn_cd = this.sys.BranchCode;
        misInstalments.acc_num = acc.acc_num;
        misInstalments.acc_type_cd = acc.acc_type_cd;
        this.svc.addUpdDel<any>('Deposit/GetInttDetails', misInstalments).subscribe(
          misInstalmentsRes => {
            this.misInstallemntsForSelectedAcc = [];
            this.misInstallemntsForSelectedAcc = Utils.ChkArrNotEmptyRetrnEmptyArr(misInstalmentsRes);
            let i = 1;
            this.showMisInstalment = true;
            this.misInstallemntsForSelectedAcc.forEach(e => {
              if (e.paid_status.toLocaleLowerCase() === 'b') {
                this.rdInstallamentOption.push(acc.intt_amt * i);
                i = i + 1;
              }
            });
            this.misInstallemntsForSelectedAcc = this.misInstallemntsForSelectedAcc.filter(e =>
              e.paid_status.toLocaleLowerCase() === 'b' || e.paid_status.toLocaleLowerCase() === 'p');
          },
          misInstalmentsErr => { console.log(misInstalmentsErr); }
        );
        break;

    }

    return true;
  }
  /**
   * Get all unapprved transaction
  get if the account is entered has unaaproved transaction
  show confirm box, if more that one upapproved transaction is present then show a list
  on click of ok for single tansaction or in list selected btn trn code will be opened in Edit
  on click of cancel old logic will follow.
   */
  /** return true if no unapproved transaction exixts */
  private getUnapprovedDepTransAskViewEditOption(): void {
    this.isLoading = true;
    const tdDepTrans = new td_def_trans_trf();
    tdDepTrans.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', tdDepTrans).subscribe(
      res => {
        debugger;
        this.isLoading = false;
        if (res.length > 0) {
          this.unApprovedTransactionLst = res;
          this.unApprovedTransactionLstOfAcc = this.unApprovedTransactionLst.filter(e => e.acc_num
            === this.f.acct_num.value.toString());
          if (undefined !== this.unApprovedTransactionLstOfAcc &&
            null !== this.unApprovedTransactionLstOfAcc &&
            this.unApprovedTransactionLstOfAcc.length > 0) {
            this.modalRef = this.modalService.show(this.unappconfirm,
              { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true });
          }
        }
      },
      err => { this.isLoading = false; }
    );
  }

  onDeleteClick(): void {
    if (!(confirm('Are you sure you want to Delete Transaction of Acc '
      + this.accNoEnteredForTransaction.acc_num
      + ' with Transancation Cd ' + this.selectedUnapprovedTransactionToEdit.trans_cd))) {
      return;
    }

    this.isLoading = true;
    const param = new td_def_trans_trf();
    param.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    param.trans_cd = this.selectedUnapprovedTransactionToEdit.trans_cd;
    // const dt = this.sys.CurrentDate;
    param.trans_dt = this.sys.CurrentDate;
    param.acc_type_cd = (+this.f.acc_type_cd.value);
    param.acc_num = this.accNoEnteredForTransaction.acc_num;

    this.svc.addUpdDel<any>('Deposit/DeleteAccountOpeningData ', param).subscribe(
      res => {
        this.isLoading = false;
        if (res === 0) {
          this.HandleMessage(true, MessageType.Sucess, this.accNoEnteredForTransaction.acc_num
            + '\'s Transaction with Transancation Cd ' + this.selectedUnapprovedTransactionToEdit.trans_cd
            + ' is deleted.');
          this.onResetClick();
        } else {
          this.HandleMessage(true, MessageType.Error, JSON.stringify(res));
        }
      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, err.error.text);
      }
    );
  }

  public onUpapprovedConfirm(selectedTransactionToEdit: td_def_trans_trf): void {
    this.disableOperation = true;
    this.editDeleteMode = true;
    this.selectedUnapprovedTransactionToEdit = selectedTransactionToEdit;
    this.modalRef.hide();
    this.showTransactionDtl = true;
    this.getDepTrans(selectedTransactionToEdit);
    this.getDenominationOrTransferDtl(selectedTransactionToEdit);
  }

  private getDepTrans(depTras: td_def_trans_trf): void {
    this.isLoading = true;
    // this.showCust = false; // this is done to forcibly rebind the screen
    // const defTransaction = new td_def_trans_trf();
    // defTransaction.trans_cd = this.selectedTransactionCd;
    // defTransaction.brn_cd = localStorage.getItem('__brnCd');
    this.svc.addUpdDel<td_def_trans_trf>('Common/GetDepTrans', depTras).subscribe(
      res => {
        // this.selectedVm.td_def_trans_trf = res[0];
        // this.msg.sendCommonTransactionInfo(res[0]); // show transaction details
        this.setTransactionDtl(res[0]);
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }

  private getDenominationOrTransferDtl(transactionDtl: td_def_trans_trf): void {
    debugger;
    this.tm_denominationList = [];
    this.td_deftranstrfList = [];
    this.denominationGrandTotal = 0;
    this.TrfTotAmt = 0;
    if (transactionDtl.trf_type === 'C') {
      const tmDenoTrf = new tm_denomination_trans();
      tmDenoTrf.brn_cd = this.sys.BranchCode;
      tmDenoTrf.trans_cd = transactionDtl.trans_cd;
      tmDenoTrf.trans_dt = Utils.convertStringToDt(transactionDtl.trans_dt.toString());
      this.svc.addUpdDel<any>('Common/GetDenominationDtls', tmDenoTrf).subscribe(
        res => {
          debugger;
          if (null !== res && Object.keys(res).length !== 0) {
            // this.showDenominationDtl = true;
            this.tm_denominationList = res;
            this.tm_denominationList.forEach(element => {
              const denomination = this.denominationList.filter(e => e.value === element.rupees)[0];
              element.rupees_desc = denomination.rupees;
              this.denominationGrandTotal += element.total;
            });
          }
        },
        err => { }
      );
    } else {
      const tdDefTranTransfr = new td_def_trans_trf();
      tdDefTranTransfr.brn_cd = this.sys.BranchCode;
      tdDefTranTransfr.trans_cd = transactionDtl.trans_cd;
      tdDefTranTransfr.trans_dt = Utils.convertStringToDt(transactionDtl.trans_dt.toString());
      // tdDefTranTransfr.trans_type = transactionDtl.trans_type;
      this.svc.addUpdDel<any>('Common/GetDepTransTrfwithChild', tdDefTranTransfr).subscribe(
        res => {
          debugger;
          if (null !== res && Object.keys(res).length !== 0) {
            this.td_deftranstrfList = res;
            this.td_deftranstrfList.forEach(e => {
              this.TrfTotAmt += (+e.amount);
            });
            debugger;
            // this.td_deftranstrfList = acc.tddeftranstrf;
            // this.f.oprn_cd.enable();
            for (let i = 0; i < this.td_deftranstrfList.length; i++) {
              if (this.td_deftranstrfList[i].acc_num === '0000') {
                this.td_deftranstrfList[i].gl_acc_code = this.td_deftranstrfList[i].acc_type_cd.toString();
                this.checkAndSetDebitAccType('gl_acc', this.td_deftranstrfList[i]);

              }
              else {
                this.td_deftranstrfList[i].cust_acc_type = this.td_deftranstrfList[i].acc_type_cd.toString();
                this.td_deftranstrfList[i].cust_acc_number = this.td_deftranstrfList[i].acc_num;
                this.checkAndSetDebitAccType('cust_acc', this.td_deftranstrfList[i]);
                this.setDebitAccDtls(this.td_deftranstrfList[i]);

              }
            }
            this.sumTransfer();
          }
        },
        err => { }
      );
    }
  }

  private setTransactionDtl(tdDefTransTrf: td_def_trans_trf): void {
    const acctTypeDesription = AccounTransactionsComponent.operations
      .filter(e => e.acc_type_cd === tdDefTransTrf.acc_type_cd)[0].acc_type_desc;
    this.tdDefTransFrm.patchValue({
      trans_dt: tdDefTransTrf.trans_dt,
      trans_cd: tdDefTransTrf.trans_cd,
      acc_type_cd: tdDefTransTrf.acc_type_cd,
      acc_type_desc: acctTypeDesription,
      acc_num: tdDefTransTrf.acc_num,
      // trans_type_key:  tdDefTransTrf.trans_type_key ,
      trans_type: tdDefTransTrf.trans_type.toLowerCase() === 'w' ? 'Withdraw' : 'Deposit',
      trans_type_key: tdDefTransTrf.trans_type,
      trans_mode: tdDefTransTrf.trans_mode,
      trf_type: tdDefTransTrf.trf_type,
      amount: tdDefTransTrf.amount,
      curr_intt_recov: tdDefTransTrf.curr_intt_recov,
      ovd_intt_recov: tdDefTransTrf.ovd_intt_recov,
      curr_prn_recov: tdDefTransTrf.curr_prn_recov,
      ovd_prn_recov: tdDefTransTrf.ovd_prn_recov,
      instrument_dt: tdDefTransTrf.instrument_dt,
      instrument_num: tdDefTransTrf.instrument_num,
      paid_to: tdDefTransTrf.paid_to,
      token_num: tdDefTransTrf.token_num,
      approval_status: tdDefTransTrf.approval_status,
      approved_by: tdDefTransTrf.approved_by,
      approved_dt: tdDefTransTrf.approved_dt,
      particulars: tdDefTransTrf.particulars,
      tr_acc_type_cd: tdDefTransTrf.tr_acc_type_cd,
      tr_acc_num: tdDefTransTrf.tr_acc_num,
      voucher_dt: tdDefTransTrf.voucher_dt,
      voucher_id: tdDefTransTrf.voucher_id,
      tr_acc_cd: tdDefTransTrf.tr_acc_cd,
      acc_cd: tdDefTransTrf.acc_cd,
      share_amt: tdDefTransTrf.share_amt,
      sum_assured: tdDefTransTrf.sum_assured,
      paid_amt: tdDefTransTrf.paid_amt,
      remarks: tdDefTransTrf.remarks,
      crop_cd: tdDefTransTrf.crop_cd,
      activity_cd: tdDefTransTrf.activity_cd,
      curr_intt_rate: tdDefTransTrf.curr_intt_rate,
      ovd_intt_rate: tdDefTransTrf.ovd_intt_rate,
      instl_no: tdDefTransTrf.instl_no,
      instl_start_dt: tdDefTransTrf.instl_start_dt,
      periodicity: tdDefTransTrf.periodicity,
      disb_id: tdDefTransTrf.disb_id,
      comp_unit_no: tdDefTransTrf.comp_unit_no,
      ongoing_unit_no: tdDefTransTrf.ongoing_unit_no,
      mis_advance_recov: tdDefTransTrf.mis_advance_recov,
      audit_fees_recov: tdDefTransTrf.audit_fees_recov,
      sector_cd: tdDefTransTrf.sector_cd,
      spl_prog_cd: tdDefTransTrf.spl_prog_cd,
      borrower_cr_cd: tdDefTransTrf.borrower_cr_cd,
      intt_till_dt: tdDefTransTrf.intt_till_dt,
      acc_name: tdDefTransTrf.acc_name,
      brn_cd: tdDefTransTrf.brn_cd,
      trf_type_desc: tdDefTransTrf.trf_type_desc,
      // constitution_cd:  tdDefTransTrf.c ,
      // constitution_cd_desc:  tdDefTransTrf.constitution_cd_desc ,
      // cert_no:  tdDefTransTrf.cert_no ,
      // opening_dt:  tdDefTransTrf.opening_dt ,
      // mat_dt:  tdDefTransTrf.mat_dt ,
      // dep_period_y:  tdDefTransTrf.dep_period_y ,
      // dep_period_m:  tdDefTransTrf.dep_period_m ,
      // dep_period_d:  tdDefTransTrf.dep_period_d ,
      // intt_trf_type:  tdDefTransTrf.intt_trf_type ,
      // intt_rate:  tdDefTransTrf.intt_rate ,
      // interest:  tdDefTransTrf.interest ,
      // td_def_mat_amt: tdDefTransTrf.td_def_mat_amt
    });
    this.mapformDataOnEditOrDelete(tdDefTransTrf);
  }

  public onUpapprovedCancel(): void {
    this.editDeleteMode = false;
    this.selectedUnapprovedTransactionToEdit = null;
    this.modalRef.hide();
    this.showTransactionDtl = false;
  }
  /*  */
  public mapformDataOnEditOrDelete(tdDefTransTrf: td_def_trans_trf): void {
    // this.tm_denominationList = [];
    // this.resetTransfer();
    // this.tdDefTransFrm.reset(); this.showTransactionDtl = false;
    this.HandleMessage(false);
    // this.showTranferType = true;
    this.hideOnClose = false;
    this.showAmtDrpDn = false;
    this.showOnClose = false;
    this.showOnRenewal = false;
    this.showTransactionDtl = true;
    this.showTransMode = false;
    this.accNoEnteredForTransaction.ShowClose = false;
    // this.td.amount.enable();
    // this.td.amount.setValue(null);

    const accTypCode = +this.f.acc_type_cd.value;
    // const selectedOperation = this.operations.filter
    //   (e => e.oprn_cd === +this.f.oprn_cd.value)[0];

    // this.transType = new DynamicSelect();
    if (tdDefTransTrf.trans_type.toLowerCase() === 'w') {
      this.showTransMode = true;
      if (tdDefTransTrf.trans_mode.toLowerCase() === 'c') {
        // this is the case of close
        if (accTypCode === 2 || accTypCode === 3 ||
          accTypCode === 4 || accTypCode === 5 ||
          accTypCode === 6) {
          this.showOnClose = true;
        }
        this.hideOnClose = true;
      }
    } else if (tdDefTransTrf.trans_type.toLowerCase() === 'd') {
      this.hideOnClose = true;
      if (accTypCode === 6) {
        this.hideOnClose = true;
        this.showAmtDrpDn = true;
      }
      if (null !== tdDefTransTrf.trans_mode) {
        if (tdDefTransTrf.trans_mode.toLowerCase() === 'r') {
          // this is the case of renewal
          this.showOnRenewal = true;
          this.hideOnClose = true;
        } else if (tdDefTransTrf.trans_mode.toLowerCase() === 'v') {
          this.hideOnClose = true;
          this.showAmtDrpDn = true;
        }
      }
      if (accTypCode === 1) { this.hideOnClose = false; }
    }
  }

  /* method fires on operation type change */
  public onOperationTypeChange(): void {
    debugger;
    this.tm_denominationList = [];
    this.resetTransfer();
    this.tdDefTransFrm.reset(); this.showTransactionDtl = false;
    this.HandleMessage(false);
    // this.showTranferType = true;
    this.hideOnClose = false;
    this.showBalance = false;
    this.showTransfrTyp = true;
    this.showAmtDrpDn = false;
    this.showOnClose = false;
    this.showOnRenewal = false;
    this.showTransactionDtl = true;
    this.showTransMode = false;
    this.accNoEnteredForTransaction.ShowClose = false;
    this.td.amount.enable();
    this.td.amount.setValue(null);

    /* check if there any unapproved transaction
    exixits already for non saving accounts*/
    const accTypCode = +this.f.acc_type_cd.value;
    const selectedOperation = this.operations.filter
      (e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    if (undefined === this.unApprovedTransactionLst ||
      null === this.unApprovedTransactionLst ||
      this.unApprovedTransactionLst.length <= 0) {
      this.isLoading = true;
      const tdDepTrans = new td_def_trans_trf();
      tdDepTrans.brn_cd = this.sys.BranchCode;
      this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', tdDepTrans).subscribe(
        res => {
          this.isLoading = false;
          if (res.length > 0) {
            this.unApprovedTransactionLst = res;
            const unapprovedTrans = this.unApprovedTransactionLst.filter(e => e.acc_num
              === this.f.acct_num.value.toString())[0];
            if (accTypCode === 1 &&
              selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') { } else {
              if (undefined === unapprovedTrans || Object.keys(unapprovedTrans).length === 0) { } else {
                this.HandleMessage(true, MessageType.Error,
                  `Un-approved Transaction already exists for the Account ${this.f.acct_num.value}`);
                this.onResetClick();
                return;
              }
            }
            const unapprovedTransForTdy = this.unApprovedTransactionLst.filter(e => e.trans_dt
              === this.sys.CurrentDate)[0];
            if (undefined !== unapprovedTrans && Object.keys(unapprovedTrans).length > 0) {
              this.HandleMessage(true, MessageType.Warning,
                `Today few transaction has been done for Acc# ${this.f.acct_num.value}.`);
            }
          }
        },
        err => { this.isLoading = false; }
      );
    }

    this.transType = new DynamicSelect();
    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
      this.transType.key = 'W';
      this.transType.Description = 'Withdrawl';
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key
      });
      this.showTransMode = true;
    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
      this.transType.key = 'D';
      this.transType.Description = 'Deposit';
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key
      });

    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'rd installment') {
      this.transType.key = 'D';
      this.transType.Description = 'Deposit';
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key,
        trans_mode: 'C',
        amount: this.accNoEnteredForTransaction.instl_amt
      });
      this.hideOnClose = true;
      this.showAmtDrpDn = true;
    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
      // check maturity of account
      let isMatured = false;
      const cDt = this.sys.CurrentDate.getTime();
      const matDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime();
      if (cDt > matDt) {
        isMatured = true;
      }

      this.transType.key = 'W';
      this.transType.Description = 'Close';
      this.accNoEnteredForTransaction.ShowClose = true;
      // this.accNoEnteredForTransaction.acc_close_dt = new Date();
      // this.refresh = false;
      // this.msg.sendCommonTmDepositAll(this.accNoEnteredForTransaction);
      // this.refresh = true;
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key,
        trans_mode: 'C',
        amount: accTypCode === 6 ? this.accNoEnteredForTransaction.instl_amt : 0
      });
      if (accTypCode === 2 || accTypCode === 3 ||
        accTypCode === 4 || accTypCode === 5 ||
        accTypCode === 6) {
        this.showOnClose = true;
        this.td.amount.disable();
        this.tdDefTransFrm.patchValue({
          // amount: (this.accNoEnteredForTransaction.prn_amt +
          //   (this.accNoEnteredForTransaction.intt_amt > 0 ?
          //   this.accNoEnteredForTransaction.intt_amt :
          //   (0.015 * this.accNoEnteredForTransaction.prn_amt))).toFixed(2),
          amount: (this.accNoEnteredForTransaction.prn_amt).toFixed(2),
          curr_intt_recov: (this.accNoEnteredForTransaction.intt_amt > 0 ?
            this.accNoEnteredForTransaction.intt_amt :
            (0.015 * this.accNoEnteredForTransaction.prn_amt)).toFixed(2),
          ovd_intt_recov: '',
          curr_prn_recov: isMatured ? (this.sys.DepositBonusRate *
            this.accNoEnteredForTransaction.prn_amt).toFixed(2) : '',
          td_def_mat_amt: (this.accNoEnteredForTransaction.prn_amt +
            (this.accNoEnteredForTransaction.intt_amt > 0 ?
              this.accNoEnteredForTransaction.intt_amt :
              (0.015 * this.accNoEnteredForTransaction.prn_amt))).toFixed(2)
        });
      }
      if (accTypCode === 5) { // Special logic for MIS on close
        this.showOnClose = true;
        this.td.amount.disable();
        this.tdDefTransFrm.patchValue({
          // amount: this.accNoEnteredForTransaction.prn_amt
          // + this.accNoEnteredForTransaction.intt_amt,
          amount: this.accNoEnteredForTransaction.prn_amt,
          curr_intt_recov: this.accNoEnteredForTransaction.intt_amt,
          ovd_intt_recov: '',
          curr_prn_recov: isMatured ? (this.sys.DepositBonusRate *
            this.accNoEnteredForTransaction.prn_amt).toFixed(2) : '',
          td_def_mat_amt: (this.accNoEnteredForTransaction.prn_amt
            + this.accNoEnteredForTransaction.intt_amt)
        });
      }
      if (accTypCode === 6) { // Special logic for RD on close
        let param = new p_gen_param();
        param.as_acc_num = this.accNoEnteredForTransaction.acc_num;
        param.ad_instl_amt = this.accNoEnteredForTransaction.instl_amt;
        param.an_instl_no = this.accNoEnteredForTransaction.instl_no;
        param.an_intt_rate = isMatured ? this.accNoEnteredForTransaction.intt_rt :
          (this.accNoEnteredForTransaction.intt_rt - this.sys.PenalInttRtFrAccPreMatureClosing);

        this.svc.addUpdDel<any>('Deposit/F_CALCRDINTT_REG', param).subscribe(
          res => {
            if (undefined !== res
              && null !== res
              && res > 0) {
              this.tdDefTransFrm.patchValue({
                curr_intt_recov: res.toFixed(2)
              });
            }
          },
          err => { console.log(err); }
        );
        param = new p_gen_param();
        param.as_acc_num = this.accNoEnteredForTransaction.acc_num;
        this.svc.addUpdDel<any>('Deposit/F_CAL_RD_PENALTY', param).subscribe(
          res => {
            if (undefined !== res
              && null !== res
              && res > 0) {
              this.tdDefTransFrm.patchValue({
                ovd_intt_recov: res.toFixed(2)
              });
            }
          },
          err => { console.log(err); }
        );
        // if premature closing show warning of how many days month and yr left
        if (!isMatured) {
          const crDt = this.sys.CurrentDate;
          const matuDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString());

          let diff = Math.abs(crDt.getTime() - matuDt.getTime());
          let diffYear = diff / 1000;
          diffYear /= (60 * 60 * 24);
          diffYear = Math.abs(Math.round(diffYear / 365.25));

          if (diffYear > 0) { crDt.setFullYear(crDt.getFullYear() + diffYear); }
          diff = Math.abs(crDt.getTime() - matuDt.getTime());
          let diffMonth = diff / 1000;
          diffMonth /= (60 * 60 * 24 * 7 * 4);
          diffMonth = Math.abs(Math.round(diffMonth));

          if (diffMonth > 0) { crDt.setMonth(diffMonth); }
          diff = Math.abs(crDt.getTime() - matuDt.getTime());
          const daysDiff = diff / (1000 * 3600 * 24);
          const msg = `Account# ${this.accNoEnteredForTransaction.acc_num}, will mature in ${diffYear} year(s), ${diffMonth} month(s) and ${daysDiff} day(s) .`;
          this.HandleMessage(true, MessageType.Warning, msg);
          alert(msg);
        }

      }
      this.hideOnClose = true;
      if (accTypCode === 1) { // Special logic for Saving on close
        debugger;
        this.F_CALC_SB_INTT();
        this.tdDefTransFrm.patchValue({
          paid_to: 'SELF',
          particulars: 'To Closing ',
        });
        this.hideOnClose = false;
      }
    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
      /** hide transfer type for renewal of FD */
      if (accTypCode === 2) {
        this.showTransfrTyp = false;
      } else {
        this.showTransfrTyp = true;
      }
      /* check if for acct_type 2,4,5 mat is past today date
             pre mature acctype shpuld not be shown */

      if ((accTypCode === 2 || accTypCode === 4 || accTypCode === 5)) {
        const cDt = this.sys.CurrentDate.getTime();
        const chDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime();
        if (chDt > cDt) {
          this.HandleMessage(true, MessageType.Error,
            `Can not re-new, account number ${this.f.acct_num.value} it\'s not matured yet.`);
          this.onResetClick();
          return;
        }
      }
      this.transType.key = 'D';
      const constitution = AccounTransactionsComponent.constitutionList.filter(e => e.constitution_cd
        === this.accNoEnteredForTransaction.constitution_cd)[0];
      this.transType.Description = 'Renewal';
      this.accNoEnteredForTransaction.ShowClose = true;
      this.showOnRenewal = true;
      // this.showTranferType = false;
      this.hideOnClose = true;
      // this.accNoEnteredForTransaction.acc_close_dt = new Date();
      // console.log(this.accNoEnteredForTransaction);
      // this.refresh = false;
      // this.msg.sendCommonTmDepositAll(this.accNoEnteredForTransaction);
      // this.refresh = true;
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key,
        trans_mode: 'R',
        constitution_cd: this.accNoEnteredForTransaction.constitution_cd,
        constitution_cd_desc: (undefined !== constitution && null !== constitution
          && undefined !== constitution.constitution_desc && null !== constitution.constitution_desc) ?
          constitution.constitution_desc : null,
        cert_no: this.accNoEnteredForTransaction.cert_no,
        opening_dt: this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10),
        dep_period_y: this.accNoEnteredForTransaction.dep_period.split(';')[0].split('=')[1],
        dep_period_m: this.accNoEnteredForTransaction.dep_period.split(';')[1].split('=')[1],
        dep_period_d: this.accNoEnteredForTransaction.dep_period.split(';')[2].split('=')[1],
        amount: this.accNoEnteredForTransaction.prn_amt
          + this.accNoEnteredForTransaction.intt_amt
      });
      this.onDepositePeriodChange();

    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment') {
      this.transType.key = 'D';
      this.transType.Description = 'Interest Payment';

      // this.accNoEnteredForTransaction.ShowClose = true;
      // this.showOnRenewal = true;
      // this.hideOnClose = true;
      // this.accNoEnteredForTransaction.acc_close_dt = new Date();
      // this.msg.sendCommonTmDepositAll(this.accNoEnteredForTransaction);
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key,
        trans_mode: 'V',
        paid_to: 'SELF',
        particulars: 'BY INTEREST ' + this.td.acc_type_desc.value + ' A/C :'
          + this.f.acct_num.value,
        amount: this.accNoEnteredForTransaction.instl_amt
      });
      this.hideOnClose = true;
      this.showAmtDrpDn = true;
    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'rd installment') {
      this.transType.key = 'D';
      this.transType.Description = 'Deposit';
      // this.accNoEnteredForTransaction.ShowClose = true;
      // this.showOnRenewal = true;
      this.hideOnClose = true;
      // this.accNoEnteredForTransaction.acc_close_dt = new Date();
      // this.msg.sendCommonTmDepositAll(this.accNoEnteredForTransaction);
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key
      });
    }
    this.patchtdDefTransFrm();
  }

  public inttCalOnClose(): void {
    this.td.td_def_mat_amt.setValue((this.accNoEnteredForTransaction.prn_amt +
      (+this.td.curr_intt_recov.value) + (+this.td.ovd_intt_recov.value)
      + (+this.td.curr_prn_recov.value)).toFixed(2));
    this.td.amount.setValue((this.accNoEnteredForTransaction.prn_amt +
      (+this.td.curr_intt_recov.value) + (+this.td.ovd_intt_recov.value)
      + (+this.td.curr_prn_recov.value)).toFixed(2));
  }

  private patchtdDefTransFrm(): void {
    const acctTypCdTofilter = +this.f.acc_type_cd.value;
    const acctTypeDesription = AccounTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter)[0].acc_type_desc;
    this.tdDefTransFrm.patchValue({
      acc_num: this.accNoEnteredForTransaction.acc_num,
      acc_type_desc: acctTypeDesription,
      acc_type_cd: acctTypCdTofilter,
      trans_type: this.transType.Description,
      trans_type_key: this.transType.key
    });
  }

  private enableSave(): void {
    // check all the rules to enable save
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
      if (((+this.td.amount.value) <= 0)) {
        this.disableSave = true;
      } else {
        this.disableSave = false;
      }
    }
  }

  onDepositePeriodChange(): void {
    let matDt = 0;
    this.tdDefTransFrm.patchValue({
      mat_dt: ''
    });
    const d = Utils.convertStringToDt(this.td.opening_dt.value);
    if ((+this.td.dep_period_y.value) > 0) {
      matDt = d.setFullYear(d.getFullYear() + (+this.td.dep_period_y.value));
    }
    if ((+this.td.dep_period_m.value) > 0) {
      matDt = d.setMonth(d.getMonth() + (+this.td.dep_period_m.value));
    }
    if ((+this.td.dep_period_d.value) > 0) {
      matDt = d.setDate(d.getDate() + (+this.td.dep_period_d.value));
    }
    if (matDt > 0) {
      this.processInterest();
      this.tdDefTransFrm.patchValue({
        mat_dt: Utils.convertDtToString(new Date(matDt))
      });
    }
  }

  onTransModeChange(): void {
    const selectedTransMode = this.td.trans_mode.value;
    if ('Q' === selectedTransMode) {
      // check if cheque facility is available or not
      if (this.accNoEnteredForTransaction.cheque_facility_flag === 'N') {
        this.td.trans_mode.reset();
        alert('Account does not have cheque facility.');
        return;
      }
      this.showInstrumentDtl = true;
    } else {
      this.showInstrumentDtl = false;
    }
  }

  onTransTypeChange(): void {
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    const accTypeCd = +this.f.acc_type_cd.value;
    if (accTypeCd !== 2
      && accTypeCd !== 3
      && accTypeCd !== 4
      && accTypeCd !== 5) {
      if (this.td.trf_type.value === 'C') {
        if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
          this.tdDefTransFrm.patchValue({
            paid_to: 'SELF',
            particulars: 'TO CASH '
          });
        } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
          this.tdDefTransFrm.patchValue({
            paid_to: 'SELF',
            particulars: 'BY CASH '
          });
        }

      } else {
        if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
          this.tdDefTransFrm.patchValue({
            paid_to: 'SELF',
            particulars: 'TO TRANSFER'
          });
        } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
          this.tdDefTransFrm.patchValue({
            paid_to: 'SELF',
            particulars: 'BY TRANSFER'
          });
        }
      }
    }

    if (this.td.trf_type.value === 'C') {
      this.addDenomination();
    }
  }

  // private checkUnaprovedTransactionExixts(): boolean {
  //   this.GetUnapprovedDepTrans();
  //   const unapprovedTrans = this.unApprovedTransactionLst.filter(e => e.acc_num
  //     === this.f.acct_num.value.toString())[0];

  //   if (undefined === unapprovedTrans || Object.keys(unapprovedTrans).length === 0) {
  //     return false;
  //   }
  //   return true;
  // }

  onAmtChng(): void {
    this.HandleMessage(false);
    if ((+this.td.amount.value) < 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be negative.');
      this.td.amount.setValue('');
      return;
    }
    const accTypeCd = +this.f.acc_type_cd.value;
    if (accTypeCd === 1) { // check Shadow balance for saving only
      if (this.td.trans_type_key.value === 'W') {
        const tmDep = new tm_deposit();
        let shadowBalance = 0;
        tmDep.acc_type_cd = accTypeCd;
        tmDep.brn_cd = this.sys.BranchCode;
        tmDep.acc_num = this.f.acct_num.value;
        this.svc.addUpdDel<any>('Deposit/GetShadowBalance', tmDep).subscribe(
          res => {
            if (undefined !== res && null !== res && !isNaN(+res)) {
              shadowBalance = res;
              if (shadowBalance - (+this.td.amount.value) < 0) {
                this.HandleMessage(true, MessageType.Error, 'Amount can not be withdrawn more than balanace amount in Account.');
                this.td.amount.setValue('');
                return;
              } else {
                let minBal = 0;
                if (this.accNoEnteredForTransaction.cheque_facility_flag === 'Y') { minBal = +this.sys.MinBalanceWithCheque; }
                else { minBal = +this.sys.MinBalanceWithOutCheque; }
                if (shadowBalance - (+this.td.amount.value) < minBal) {
                  const cnfrm = confirm('Amount is less than minimum balance ' + minBal + '. Press Ok to continue, else Cancel');
                  if (cnfrm) {
                    if (this.td.trans_type_key.value === 'W') {
                      // todo need to change
                      this.msg.sendShdowBalance(-(+this.td.amount.value));
                    } else if (this.td.trans_type_key.value === 'D') {
                      // todo need to change
                      this.msg.sendShdowBalance((+this.td.amount.value));
                    }
                  } else {
                    this.td.amount.setValue('');
                  }
                  return;
                } else {
                  // check this.td.trans_type_key === 'W' / 'D'
                  // todo need to change
                  this.msg.sendShdowBalance(-(+this.td.amount.value));
                  // if (this.td.trans_type_key.value === 'W') {

                  // } else if (this.td.trans_type_key.value === 'D') {

                  // }
                }
              }
            }
          },
          err => {
            this.isLoading = false; console.log(err);
            this.HandleMessage(true, MessageType.Error, 'Balance in account can not be determined, Try again later.');
          }
        );
      } else {
        // todo need to change
        this.msg.sendShdowBalance((+this.td.amount.value));
      }
    } else {
      /** if amount is debited less than the min balance then a confirmation need to be shown */
      let minBal = 0;
      if (this.accNoEnteredForTransaction.cheque_facility_flag === 'Y') { minBal = +this.sys.MinBalanceWithCheque; }
      else { minBal = +this.sys.MinBalanceWithOutCheque; }
      if (minBal > 0) {
        if ((+this.td.amount.value) < minBal) {
          const cnfrm = confirm('Amount is less than minimum balance ' + minBal + '. Press Ok to continue, else Cancel');
          if (cnfrm) {
            if (this.td.trans_type_key.value === 'W') {
              // todo need to change
              this.msg.sendShdowBalance(-(+this.td.amount.value));
            } else if (this.td.trans_type_key.value === 'D') {
              // todo need to change
              this.msg.sendShdowBalance((+this.td.amount.value));
            }
          } else {
            this.td.amount.setValue('');
          }
          return;
        }
      }
      this.checkEnteredAmt();
    }

    // this.td_deftranstrfList[0].amount = this.td.amount.value;
  }

  checkEnteredAmt(): void {
    const accTypeCd = +this.f.acc_type_cd.value;
    // For Term Deposit operation close
    // check amount can not be greater than maturity amount.
    if ((accTypeCd === 4 || accTypeCd === 2 || accTypeCd === 7)
      && this.td.trans_type_key.value === 'W') {
      const matAmt = this.accNoEnteredForTransaction.prn_amt
        + this.accNoEnteredForTransaction.intt_amt;
      if ((+this.td.amount.value) > matAmt) {
        this.HandleMessage(true, MessageType.Error,
          'Amount can not be greater than maturity amount.');
        this.td.amount.setValue('');
        return;
      }
    }
  }

  onAmtChngDuringRenewal(): void {
    debugger;
    const accTypeCd = +this.f.acc_type_cd.value;
    // this.showTranferType = false;
    this.HandleMessage(false);
    if ((+this.td.amount.value) <= 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be negative Or 0.');
      this.td.amount.setValue('');
      return;
    }
    if (this.td.trans_type_key.value === 'D') {
      const mat_amt = this.accNoEnteredForTransaction.prn_amt
        + this.accNoEnteredForTransaction.intt_amt;

      if ((mat_amt - (+this.td.amount.value)) > 0) {
        this.showBalance = true;
        this.showTransfrTyp = true;
        this.td.balance.setValue((mat_amt - (+this.td.amount.value)));
      } else if ((mat_amt - (+this.td.amount.value)) === 0) {
        this.showBalance = false;
        this.showTransfrTyp = false;
        this.td.balance.setValue((mat_amt - (+this.td.amount.value)));
      } else if (((+this.td.amount.value) - mat_amt) > 0) {
        // close transfer area
        this.HandleMessage(true, MessageType.Error, 'Amount can not be greater than maturity amount.');
        this.td.amount.setValue('');
        this.showBalance = false;
        this.td.balance.setValue('');
        if (accTypeCd === 2) {
          this.td.amount.setValue(mat_amt);
          this.showTransfrTyp = false;
        }
        return;
      }
    }
    // this.td_deftranstrfList[0].amount = this.td.amount.value;
  }

  onSaveClick(): void {
    const accTypeCd = +this.f.acc_type_cd.value;
    if ((+this.td.amount.value) <= 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be blank');
      return;
    }

    /** do not check transfer type for FD renewal which doesnt have balance */
    if (accTypeCd !== 2 && !this.showBalance) {
      if (undefined === this.td.trf_type.value
        || null === this.td.trf_type.value
        || this.td.trf_type.value === '') {
        this.HandleMessage(true, MessageType.Error, 'Please choose transfer type.');
        return;
      }
    }
    if (accTypeCd !== 2 && !this.showBalance) {
      if (this.td.trf_type.value === 'C' && this.denominationGrandTotal !== (+this.td.amount.value)) {
        this.HandleMessage(true, MessageType.Error,
          `Denomination total amount ₹${this.denominationGrandTotal}, ` +
          ` do not match with transaction amount ₹${this.td.amount.value}`);
        return;
      }

      if (this.td.trf_type.value === 'T' && this.TrfTotAmt !== (+this.td.amount.value)) {
        this.HandleMessage(true, MessageType.Error,
          `Transfer total amount ₹${this.TrfTotAmt}, ` +
          ` do not match with transaction amount ₹${this.td.amount.value}`);
        return;
      }
    } else {
      if (this.td.trf_type.value === 'C' && this.denominationGrandTotal !== (+this.td.balance.value)) {
        this.HandleMessage(true, MessageType.Error,
          `Denomination total amount ₹${this.denominationGrandTotal}, ` +
          ` do not match with balance amount ₹${this.td.balance.value}`);
        return;
      }

      if (this.td.trf_type.value === 'T' && this.TrfTotAmt !== (+this.td.balance.value)) {
        this.HandleMessage(true, MessageType.Error,
          `Transfer total amount ₹${this.TrfTotAmt}, ` +
          ` do not match with balance amount ₹${this.td.balance.value}`);
        return;
      }
    }
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    debugger;
    if (!this.editDeleteMode) {
      this.isLoading = true; const saveTransaction = new AccOpenDM();
      const tdDefTrans = this.mappTddefTransFromFrm();
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
        saveTransaction.tmdepositrenew = this.mapRenewData();
      }
      saveTransaction.tddeftrans = tdDefTrans;
      if (this.td.trf_type.value === 'C') {
        saveTransaction.tmdenominationtrans = this.tm_denominationList;
      } else if (this.td.trf_type.value === 'T') {
        let i = 0;
        this.td_deftranstrfList.forEach(e => {
          const tdDefTransAndTranfer = this.mappTddefTransAndTransFrFromFrm();
          if (e.trans_type === 'cust_acc') {
            tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
            tdDefTransAndTranfer.acc_num = e.cust_acc_number;
            tdDefTransAndTranfer.acc_name = e.cust_name;
            tdDefTransAndTranfer.instrument_num = e.instrument_num;
            tdDefTransAndTranfer.acc_cd = e.acc_cd;
            tdDefTransAndTranfer.remarks = 'D';
            tdDefTransAndTranfer.disb_id = ++i;
          } else {
            tdDefTransAndTranfer.acc_type_cd = +e.gl_acc_code;
            tdDefTransAndTranfer.acc_num = '0000';
            tdDefTransAndTranfer.acc_name = e.gl_acc_desc;
            tdDefTransAndTranfer.instrument_num = e.instrument_num;
            tdDefTransAndTranfer.acc_cd = +e.gl_acc_code;
            tdDefTransAndTranfer.remarks = 'X';
            tdDefTransAndTranfer.disb_id = ++i;
          }
          if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'rd installment') {
            tdDefTransAndTranfer.trans_type = 'W';
            tdDefTransAndTranfer.trans_mode = 'C';
          }
          if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment') {
            tdDefTransAndTranfer.trans_type = 'D';
            tdDefTransAndTranfer.trans_mode = 'C';
          }
          tdDefTransAndTranfer.amount = e.amount;
          saveTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
        });

        const tmTrnsfr = new tm_transfer();
        tmTrnsfr.brn_cd = this.sys.BranchCode;
        tmTrnsfr.trf_dt = this.sys.CurrentDate;
        tmTrnsfr.created_by = this.sys.UserId;
        tmTrnsfr.approval_status = 'U';

        saveTransaction.tmtransfer.push(tmTrnsfr);
      }
      this.svc.addUpdDel<AccOpenDM>('Deposit/InsertAccountOpeningData', saveTransaction).subscribe(
        res => {
          this.HandleMessage(true, MessageType.Sucess, 'Saved sucessfully, your transaction code is :' + res);
          this.tdDefTransFrm.reset(); this.f.oprn_cd.reset();
          this.getShadowBalance();
          this.isLoading = false;
        },
        err => { this.isLoading = false; console.error('Error on onSaveClick' + JSON.stringify(err)); }
      );
    } else {
      const updateTransaction = new LoanOpenDM();
      updateTransaction.tddeftrans = this.mappTddefTransFromFrm();
      // if (null !== this.td.trans_mode
      //   && this.td.trans_mode.value.toLowerCase() === 'r') {
      //   updateTransaction.tmdepositrenew = this.mapRenewData();
      // }
      if (this.td.trf_type.value === 'C') {
        // this.td.trans_cd.value;
        this.tm_denominationList.forEach(ele => {
          ele.trans_cd = this.td.trans_cd.value;
        });
        updateTransaction.tmdenominationtrans = this.tm_denominationList;
      } else if (this.td.trf_type.value === 'T') {
        let i = 0;
        this.td_deftranstrfList.forEach(e => {
          const tdDefTransAndTranfer = this.mappTddefTransFromFrm();
          if (e.trans_type === 'cust_acc') {
            tdDefTransAndTranfer.trans_cd = this.td.trans_cd.value;
            tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
            tdDefTransAndTranfer.acc_num = e.cust_acc_number;
            tdDefTransAndTranfer.acc_name = e.cust_name;
            tdDefTransAndTranfer.instrument_num = e.instrument_num;
            tdDefTransAndTranfer.acc_cd = e.acc_cd;
            tdDefTransAndTranfer.remarks = 'D';
            tdDefTransAndTranfer.disb_id = ++i;
          } else {
            tdDefTransAndTranfer.trans_cd = this.td.trans_cd.value;
            tdDefTransAndTranfer.acc_type_cd = +e.gl_acc_code;
            tdDefTransAndTranfer.acc_num = '0000';
            tdDefTransAndTranfer.acc_name = e.gl_acc_desc;
            tdDefTransAndTranfer.instrument_num = e.instrument_num;
            tdDefTransAndTranfer.acc_cd = +e.gl_acc_code;
            tdDefTransAndTranfer.remarks = 'X';
            tdDefTransAndTranfer.disb_id = ++i;
          }
          if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'rd installment') {
            tdDefTransAndTranfer.trans_type = 'W';
            tdDefTransAndTranfer.trans_mode = 'C';
          }
          if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment') {
            tdDefTransAndTranfer.trans_type = 'D';
            tdDefTransAndTranfer.trans_mode = 'C';
          }
          tdDefTransAndTranfer.amount = e.amount;
          updateTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
        });
      }
      this.svc.addUpdDel<LoanOpenDM>('Common/UpdateTransactionDetails', updateTransaction).subscribe(
        res => {
          const accNum = this.f.acct_num.value;
          if ((+res) === -1) {
            this.HandleMessage(true, MessageType.Error, `Transaction for Acc# ${accNum},
            Not updated sucessfully.`);
          } else {
            this.HandleMessage(true, MessageType.Sucess, `Transaction for Acc# ${accNum},
            updated sucessfully.`);
            this.onResetClick();
          }
          this.isLoading = false;
        },
        err => { this.isLoading = false; console.error('Error on Update Transaction' + JSON.stringify(err)); }
      );
    }
  }

  mappTddefTransFromFrm(): td_def_trans_trf {
    // debugger;
    const toReturn = new td_def_trans_trf();
    if (!this.editDeleteMode) {
      const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];

      const accTypeCd = +this.f.acc_type_cd.value;
      // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
      toReturn.trans_dt = this.sys.CurrentDate;
      toReturn.acc_type_cd = this.td.acc_type_cd.value;
      toReturn.acc_num = this.td.acc_num.value;
      toReturn.trans_type = this.td.trans_type_key.value;
      toReturn.trans_mode = this.td.trans_mode.value;
      toReturn.paid_to = this.td.paid_to.value;
      toReturn.token_num = this.td.token_num.value;
      toReturn.trf_type = this.td.trf_type.value;

      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close'
        && (accTypeCd === 2
          || accTypeCd === 3
          || accTypeCd === 4
          || accTypeCd === 5
          || accTypeCd === 6)) {
        toReturn.amount = this.accNoEnteredForTransaction.prn_amt;
        toReturn.curr_intt_recov = +this.td.curr_intt_recov.value;
        toReturn.ovd_intt_recov = (accTypeCd === 5) ? 0 : +this.td.ovd_intt_recov.value;
        toReturn.curr_prn_recov = +this.td.curr_prn_recov.value;
      } else {
        if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
          toReturn.amount = +this.td.interest.value;
        } else {
          toReturn.amount = +this.td.amount.value;
        }
      }
      toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
      toReturn.instrument_dt = this.td.instrument_dt.value === '' ? null : this.td.instrument_dt.value;
      if (this.td.particulars.value === null ||
        this.td.particulars.value === '') {
        if (selectedOperation.oprn_desc.toLocaleLowerCase() !== 'close') {
          if (accTypeCd === 2
            || accTypeCd === 3
            || accTypeCd === 4
            || accTypeCd === 5) {
            toReturn.particulars = this.td.particulars.value;
          } else {
            if (this.td.trf_type.value === 'C') {
              if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
                toReturn.particulars = 'TO CASH ';
              } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
                toReturn.particulars = 'BY CASH ';
              }

            } else {
              if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
                toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
              } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
                toReturn.particulars = 'BY TRANSFER :' + this.td.acc_num.value;
              }
            }
          }
        } else {
          if (this.td.trf_type.value === 'C') {
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              toReturn.particulars = 'TO CASH ';
            } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
              toReturn.particulars = 'BY CASH ';
            }

          } else {
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
            } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
              toReturn.particulars = 'BY TRANSFER :' + this.td.acc_num.value;
            }
          }
        }
      } else { toReturn.particulars = this.td.particulars.value; }

      // if (selectedOperation.oprn_desc.toLocaleLowerCase() !== 'close' &&
      //   accTypeCd === 1) {
      //   toReturn.particulars = 'To Closing';
      //   toReturn.curr_intt_recov = +this.td.closeIntrest.value;
      // }

      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close' &&
        accTypeCd === 1) {
        toReturn.particulars = 'To Closing';
        toReturn.curr_intt_recov = +this.td.closeIntrest.value;
      }

      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal'
        && this.td.trf_type.value === '') {
        toReturn.trans_type = 'T';
      }
      toReturn.approval_status = 'U';
      toReturn.brn_cd = this.sys.BranchCode;

      if (this.td.trf_type.value === 'T') {
        toReturn.tr_acc_cd = 10000;
      } else if (this.td.trf_type.value === 'C') {
        toReturn.tr_acc_cd = 28101;
      }
      // if ((+this.f.acc_type_cd.value) === 2) {
      //   toReturn.acc_cd = 14301;
      // }
      // if ((+this.f.acc_type_cd.value) === 6) {
      //   toReturn.acc_cd = 14302;
      // }
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
        toReturn.curr_prn_recov = ((+this.td.amount.value) + (+this.td.interest.value));
        toReturn.ovd_prn_recov = this.accNoEnteredForTransaction.prn_amt;
        toReturn.curr_intt_recov = this.accNoEnteredForTransaction.intt_amt;
        toReturn.ovd_intt_recov = 0;
      }
    } else {
      toReturn.trans_dt = this.td.trans_dt.value;
      toReturn.trans_cd = this.td.trans_cd.value;
      toReturn.acc_type_cd = this.td.acc_type_cd.value;
      toReturn.acc_num = this.td.acc_num.value;
      toReturn.trans_type = this.td.trans_type_key.value;
      toReturn.trans_mode = this.td.trans_mode.value;
      toReturn.amount = this.td.amount.value;
      toReturn.instrument_dt = this.td.instrument_dt.value;
      toReturn.instrument_num = this.td.instrument_num.value;
      toReturn.paid_to = this.td.paid_to.value;
      toReturn.token_num = this.td.token_num.value;
      toReturn.approval_status = this.td.approval_status.value;
      toReturn.approved_by = this.td.approved_by.value;
      toReturn.approved_dt = this.td.approved_dt.value;
      toReturn.particulars = this.td.particulars.value;
      toReturn.tr_acc_type_cd = this.td.tr_acc_type_cd.value;
      toReturn.tr_acc_num = this.td.tr_acc_num.value;
      toReturn.voucher_dt = this.td.voucher_dt.value;
      toReturn.voucher_id = this.td.voucher_id.value;
      toReturn.trf_type = this.td.trf_type.value;
      toReturn.tr_acc_cd = this.td.tr_acc_cd.value;
      toReturn.acc_cd = this.td.acc_cd.value;
      toReturn.share_amt = this.td.share_amt.value;
      toReturn.sum_assured = this.td.sum_assured.value;
      toReturn.paid_amt = this.td.paid_amt.value;
      toReturn.curr_prn_recov = this.td.curr_prn_recov.value;
      toReturn.ovd_prn_recov = this.td.ovd_prn_recov.value;
      toReturn.curr_intt_recov = this.td.curr_intt_recov.value;
      toReturn.ovd_intt_recov = this.td.ovd_intt_recov.value;
      toReturn.remarks = this.td.remarks.value;
      toReturn.crop_cd = this.td.crop_cd.value;
      toReturn.activity_cd = this.td.activity_cd.value;
      toReturn.curr_intt_rate = this.td.curr_intt_rate.value;
      toReturn.ovd_intt_rate = this.td.ovd_intt_rate.value;
      toReturn.instl_no = this.td.instl_no.value;
      toReturn.instl_start_dt = this.td.instl_start_dt.value;
      toReturn.periodicity = this.td.periodicity.value;
      toReturn.disb_id = this.td.disb_id.value;
      toReturn.comp_unit_no = this.td.comp_unit_no.value;
      toReturn.ongoing_unit_no = this.td.ongoing_unit_no.value;
      toReturn.mis_advance_recov = this.td.mis_advance_recov.value;
      toReturn.audit_fees_recov = this.td.audit_fees_recov.value;
      toReturn.sector_cd = this.td.sector_cd.value;
      toReturn.spl_prog_cd = this.td.spl_prog_cd.value;
      toReturn.borrower_cr_cd = this.td.borrower_cr_cd.value;
      toReturn.intt_till_dt = this.td.intt_till_dt.value;
      toReturn.acc_name = this.td.acc_name.value;
      toReturn.brn_cd = this.td.brn_cd.value;
      toReturn.trf_type_desc = this.td.trf_type_desc.value;
    }

    toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;
    toReturn.disb_id = 1;
    toReturn.created_by = this.sys.UserId;

    return toReturn;
  }

  mappTddefTransAndTransFrFromFrm(): td_def_trans_trf {
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    const toReturn = new td_def_trans_trf();
    const accTypeCd = +this.f.acc_type_cd.value;
    // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
    toReturn.trans_dt = this.sys.CurrentDate;
    toReturn.acc_type_cd = this.td.acc_type_cd.value;
    toReturn.acc_num = this.td.acc_num.value;
    // toReturn.trans_mode = this.td.trans_mode.value;
    toReturn.paid_to = this.td.paid_to.value;
    toReturn.token_num = this.td.token_num.value;
    toReturn.trf_type = this.td.trf_type.value;

    /*Logic to populate transation type of td_def_trans_Trf */
    switch (selectedOperation.oprn_desc.toLocaleLowerCase()) {
      case 'close':
      case 'withdraw':
        toReturn.trans_type = 'D';
        break;
      case 'renewal':
      case 'deposit':
        toReturn.trans_type = 'W';
        break;
    }

    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close'
      && (accTypeCd === 2
        || accTypeCd === 3
        || accTypeCd === 4
        || accTypeCd === 5
        || accTypeCd === 6)) {
      toReturn.amount = this.accNoEnteredForTransaction.prn_amt;
      toReturn.curr_intt_recov = this.accNoEnteredForTransaction.intt_amt;
    } else {
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
        toReturn.amount = +this.td.interest.value;
      } else {
        toReturn.amount = +this.td.amount.value;
      }
    }
    toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
    toReturn.instrument_dt = this.td.instrument_dt.value === '' ? null : this.td.instrument_dt.value;
    if (this.td.particulars.value === null ||
      this.td.particulars.value === '') {
      if (selectedOperation.oprn_desc.toLocaleLowerCase() !== 'close') {
        if (accTypeCd === 2
          || accTypeCd === 3
          || accTypeCd === 4
          || accTypeCd === 5) {
          toReturn.particulars = this.td.particulars.value;
        } else {
          // if (this.td.trf_type.value === 'T') {
          //   toReturn.particulars = 'BY TRANSFER TO ' + this.td.particulars.value + ':' + this.td.acc_num.value;
          // } else if (this.td.trf_type.value === 'C') {
          //   toReturn.particulars = 'BY CASH';
          // }
          if (this.td.trf_type.value === 'C') {
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              toReturn.particulars = 'TO CASH ';
            } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
              toReturn.particulars = 'BY CASH ';
            }

          } else {
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
            } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
              toReturn.particulars = 'BY TRANSFER FROM :' + this.td.acc_num.value;
            }
          }
        }
      } else {
        // if (this.td.trf_type.value === 'T') {
        //   toReturn.particulars = 'BY TRANSFER TO ' + this.td.particulars.value + ':' + this.td.acc_num.value;
        // } else if (this.td.trf_type.value === 'C') {
        //   toReturn.particulars = 'BY CASH';
        // }
        if (this.td.trf_type.value === 'C') {
          if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
            toReturn.particulars = 'TO CASH ';
          } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
            toReturn.particulars = 'BY CASH ';
          }

        } else {
          if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
            toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
          } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
            toReturn.particulars = 'BY TRANSFER FROM :' + this.td.acc_num.value;
          }
        }
      }
    } else { toReturn.particulars = this.td.particulars.value; }

    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal'
      && this.td.trf_type.value === '') {
      toReturn.trans_type = 'T';
    }
    toReturn.approval_status = 'U';
    toReturn.brn_cd = this.sys.BranchCode;

    if (this.td.trf_type.value === 'T') {
      toReturn.tr_acc_cd = 10000;
    } else if (this.td.trf_type.value === 'C') {
      toReturn.tr_acc_cd = 28101;
    }
    // if ((+this.f.acc_type_cd.value) === 2) {
    //   toReturn.acc_cd = 14301;
    // }
    // if ((+this.f.acc_type_cd.value) === 6) {
    //   toReturn.acc_cd = 14302;
    // }
    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
      toReturn.curr_prn_recov = ((+this.td.amount.value) + (+this.td.interest.value));
      toReturn.ovd_prn_recov = this.accNoEnteredForTransaction.prn_amt;
      toReturn.curr_intt_recov = this.accNoEnteredForTransaction.intt_amt;
      toReturn.ovd_intt_recov = 0;
    }

    toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;
    toReturn.disb_id = 1;
    toReturn.created_by = this.sys.UserId;

    return toReturn;
  }

  mapRenewData(): tm_deposit {

    const toReturn = new tm_deposit();
    // Year=0;Month=0;Day=313
    const depPrd = 'Year=' + (this.td.dep_period_y.value === '' ? '0' : this.td.dep_period_y.value) +
      ';Month=' + (this.td.dep_period_m.value === '' ? '0' : this.td.dep_period_m.value) +
      ';Day=' + (this.td.dep_period_d.value === '' ? '0' : this.td.dep_period_d.value);

    toReturn.brn_cd = this.accNoEnteredForTransaction.brn_cd;
    toReturn.acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
    toReturn.acc_num = this.accNoEnteredForTransaction.acc_num;
    toReturn.renew_id = this.accNoEnteredForTransaction.renew_id;
    toReturn.cust_cd = this.accNoEnteredForTransaction.cust_cd;
    toReturn.intt_trf_type = this.td.intt_trf_type.value;
    toReturn.constitution_cd = (+this.td.constitution_cd.value);
    toReturn.oprn_instr_cd = this.accNoEnteredForTransaction.oprn_instr_cd;
    toReturn.opening_dt = Utils.convertStringToDt(this.td.opening_dt.value);
    toReturn.prn_amt = (+this.td.amount.value);
    toReturn.intt_amt = (+this.td.interest.value);
    toReturn.dep_period = depPrd;
    toReturn.instl_amt = this.accNoEnteredForTransaction.instl_amt;
    toReturn.instl_no = this.accNoEnteredForTransaction.instl_no;
    toReturn.mat_dt = Utils.convertStringToDt(this.td.mat_dt.value);
    toReturn.intt_rt = (+this.td.intt_rate.value);
    toReturn.tds_applicable = this.accNoEnteredForTransaction.tds_applicable;
    toReturn.last_intt_calc_dt = this.accNoEnteredForTransaction.last_intt_calc_dt;
    // toReturn.acc_close_dt = this.accNoEnteredForTransaction.acc_close_dt;
    // toReturn.closing_prn_amt = this.accNoEnteredForTransaction.closing_prn_amt;
    // toReturn.closing_intt_amt = this.accNoEnteredForTransaction.closing_intt_amt;
    // toReturn.penal_amt = this.accNoEnteredForTransaction.penal_amt;
    // toReturn.ext_instl_tot = this.accNoEnteredForTransaction.ext_instl_tot;
    // toReturn.mat_status = this.accNoEnteredForTransaction.mat_status;
    // toReturn.acc_status = this.accNoEnteredForTransaction.acc_status;
    // toReturn.curr_bal = this.accNoEnteredForTransaction.curr_bal;
    // toReturn.clr_bal = this.accNoEnteredForTransaction.clr_bal;
    toReturn.standing_instr_flag = this.accNoEnteredForTransaction.standing_instr_flag;
    toReturn.cheque_facility_flag = this.accNoEnteredForTransaction.cheque_facility_flag;
    toReturn.approval_status = this.accNoEnteredForTransaction.approval_status;
    toReturn.approved_by = this.accNoEnteredForTransaction.approved_by;
    toReturn.approved_dt = this.accNoEnteredForTransaction.approved_dt;
    toReturn.user_acc_num = this.accNoEnteredForTransaction.user_acc_num;
    // toReturn.lock_mode = this.accNoEnteredForTransaction.lock_mode;
    // toReturn.loan_id = this.accNoEnteredForTransaction.loan_id;
    // toReturn.cert_no = this.td.cert_no.value;
    // toReturn.bonus_amt = this.accNoEnteredForTransaction.bonus_amt;
    // toReturn.penal_intt_rt = this.accNoEnteredForTransaction.penal_intt_rt;
    // toReturn.bonus_intt_rt = this.accNoEnteredForTransaction.bonus_intt_rt;
    // toReturn.transfer_flag = this.accNoEnteredForTransaction.transfer_flag;
    // toReturn.transfer_dt = this.accNoEnteredForTransaction.transfer_dt;
    toReturn.agent_cd = this.accNoEnteredForTransaction.agent_cd;
    toReturn.cust_name = this.accNoEnteredForTransaction.cust_name;
    toReturn.cust_type = this.accNoEnteredForTransaction.cust_type;
    toReturn.sex = this.accNoEnteredForTransaction.sex;
    toReturn.phone = this.accNoEnteredForTransaction.phone;
    toReturn.occupation = this.accNoEnteredForTransaction.occupation;
    toReturn.created_by = this.sys.UserId;
    toReturn.modified_by = this.sys.UserId;
    toReturn.constitution_desc = this.accNoEnteredForTransaction.constitution_desc;
    toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;

    return toReturn;
  }

  // mapDenominationToTmdenominationtrans(): void {

  // }

  onResetClick(): void {
    // this.HandleMessage(false);
    this.editDeleteMode = false;
    this.accTransFrm.reset();
    this.tdDefTransFrm.reset(); this.showTransactionDtl = false;
    // this.getOperationMaster();
    this.f.oprn_cd.disable();
    this.f.acct_num.disable();
    this.accNoEnteredForTransaction = undefined;
    // this.msg.sendCommonTmDepositAll(null);
    this.tm_denominationList = [];
    this.td_deftranstrfList = [];
  }

  addDenomination() {
    let alreadyHasEmptyDenominationItem = false;
    if (this.tm_denominationList.length >= 1) {
      // check if tm_denominationList has any blank items
      this.tm_denominationList.forEach(element => {
        if (!alreadyHasEmptyDenominationItem) {
          if (undefined === element.rupees
            || undefined === element.count
            || undefined === element.total) { alreadyHasEmptyDenominationItem = true; }
        }
      });
    }
    if (alreadyHasEmptyDenominationItem) { return; }

    const temp_denomination = new tm_denomination_trans();
    temp_denomination.brn_cd = localStorage.getItem('__brnCd');
    temp_denomination.trans_dt = this.sys.CurrentDate;
    this.tm_denominationList.push(temp_denomination);
  }

  removeDenomination() {
    if (this.tm_denominationList.length >= 1) {
      this.tm_denominationList.pop();
      this.denominationGrandTotal = 0;
      for (const l of this.tm_denominationList) {
        this.denominationGrandTotal = this.denominationGrandTotal + l.total;
      }
    }
  }

  setDenomination(val: number, idx: number) {
    val = +val;
    this.tm_denominationList[idx].rupees = val;
    this.tm_denominationList[idx].rupees_desc =
      this.denominationList.filter(x => x.value === val)[0].rupees;
    this.calculateTotalDenomination(idx);
  }

  calculateTotalDenomination(idx: number) {
    let r = 0;
    let c = 0;

    if (this.tm_denominationList[idx].rupees != null) {
      r = this.tm_denominationList[idx].rupees;
    }

    if (this.tm_denominationList[idx].count != null) {
      this.tm_denominationList[idx].count = Number(this.tm_denominationList[idx].count);
      c = this.tm_denominationList[idx].count;
    }

    this.tm_denominationList[idx].total = r * c;

    this.denominationGrandTotal = 0;
    for (const l of this.tm_denominationList) {
      this.denominationGrandTotal = this.denominationGrandTotal + l.total;
    }
  }

  getAccountTypeList() {
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {

        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {

      }
    );
  }
  public suggestCustomerCr(i: number): void {
    debugger;
    if (this.td_deftranstrfList[i].cust_name.length > 2) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.td_deftranstrfList[i].cust_name.toLowerCase();
      prm.ad_acc_type_cd = +this.td_deftranstrfList[i].cust_acc_type;
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomerCr = res.slice(0, 20);
            this.indxsuggestedCustomerCr = i;
          } else {
            this.suggestedCustomerCr = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomerCr = null;
    }
  }
  setCustDtlsCr(acc_num: string, cust_name: string, indx: number) {
    this.suggestedCustomerCr = null;
    this.td_deftranstrfList[indx].cust_acc_number = acc_num;
    this.td_deftranstrfList[indx].cust_name = cust_name;

    this.setDebitAccDtls(this.td_deftranstrfList[indx]);
  }

  setDebitAccDtls(tdDefTransTrnsfr: td_def_trans_trf) {
    debugger;
    this.HandleMessage(false);
    if (tdDefTransTrnsfr.cust_acc_type === undefined
      || tdDefTransTrnsfr.cust_acc_type === null
      || tdDefTransTrnsfr.cust_acc_type === '') {
      this.HandleMessage(true, MessageType.Error, 'Account Type in Transfer Details can not be blank');
      tdDefTransTrnsfr.cust_acc_number = null;
      return;
    }

    if (tdDefTransTrnsfr.cust_acc_number === undefined ||
      tdDefTransTrnsfr.cust_acc_number === null ||
      tdDefTransTrnsfr.cust_acc_number === '') {
      tdDefTransTrnsfr.cust_name = null;
      tdDefTransTrnsfr.clr_bal = null;
      return;
    }
    let temp_deposit_list: tm_deposit[] = [];
    const temp_deposit = new tm_deposit();

    temp_deposit.brn_cd = this.sys.BranchCode;
    temp_deposit.acc_num = tdDefTransTrnsfr.cust_acc_number;
    temp_deposit.acc_type_cd = parseInt(tdDefTransTrnsfr.cust_acc_type);

    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', temp_deposit).subscribe(
      res => {
        this.isLoading = false;

        let foundOneUnclosed = false;
        if (undefined !== res && null !== res && res.length > 0) {
          temp_deposit_list = res;
          temp_deposit_list.forEach(element => {
            if (element.acc_status === null || element.acc_status.toUpperCase() !== 'C') {
              foundOneUnclosed = true;
              tdDefTransTrnsfr.cust_name = element.cust_name;
              tdDefTransTrnsfr.acc_cd = element.acc_cd;
              tdDefTransTrnsfr.clr_bal = element.clr_bal;
            }
          });
          if (temp_deposit_list.length === 0) {
            this.HandleMessage(true, MessageType.Error, 'Invalid Account Number in Transfer Details');
            tdDefTransTrnsfr.cust_acc_number = null;
            return;
          }
          if (!foundOneUnclosed) {
            this.HandleMessage(true, MessageType.Error,
              `Transfer details account number ${this.f.acct_num.value} is closed.`);
            tdDefTransTrnsfr.cust_acc_number = null;
            return;
          }
        }

      },
      err => {
        this.isLoading = false;
      }
    );
  }

  checkAndSetDebitAccType(tfrType: string, tdDefTransTrnsfr: td_def_trans_trf) {
    this.HandleMessage(false);
    if (tfrType === 'cust_acc') {
      if (tdDefTransTrnsfr.cust_acc_type === undefined
        || tdDefTransTrnsfr.cust_acc_type === null
        || tdDefTransTrnsfr.cust_acc_type === '') {
        tdDefTransTrnsfr.cust_name = null;
        tdDefTransTrnsfr.clr_bal = null;
        tdDefTransTrnsfr.cust_acc_desc = null;
        tdDefTransTrnsfr.cust_acc_number = null;
        return;
      }

      if (tdDefTransTrnsfr.gl_acc_code === undefined
        || tdDefTransTrnsfr.gl_acc_code === null
        || tdDefTransTrnsfr.gl_acc_code === '') {
        let temp_acc_type = new mm_acc_type();
        temp_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString()
          === tdDefTransTrnsfr.cust_acc_type.toString())[0];

        if (temp_acc_type === undefined || temp_acc_type === null) {
          tdDefTransTrnsfr.cust_acc_type = null;
          this.HandleMessage(true, MessageType.Error, 'Invalid Account Type');
          return;
        }
        else {
          tdDefTransTrnsfr.cust_acc_desc = temp_acc_type.acc_type_desc;
          tdDefTransTrnsfr.trans_type = tfrType;
        }
      }
      else {
        this.HandleMessage(true, MessageType.Error, 'GL Code in Transfer Details is not Blank');
        tdDefTransTrnsfr.cust_acc_type = null;
        return;
      }
    }

    if (tfrType === 'gl_acc') {
      if (tdDefTransTrnsfr.gl_acc_code === undefined
        || tdDefTransTrnsfr.gl_acc_code === null
        || tdDefTransTrnsfr.gl_acc_code === '') {
        tdDefTransTrnsfr.gl_acc_desc = null;
        return;
      }

      if (tdDefTransTrnsfr.gl_acc_code === this.sys.CashAccCode.toString()) {
        this.HandleMessage(true, MessageType.Error, this.sys.CashAccCode.toString() +
          ' cash acount code is not permissible.');
        tdDefTransTrnsfr.gl_acc_desc = null;
        tdDefTransTrnsfr.gl_acc_code = '';
        return;
      }

      if (tdDefTransTrnsfr.cust_acc_type === undefined
        || tdDefTransTrnsfr.cust_acc_type === null
        || tdDefTransTrnsfr.cust_acc_type === '') {
        if (this.acc_master === undefined || this.acc_master === null || this.acc_master.length === 0) {
          this.isLoading = true;
          let temp_acc_master = new m_acc_master();
          this.svc.addUpdDel<any>('Mst/GetAccountMaster', null).subscribe(
            res => {

              this.acc_master = res;
              this.isLoading = false;
              temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tdDefTransTrnsfr.gl_acc_code)[0];
              if (temp_acc_master === undefined || temp_acc_master === null) {
                tdDefTransTrnsfr.gl_acc_desc = null;
                this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
                return;
              }
              else {
                tdDefTransTrnsfr.gl_acc_desc = temp_acc_master.acc_name;
                tdDefTransTrnsfr.trans_type = tfrType;
              }
            },
            err => {

              this.isLoading = false;
            }
          );
        }
        else {
          let temp_acc_master = new m_acc_master();
          temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tdDefTransTrnsfr.gl_acc_code)[0];
          if (temp_acc_master === undefined || temp_acc_master === null) {
            tdDefTransTrnsfr.gl_acc_desc = null;
            this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
            return;
          }
          else {
            tdDefTransTrnsfr.gl_acc_desc = temp_acc_master.acc_name;
            tdDefTransTrnsfr.trans_type = tfrType;
          }
        }
      }
      else {
        this.HandleMessage(true, MessageType.Error, 'Account Type in Transfer Details is not blank');
        tdDefTransTrnsfr.gl_acc_code = null;
        return;
      }
    }
    // tdDefTransTrnsfr.amount = this.td.amount.value;
  }

  checkDebitBalance(tdDefTransTrnsfr: td_def_trans_trf) {
    this.HandleMessage(false);
    if (tdDefTransTrnsfr.amount === undefined
      || tdDefTransTrnsfr.amount === null) {
      return;
    }

    if ((+tdDefTransTrnsfr.amount) < 0) {
      this.HandleMessage(true, MessageType.Error, 'Negative amount can not be entered.');
      tdDefTransTrnsfr.amount = 0;
      return;
    }

    if ((tdDefTransTrnsfr.cust_acc_number === undefined
      || tdDefTransTrnsfr.cust_acc_number === null
      || tdDefTransTrnsfr.cust_acc_number === '')
      && (tdDefTransTrnsfr.gl_acc_code === undefined
        || tdDefTransTrnsfr.gl_acc_code === null
        || tdDefTransTrnsfr.gl_acc_code === '')) {
      this.HandleMessage(true, MessageType.Warning, 'Please enter Account Number or GL Code');
      tdDefTransTrnsfr.amount = null;
      return;
    }


    if (tdDefTransTrnsfr.clr_bal === undefined
      || tdDefTransTrnsfr.clr_bal === null) {
      tdDefTransTrnsfr.clr_bal = 0;
    }
    this.sumTransfer();
  }

  public addTransfer(): void {
    let emptyTranTranferExist = false;
    this.td_deftranstrfList.forEach(e => {
      if (undefined !== e && null !== e
        && (undefined === e.cust_acc_type && undefined === e.gl_acc_code)) {
        emptyTranTranferExist = true;
      }
    });
    if (!emptyTranTranferExist) {
      this.td_deftranstrfList.push(new td_def_trans_trf());
    }
  }

  private sumTransfer(): void {
    this.TrfTotAmt = 0;
    this.td_deftranstrfList.forEach(e => {
      this.TrfTotAmt += (+e.amount);
    });

    if ((+this.td.amount.value) < this.TrfTotAmt) {
      this.HandleMessage(true, MessageType.Error, 'Total Amount can not be more than Transaction amount');
      this.td_deftranstrfList[(this.td_deftranstrfList.length - 1)].amount = 0;
    }
  }

  public removeTransfer(tdDefTransTrnsfr: td_def_trans_trf): void {
    this.td_deftranstrfList.forEach((e, i) => {
      if (undefined !== e.cust_acc_type
        && e.cust_acc_type === tdDefTransTrnsfr.cust_acc_type
        && e.cust_acc_number === tdDefTransTrnsfr.cust_acc_number) {
        this.td_deftranstrfList.splice(i, 1);
      } else if (undefined !== e.gl_acc_code
        && e.gl_acc_code === tdDefTransTrnsfr.gl_acc_code) {
        this.td_deftranstrfList.splice(i, 1);
      }
    });
    this.sumTransfer();
  }
  private resetTransfer() {
    const td_deftranstrf: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftranstrf;
    const temp_deftranstrf = new td_def_trans_trf();
    this.td_deftranstrfList.push(temp_deftranstrf);
  }

  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
    // setTimeout(() => {
    //   this.showMsg = new ShowMessage();
    // }, 3000);
  }

  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
}
export class DynamicSelect {
  key: any;
  Description: any;
}
