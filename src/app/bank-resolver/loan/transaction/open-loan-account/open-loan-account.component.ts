import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { mm_customer } from 'src/app/bank-resolver/Models';
import { SystemValues } from './../../../Models/SystemValues';
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { mm_acc_type } from 'src/app/bank-resolver/Models/deposit/mm_acc_type';
import { mm_instalment_type } from 'src/app/bank-resolver/Models/loan/mm_instalment_type';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { tm_guaranter } from 'src/app/bank-resolver/Models/loan/tm_guaranter';
import { td_accholder } from 'src/app/bank-resolver/Models/deposit/td_accholder';
import { tm_loan_sanction } from 'src/app/bank-resolver/Models/loan/tm_loan_sanction';
import { tm_loan_sanction_dtls } from 'src/app/bank-resolver/Models/loan/tm_loan_sanction_dtls';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { stringify } from '@angular/compiler/src/util';
import { exit } from 'process';
import { mm_sector } from 'src/app/bank-resolver/Models/loan/mm_sector';
import { mm_activity } from 'src/app/bank-resolver/Models/loan/mm_activity';
import { mm_crop } from 'src/app/bank-resolver/Models/loan/mm_crop';
import { p_loan_param } from 'src/app/bank-resolver/Models/loan/p_loan_param';
import { sm_kcc_param } from 'src/app/bank-resolver/Models/loan/sm_kcc_param';
import { sm_loan_sanction } from 'src/app/bank-resolver/Models/loan/sm_loan_sanction';
import { td_loan_sanc } from 'src/app/bank-resolver/Models/loan/td_loan_sanc';
import { td_loan_sanc_set } from 'src/app/bank-resolver/Models/loan/td_loan_sanc_set';
import Utils from 'src/app/_utility/utils';
import { MessageType, mm_category, mm_customer, m_acc_master, ShowMessage, td_def_trans_trf } from 'src/app/bank-resolver/Models';




@Component({
  selector: 'app-open-loan-account',
  templateUrl: './open-loan-account.component.html',
  styleUrls: ['./open-loan-account.component.css']
})
export class OpenLoanAccountComponent implements OnInit {

  constructor(private svc: RestService,
              private modalService: BsModalService,
              private router: Router,
              private msg: InAppMessageService,

  ) { }

  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;


  branchCode = '0';
  createUser = '';
  updateUser = '';
  operationType = '';
  disableAll = 'N';
  // disablePersonal ='Y';

  createDate: Date;
  updateDate: Date;

  p_gen_param = new p_gen_param();

  isLoading = false;

  showMsg: ShowMessage;

  customerList: mm_customer[] = [];
  accountTypeList: mm_acc_type[] = [];
  instalmentTypeList: mm_instalment_type[] = [];

  smLoanSanctionList: sm_loan_sanction[] = [];
  selectedSmLoanSanctionList: sm_loan_sanction[] = [];

  sectorList: mm_sector[] = [];
  activityList: mm_activity[] = [];
  corpList: mm_crop[] = [];
  smKccParamList: sm_kcc_param[] = [];

  selectedActivityList: mm_activity[] = [];
  selectedCorpList: mm_crop[] = [];

  // showAlert = false;
  // alertMsg: string;
  // alertMsgType: string;
  suggestedCustomer: mm_customer[];
  suggestedJointCustomer: mm_customer[];
  suggestedCustomerJointHolderIdx: number;
  kycEnable = false;

  masterModel = new LoanOpenDM();
  tm_loan_all = new tm_loan_all();
  tm_guaranter = new tm_guaranter();
  td_accholder: td_accholder[] = [];
  tm_loan_sanction: tm_loan_sanction[] = [];
  tm_loan_sanction_dtls: tm_loan_sanction_dtls[] = [];

  td_loan_sanc_set_list: td_loan_sanc_set[] = [];

  sys = new SystemValues();

  relationship = [
    { id: 1, val: 'Father' },
    { id: 2, val: 'Mother' },
    { id: 3, val: 'Sister' },
    { id: 4, val: 'Brother' },
    { id: 5, val: 'Friend' },
    { id: 6, val: 'Son' },
    { id: 7, val: 'Daughter' },
    { id: 8, val: 'Others' }];

  repaymentFormulaList = [
    { id: 1, val: 'EMI' },
    { id: 2, val: 'REDUCING' },
  ];

  modalRef: BsModalRef;
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };

  ngOnInit(): void {

    this.branchCode = this.sys.BranchCode;
    this.createUser = this.sys.UserId;
    this.createDate = this.sys.CurrentDate;
    this.updateUser = this.sys.UserId;
    this.updateDate = this.sys.CurrentDate;
    setTimeout(() => {
      this.getCustomerList();
      this.getAccountTypeList();
      this.getInstalmentTypeList();

      this.getSectorList();
      this.getActivityList();
      this.getCorpList();
      this.getSmKccParam();
      this.getSmLoanSanctionList();
    }, 150);

    this.initializeModels();
    this.newAccount();

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }



  initializeModels() {

    this.masterModel = new LoanOpenDM();

    const loan = new tm_loan_all();
    this.tm_loan_all = loan;
    this.masterModel.tmloanall = this.tm_loan_all;

    const guar = new tm_guaranter();
    this.tm_guaranter = guar;
    this.masterModel.tmguaranter = this.tm_guaranter;

    const acc: td_accholder[] = [];
    this.td_accholder = acc;
    this.masterModel.tdaccholder = this.td_accholder;

    const loansanc: tm_loan_sanction[] = [];
    this.tm_loan_sanction = loansanc;
    this.masterModel.tmlaonsanction = this.tm_loan_sanction;

    const loansancdtl: tm_loan_sanction_dtls[] = [];
    this.tm_loan_sanction_dtls = loansancdtl;
    this.masterModel.tmlaonsanctiondtls = this.tm_loan_sanction_dtls;

    this.associateChildRecordsWithHeader();

    this.selectedActivityList = [];
    this.selectedCorpList = [];

  }


  assignModelsFromMasterData() {

    const loan = new tm_loan_all();
    this.tm_loan_all = loan;
    this.tm_loan_all = this.masterModel.tmloanall;
    this.setLoanAccountType(this.tm_loan_all.acc_cd);
    this.setInstalPeriod(this.tm_loan_all.piriodicity);
    this.setRepaymentFormula(this.tm_loan_all.emi_formula_no);


    const guar = new tm_guaranter();
    this.tm_guaranter = guar;
    this.tm_guaranter = this.masterModel.tmguaranter;

    const acc: td_accholder[] = [];
    this.td_accholder = acc;
    this.td_accholder = this.masterModel.tdaccholder;
    for (const i in this.masterModel.tdaccholder) {
      this.setJointHolderRelation(this.td_accholder[i].relation, Number(i));
    }

    const loansanc: tm_loan_sanction[] = [];
    this.tm_loan_sanction = loansanc;
    this.tm_loan_sanction = this.masterModel.tmlaonsanction;

    const loansancdtl: tm_loan_sanction_dtls[] = [];
    this.tm_loan_sanction_dtls = loansancdtl;
    this.tm_loan_sanction_dtls = this.masterModel.tmlaonsanctiondtls;

    this.td_loan_sanc_set_list = this.masterModel.tdloansancsetlist;
    this.parseSecurityDetailsRecord();

  }

  associateChildRecordsWithHeader() {

    if (this.masterModel.tdaccholder.length === 0) {
      this.pushTdAccHolder();
    }

    if (this.masterModel.tmlaonsanction.length === 0) {
      this.pushTmLoanSanction();
    }

    if (this.masterModel.tmlaonsanctiondtls.length === 0) {
      this.pushTmLoanSanctionDtls();
    }
  }

  pushTdAccHolder() {
    this.masterModel.tdaccholder.push(new td_accholder());
  }

  pushTmLoanSanction() {

    this.masterModel.tmlaonsanction.push(new tm_loan_sanction());
    const cnt = this.masterModel.tmlaonsanction.length;
    this.masterModel.tmlaonsanction[cnt - 1].sanc_no = cnt;
  }

  pushTmLoanSanctionDtls() {
    this.masterModel.tmlaonsanctiondtls.push(new tm_loan_sanction_dtls());
    const cnt = this.masterModel.tmlaonsanctiondtls.length;
    this.masterModel.tmlaonsanctiondtls[cnt - 1].sanc_no = cnt;
  }


  parseSecurityDetailsRecord()
  {
    for (const i in this.masterModel.tdloansancsetlist) {
      for (const j in this.masterModel.tdloansancsetlist[i].tdloansancset) {
        this.masterModel.tdloansancsetlist[i].tdloansancset[j].loan_id = this.tm_loan_all.loan_id;

        if (this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_type === 'DATE') {
          debugger;
          if (this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value === undefined ||
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value === null)
            {
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value_dt = null;
          }
          else
          {
            debugger;
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value_dt = Utils.convertStringToDt(this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value);
          }
        }
      }
    }
  }

  getCustomerList() {

    const cust = new mm_customer();
    cust.cust_cd = 0;
    cust.brn_cd = this.branchCode;

    // this.isLoading = true;
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


  getAccountTypeList() {

    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.isLoading = true;
    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {

        this.isLoading = false;
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'L');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        this.isLoading = false;
      }
    );
  }


  getInstalmentTypeList() {

    if (this.instalmentTypeList.length > 0) {
      return;
    }
    this.instalmentTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetInstalmentTypeMaster', null).subscribe(
      res => {

        this.instalmentTypeList = res;
      },
      err => {

      }
    );
  }


  getSectorList() {

    if (this.sectorList.length > 0) {
      return;
    }
    this.sectorList = [];

    this.svc.addUpdDel<any>('Mst/GetSectorMaster', null).subscribe(
      res => {

        this.sectorList = res;
      },
      err => {

      }
    );

  }

  getActivityList() {

    if (this.activityList.length > 0) {
      return;
    }
    this.activityList = [];

    this.svc.addUpdDel<any>('Mst/GetActivityMaster', null).subscribe(
      res => {

        this.activityList = res;
      },
      err => {

      }
    );

  }

  getCorpList() {

    if (this.corpList.length > 0) {
      return;
    }
    this.corpList = [];

    this.svc.addUpdDel<any>('Mst/GetCropMaster', null).subscribe(
      res => {

        this.corpList = res;
      },
      err => {

      }
    );

  }


  getSmKccParam() {

    if (this.smKccParamList.length > 0) {
      return;
    }
    this.smKccParamList = [];

    this.svc.addUpdDel<any>('Loan/GetSmKccParam', null).subscribe(
      res => {

        this.smKccParamList = res;
      },
      err => {

      }
    );

  }


  getSmLoanSanctionList() {
    debugger;
    if (this.smLoanSanctionList.length > 0) {
      return;
    }
    this.svc.addUpdDel<any>('Loan/GetSmLoanSanctionList', null).subscribe(
      res => {
        this.smLoanSanctionList = res;
      },

      err => {
      }
    );
  }

  setSmLoanSanctionList(acc_cd: number) {
    debugger;
    // if (this.masterModel.tdloansancsetlist === undefined ||
    //   this.masterModel.tdloansancsetlist === null ||
    //   this.masterModel.tdloansancsetlist.length === 0)
    if ( this.operationType === 'N')
      {
      const loanSancSetList: td_loan_sanc_set[] = [];
      this.td_loan_sanc_set_list = loanSancSetList;
      this.masterModel.tdloansancsetlist = this.td_loan_sanc_set_list;
    }

    this.selectedSmLoanSanctionList = this.smLoanSanctionList.filter(c => c.acc_cd.toString() === acc_cd.toString());

    if ( this.operationType === 'N'
        && this.selectedSmLoanSanctionList !== undefined
        && this.selectedSmLoanSanctionList !== null
        && this.selectedSmLoanSanctionList.length > 0 )
      {
      this.createSecurityDtlList();
      debugger;
     }
  }

// createSecurityDtlList()
// {
//   debugger;
//   this.td_loan_sanc_set_list.push(this.populateTdLoanSanc());
// }

removeSecurityDtlList()
{
    debugger;
    if (this.td_loan_sanc_set_list.length > 1)
    {
      this.td_loan_sanc_set_list.pop();
    }
  }

  createSecurityDtlList(): any {
    debugger;
    if (this.selectedSmLoanSanctionList !== undefined && this.selectedSmLoanSanctionList !== null && this.selectedSmLoanSanctionList.length > 0)
    {
      const tdLoanSancList: td_loan_sanc[] = [];
      const tdLoanSancLocalSet = new td_loan_sanc_set();

      for (let i in this.selectedSmLoanSanctionList) {
        const tdLoanSanc = new td_loan_sanc();
        tdLoanSanc.sanc_no = 1;
        // tdLoanSanc.dataset_no = this.selectedSmLoanSanctionList[i].dataset_no;
        tdLoanSanc.dataset_no = this.td_loan_sanc_set_list.length + 1;
        tdLoanSanc.field_name = this.selectedSmLoanSanctionList[i].field_name;
        tdLoanSanc.param_cd = this.selectedSmLoanSanctionList[i].param_cd;
        tdLoanSanc.param_type = this.selectedSmLoanSanctionList[i].param_type;
        tdLoanSanc.param_desc = this.selectedSmLoanSanctionList[i].param_desc;

        tdLoanSancList.push(tdLoanSanc);
      }

      tdLoanSancLocalSet.tdloansancset = tdLoanSancList;
      // return tdLoanSancLocalSet;
      this.td_loan_sanc_set_list.push(tdLoanSancLocalSet);

    }

  }



  public suggestCustomer(): void {
    debugger;
    if (this.tm_loan_all.cust_name.length > 2) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.tm_loan_all.cust_name.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res.slice(0, 20);
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

  public setCustDtls(cust_cd: number): void {
    this.suggestedCustomer = null;
    this.kycEnable = false;
    this.tm_loan_all.party_cd = cust_cd;
    this.msg.sendcustomerCodeForKyc(cust_cd);
    this.kycEnable = true;
    this.populateCustDtls(cust_cd);

  }

  populateCustDtls(cust_cd: number) {
    debugger;
    let temp_mm_cust = new mm_customer();
    temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
    this.tm_loan_all.cust_name = temp_mm_cust.cust_name;
  }


  public suggestJointCustomer(idx: number): void {
    this.suggestedCustomerJointHolderIdx = idx;
    if (this.td_accholder[idx].acc_holder.length > 2) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.td_accholder[idx].acc_holder.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedJointCustomer = res.slice(0, 20);
          } else {
            this.suggestedJointCustomer = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedJointCustomer = null;
    }

  }

  public setJointCustDtls(cust_cd: number, idx: number): void {

    this.td_accholder[idx].cust_cd = cust_cd;
    this.populateJointCustDtls(cust_cd, idx);
    this.suggestedJointCustomer = null;
  }

  populateJointCustDtls(cust_cd: number, idx: number) {

    let temp_mm_cust = new mm_customer();
    temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
    this.td_accholder[idx].acc_holder = temp_mm_cust.cust_name;
  }

  setJointHolderRelation(relation: string, idx: number) {

    this.td_accholder[idx].relation = relation;
    this.td_accholder[idx].relationId =
      this.relationship.filter(x => x.val.toString() === relation)[0].id;
  }



  addJointHolder() {
    if (this.masterModel.tdaccholder !== undefined) {
      const temp_td_accholder = new td_accholder();
      this.masterModel.tdaccholder.push(temp_td_accholder);
    }
  }

  removeJointHolder() {
    if (this.masterModel.tdaccholder !== undefined && this.masterModel.tdaccholder.length > 1) {
      this.masterModel.tdaccholder.pop();
    }
  }


  public setLoanAccountType(accType: number): void {
    var accTyp = new mm_acc_type();

    this.tm_loan_all.acc_cd = Number(accType);
    accTyp = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0];

    // this.tm_loan_all.loan_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;
    this.tm_loan_all.loan_acc_type = accTyp.acc_type_desc;
    this.tm_loan_all.cc_flag = accTyp.cc_flag;
    this.tm_loan_all.rep_sch_flag = accTyp.rep_sch_flag;
    this.tm_loan_all.intt_calc_type = accTyp.intt_calc_type;

    if (this.operationType === 'N') {
      this.tm_loan_all.curr_intt_rate = null;
      this.tm_loan_all.ovd_intt_rate = null;
      this.tm_loan_all.instl_no = null;
    }

    if (this.tm_loan_all.acc_cd === 23103 && this.operationType === 'N') {

      this.tm_loan_all.curr_intt_rate = Number(this.smKccParamList.filter(x => x.param_cd.toString() === 'curr_intt_rt')[0].param_value);
      this.tm_loan_all.ovd_intt_rate = Number(this.smKccParamList.filter(x => x.param_cd.toString() === 'ovd_intt_rt')[0].param_value);
      this.tm_loan_all.instl_no = 1;
    }

    this.setSmLoanSanctionList(accType);

  }

  public setLoanType(accType: number): void {
    this.tm_loan_all.acc_cd = Number(accType);
    this.tm_loan_all.loan_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;
  }


  public setInstalPeriod(instlType: string): void {

    this.tm_loan_all.piriodicity = instlType;
    this.tm_loan_all.instalmentTypeDesc = this.instalmentTypeList.filter(x => x.desc_type.toString() === instlType)[0].ins_desc;
  }


  public setRepaymentFormula(formula: number): void {

    this.tm_loan_all.emi_formula_no = Number(formula);
    this.tm_loan_all.emiFormulaDesc = this.repaymentFormulaList.filter(x => x.id.toString() === formula.toString())[0].val;
  }

  public setSectorType(sec: string, idx: number): void {

    this.tm_loan_sanction_dtls[idx].sector_cd = sec;
    this.tm_loan_sanction_dtls[idx].sector_desc = this.sectorList.filter(x => x.sector_cd.toString() === sec.toString())[0].sector_desc;

    this.tm_loan_sanction_dtls[idx].activity_cd = null;
    this.tm_loan_sanction_dtls[idx].activity_desc = null;
    this.tm_loan_sanction_dtls[idx].crop_cd = null;
    this.tm_loan_sanction_dtls[idx].crop_desc = null;
    this.tm_loan_sanction_dtls[idx].due_dt = null;
    this.tm_loan_sanction_dtls[idx].sanc_amt = null;

    this.selectedActivityList = [];
    this.selectedCorpList = [];
    this.selectedActivityList = this.activityList.filter(x => x.sector_cd.toString() === sec.toString());
  }

  public setActivityType(act: string, idx: number): void {

    this.tm_loan_sanction_dtls[idx].activity_cd = act;
    this.tm_loan_sanction_dtls[idx].activity_desc =
      this.activityList.filter(x => x.activity_cd.toString() ===
        act.toString())[0].activity_desc;

    this.tm_loan_sanction_dtls[idx].crop_cd = null;
    this.tm_loan_sanction_dtls[idx].crop_desc = null;

    this.selectedCorpList = this.corpList.filter(x => x.activity_cd.toString() === act.toString());
    if (this.selectedCorpList === undefined || this.selectedCorpList.length === 0) {
      const tmp_corp = new mm_crop();
      tmp_corp.crop_cd = '00';
      tmp_corp.crop_desc = 'Others';
      this.selectedCorpList.push(tmp_corp);
    }
  }

  public setCorpType(corp: string, idx: number): void {

    this.tm_loan_sanction_dtls[idx].crop_cd = corp;
    this.tm_loan_sanction_dtls[idx].crop_desc = this.corpList.filter(x => x.crop_cd.toString() === corp.toString())[0].crop_desc;

    this.tm_loan_sanction_dtls[idx].sanc_amt = null;
    this.tm_loan_sanction_dtls[idx].due_dt = null;

    if (this.tm_loan_sanction_dtls[idx].crop_cd !== '00' && this.tm_loan_all.acc_cd === 23103) {
      const temp_p_loan_param = new p_loan_param();
      temp_p_loan_param.cust_cd = this.masterModel.tmloanall.party_cd;
      temp_p_loan_param.crop_cd = this.tm_loan_sanction_dtls[idx].crop_cd;
      this.getSanctionAmountAndValidity(temp_p_loan_param, idx);
    }
  }

  getSanctionAmountAndValidity(loan_param: p_loan_param, idx: number): any {

    let temp_p_loan_param = new p_loan_param();
    this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/PopulateCropAmtDueDt', loan_param).subscribe(
      res => {

        temp_p_loan_param = res;
        this.isLoading = false;
        this.setSanctionAmountAndValidity(temp_p_loan_param, idx);
      },
      err => {
        this.isLoading = false;

      }
    );
    return temp_p_loan_param;
  }

  setSanctionAmountAndValidity(loan_param: p_loan_param, idx: number) {

    if (loan_param.status === 0) {
      this.tm_loan_sanction_dtls[idx].sanc_amt = +loan_param.recov_amt;
      this.tm_loan_sanction_dtls[idx].due_dt = loan_param.due_dt;
    }

    if (loan_param.status === 1) {
      // this.showAlertMsg('ERROR', 'Please Set The Disbursement Start & End Date For This Crop!!!');
      this.HandleMessage(true, MessageType.Error, 'Please Set The Disbursement Start & End Date For This Crop!!!');
    }

    if (loan_param.status === 2) {
      // this.showAlertMsg('ERROR', 'This is Not Disbursement Time For This Crop!!!');
      this.HandleMessage(true, MessageType.Warning, 'This is Not Disbursement Time For This Crop!!!');
    }

    if (loan_param.status === 3) {
      // this.showAlertMsg('ERROR', 'A loan for this crop is already sanctioned for this Member!!!');
      this.HandleMessage(true, MessageType.Warning, 'A loan for this crop is already sanctioned for this Member!!!');
    }

    if (loan_param.status === 4) {
      // this.showAlertMsg('ERROR', 'Loan for this Crop is not sanctioned in KCC Card for this Member!!!');
      this.HandleMessage(true, MessageType.Warning, 'Loan for this Crop is not sanctioned in KCC Card for this Member!!!');
    }

  }

  newAccount() {

    this.clearData();
    this.operationType = 'N';
    this.disableAll = 'N';
    // this.disablePersonal = 'N';
    // this.isLoading = true;

    this.getCustomerList();

  }

  retrieveData() {

    this.clearData();
    this.operationType = 'R';
    this.disableAll = 'N';
    // this.disablePersonal = 'Y';

    // this.isLoading = true;
    this.getCustomerList();
  }

  clearData() {
    this.operationType = '';
    this.closeAlertMsg();
    // this.disablePersonal = 'Y';
    this.initializeModels();
  }


  modifyData() {

    if (this.operationType !== 'Q') {
      // this.showAlertMsg('WARNING', 'Record not retrived to modify');
      this.HandleMessage(true, MessageType.Warning, 'Record not retrived to modify');
      return;
    }
    this.operationType = 'U';
    this.disableAll = 'N';

  }

  approveData(idx: number) {
    if (this.masterModel.tmlaonsanction[idx].approval_status !== undefined &&
      this.masterModel.tmlaonsanction[idx].approval_status === 'A') {
      // this.showAlertMsg('WARNING', 'Loan Already Approved !!');
      this.HandleMessage(true, MessageType.Warning, 'Loan Already Approved !!');
      return;
    }

    this.tm_loan_all.approval_status = 'A';
    this.masterModel.tmlaonsanction[idx].approval_status = 'A';
    this.masterModel.tmlaonsanction[idx].approved_dt = this.sys.CurrentDate;
    this.masterModel.tmlaonsanction[idx].approved_by = this.sys.UserId;
    this.masterModel.tmlaonsanctiondtls[idx].approval_status = 'A';
    this.saveData('A');
  }

  saveData(saveType: string) {

    if (this.operationType !== 'N' && this.operationType !== 'U') {
      // this.showAlertMsg('WARNING', 'Loan Account not Created or Updated to Save');
      this.HandleMessage(true, MessageType.Warning, 'Loan Account not Created or Updated to Save');
      exit(0);
    }

    if (this.operationType === 'N') {

      this.tm_loan_all.brn_cd = this.branchCode;
      this.tm_loan_all.created_by = this.createUser;
      this.tm_loan_all.created_dt = this.createDate;

      this.GetLoanAccountNumberAndInsertData();
    }

    if (this.operationType === 'U') {
      this.tm_loan_all.modified_by = this.updateUser;
      this.tm_loan_all.created_dt = this.updateDate;
      this.UpdateLoanAccountOpeningData(saveType);
    }
  }

  GetLoanAccountNumberAndInsertData() {
    this.ValidateLoanOpenHeaderData(); // Validation for Loan Account Header
    // this.ValidateLoanUpdateData();     // Validation for Loan Account Child
    this.p_gen_param.brn_cd = this.branchCode;
    this.isLoading = true;

    this.svc.addUpdDel<any>('Loan/PopulateLoanAccountNumber', this.p_gen_param).subscribe(
      res => {
        // debugger;
        let val = '0';
        this.isLoading = false;
        val = res;
        if (val === '' || val == null) {
          // this.showAlertMsg('ERROR', 'Loan Account Number not created !!');
          this.HandleMessage(true, MessageType.Error, 'Loan Account Number not created !!');
          return;
        }
        this.tm_loan_all.loan_id = val.toString();


        // this.masterModel.tmguaranter = null;
        // this.masterModel.tdaccholder = null;
        // this.masterModel.tmlaonsanction = null;
        // this.masterModel.tmlaonsanctiondtls = null;

        this.InsertLoanAccountOpeningData();
      },
      err => {
        this.isLoading = false;
        // this.showAlertMsg('ERROR', 'Loan Account Number not created !!!');
        this.HandleMessage(true, MessageType.Error, 'Loan Account Number not created !!!');

      }

    );
  }

  InsertLoanAccountOpeningData() {
    debugger;
    this.masterModel.tmloanall.approval_status = 'U';
    this.ValidateLoanUpdateData(); // Validation for Loan Account Child

    this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/InsertLoanAccountOpeningData', this.masterModel).subscribe(
      res => {
        // debugger;
        this.isLoading = false;
        // this.disablePersonal = 'Y';
        this.operationType = 'U';
        this.associateChildRecordsWithHeader();
        // this.showAlertMsg('INFORMATION', 'Loan Account Created Successfully. LoanId: ' + this.tm_loan_all.loan_id);
        this.HandleMessage(true, MessageType.Sucess, 'Loan Account Created Successfully. LoanId: ' + this.tm_loan_all.loan_id);
      },
      err => {
        // debugger;
        this.isLoading = false;
        console.error('Error on SaveClick' + JSON.stringify(err));
        // this.showAlertMsg('ERROR', 'Record Not Saved !!!');
        this.HandleMessage(true, MessageType.Error, 'Record Not Saved !!!');

      }
    );
  }


  UpdateLoanAccountOpeningData(saveType: string) {
    this.ValidateLoanUpdateData();
    debugger;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/InsertLoanAccountOpeningData', this.masterModel).subscribe(
      res => {
        // debugger;
        this.isLoading = false;
        this.operationType = 'U';

        if (saveType === 'A') {
          // this.showAlertMsg('INFORMATION', 'LoanId: ' + this.tm_loan_all.loan_id + '  Approved Successfully.');
          this.HandleMessage(true, MessageType.Sucess, 'LoanId: ' + this.tm_loan_all.loan_id + '  Approved Successfully.');
        }
        else {
          //  this.showAlertMsg('INFORMATION', 'Record Saved Successfully for LoanId: ' + this.tm_loan_all.loan_id);
          this.HandleMessage(true, MessageType.Sucess, 'Record Saved Successfully for LoanId: ' + this.tm_loan_all.loan_id );
        }
        this.associateChildRecordsWithHeader();
      },
      err => {
        // debugger;
        this.isLoading = false;
        console.error('Error on SaveClick' + JSON.stringify(err));
        // this.showAlertMsg('ERROR', 'Record Not Saved !!!');
        this.HandleMessage(true, MessageType.Error, 'Record Not Saved !!!' );

      }
    );
  }


  getLoanAccountData() {

    this.isLoading = true;
    this.tm_loan_all.brn_cd = this.branchCode;
    this.svc.addUpdDel<any>('Loan/GetLoanData', this.tm_loan_all).subscribe(
      res => {

        this.isLoading = false;
        this.masterModel = res;

        if (this.masterModel === undefined || this.masterModel === null) {
          // this.showAlertMsg('WARNING', 'No record found!!');
          this.HandleMessage(true, MessageType.Warning, 'No record found!!' );
        }
        else {
          if (this.masterModel.tmloanall.loan_id !== null) {

            this.assignModelsFromMasterData();
            this.associateChildRecordsWithHeader();
            this.operationType = 'Q';
            this.disableAll = 'Y';
          }
          else {
            // this.showAlertMsg('WARNING', 'No record found!!!');
            this.HandleMessage(true, MessageType.Warning, 'No record found!!!');
          }

        }

      },
      err => {
        this.isLoading = false;
        // this.showAlertMsg('ERROR', 'Unable to find record!!');
        this.HandleMessage(true, MessageType.Warning, 'Unable to find record!!' );

      }

    );
  }

  ValidateLoanOpenHeaderData() {
    if (this.tm_loan_all.party_cd === null || this.tm_loan_all.party_cd === undefined ||
      this.tm_loan_all.cust_name === null || this.tm_loan_all.cust_name === undefined ||
      this.tm_loan_all.loan_acc_type === null || this.tm_loan_all.loan_acc_type === undefined ||
      // this.tm_loan_all.loan_acc_no === null || this.tm_loan_all.loan_acc_no === undefined ||
      this.tm_loan_all.instl_start_dt === null || this.tm_loan_all.instl_start_dt === undefined ||
      this.tm_loan_all.curr_intt_rate === null || this.tm_loan_all.curr_intt_rate === undefined ||
      this.tm_loan_all.ovd_intt_rate === null || this.tm_loan_all.ovd_intt_rate === undefined ||
      this.tm_loan_all.instl_no === null || this.tm_loan_all.instl_no === undefined ||
      this.tm_loan_all.piriodicity === null || this.tm_loan_all.piriodicity === undefined ||
      this.tm_loan_all.emi_formula_no === null || this.tm_loan_all.emi_formula_no === undefined) {
      // this.showAlertMsg('WARNING', 'Please provide all the required data in Personal Information');
      this.HandleMessage(true, MessageType.Warning, 'Please provide all the required data in Personal Information');
      exit(0);
    }
  }

  ValidateLoanUpdateData() {
    // debugger;
    // Guaranter Validation
    if (this.tm_guaranter.gua_name !== undefined || this.tm_guaranter.gua_name != null) {
      if (this.tm_guaranter.gua_name === '' ||
        this.tm_guaranter.gua_add === undefined || this.tm_guaranter.gua_add == null || this.tm_guaranter.gua_add === '' ||
        this.tm_guaranter.salary === undefined || this.tm_guaranter.salary == null ||
        this.tm_guaranter.mobile === undefined || this.tm_guaranter.mobile == null) {
        // this.showAlertMsg('WARNING', 'Please provide all the required data in Guaranter Details');
        this.HandleMessage(true, MessageType.Warning, 'Please provide all the required data in Guaranter Details');
        exit(0);
      }

      this.tm_guaranter.loan_id = this.tm_loan_all.loan_id;
      this.tm_guaranter.acc_cd = this.tm_loan_all.acc_cd;
      this.tm_guaranter.srl_no = 1;
      this.tm_guaranter.opening_dt = null; // this.sys.CurrentDate;
    }

    // Joint Holder Validation
    for (const i in this.masterModel.tdaccholder) {
      if (this.masterModel.tdaccholder[i].cust_cd === undefined || this.masterModel.tdaccholder[i].cust_cd == null) {
        this.masterModel.tdaccholder.splice(0, 1);
      }
      else {
        if (this.masterModel.tdaccholder[i].relation === undefined || this.masterModel.tdaccholder[i].relation == null) {
          // this.showAlertMsg('WARNING', 'Please provide all the required data for Joint Holder');
          this.HandleMessage(true, MessageType.Warning, 'Please provide all the required data for Joint Holder');
          exit(0);
        }
        else {
          this.masterModel.tdaccholder[i].acc_num = this.tm_loan_all.loan_id;
          this.masterModel.tdaccholder[i].brn_cd = this.branchCode;
          this.masterModel.tdaccholder[i].acc_type_cd = Number(this.tm_loan_all.acc_cd);
        }
      }
    }

    // All Sanction Validation
    if (this.masterModel.tmlaonsanction[0].sanc_dt === undefined) {
      // this.showAlertMsg('WARNING', 'Please provide Sanction Date in All Sanction');
      this.HandleMessage(true, MessageType.Warning, 'Please provide Sanction Date in All Sanction');
      exit(0);
    }
    else {
      if (this.masterModel.tmlaonsanction[0].loan_id === undefined) {
        this.masterModel.tmlaonsanction[0].loan_id = this.tm_loan_all.loan_id;
        this.masterModel.tmlaonsanction[0].created_by = this.createUser;
        if (this.masterModel.tmlaonsanction[0].approval_status === undefined ||
          this.masterModel.tmlaonsanction[0].approval_status === '') {
          this.masterModel.tmlaonsanction[0].approval_status = 'U';
        }
      }
      else {
        this.masterModel.tmlaonsanction[0].modified_by = this.updateUser;
      }
    }


    // Sanction Details Validation
    if (this.masterModel.tmlaonsanctiondtls[0].sector_cd === undefined || this.masterModel.tmlaonsanctiondtls[0].sector_cd == null
      || this.masterModel.tmlaonsanctiondtls[0].activity_cd === undefined || this.masterModel.tmlaonsanctiondtls[0].activity_cd == null
      || this.masterModel.tmlaonsanctiondtls[0].crop_cd === undefined || this.masterModel.tmlaonsanctiondtls[0].crop_cd == null
      || this.masterModel.tmlaonsanctiondtls[0].sanc_amt === undefined || this.masterModel.tmlaonsanctiondtls[0].sanc_amt == null
      || this.masterModel.tmlaonsanctiondtls[0].due_dt === undefined
    ) {
      // this.showAlertMsg('WARNING', 'Please provide all the required data for Sanction Details');
      this.HandleMessage(true, MessageType.Warning, 'Please provide all the required data for Sanction Details');
      exit(0);
    }
    else {
      this.masterModel.tmlaonsanctiondtls[0].loan_id = this.tm_loan_all.loan_id;
      this.masterModel.tmlaonsanctiondtls[0].srl_no = this.masterModel.tmlaonsanctiondtls[0].sanc_no;
      if (this.masterModel.tmlaonsanctiondtls[0].approval_status === undefined ||
        this.masterModel.tmlaonsanctiondtls[0].approval_status === '') {
        this.masterModel.tmlaonsanctiondtls[0].approval_status = 'U';
      }
      this.masterModel.tmlaonsanctiondtls[0].sanc_status = 'C';
    }


    for (const i in this.masterModel.tdloansancsetlist) {
      for (const j in this.masterModel.tdloansancsetlist[i].tdloansancset) {
        this.masterModel.tdloansancsetlist[i].tdloansancset[j].loan_id = this.tm_loan_all.loan_id;

        if (this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_type === 'DATE')
        {
          debugger;
          if (this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value_dt === undefined ||
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value_dt === null)
            {
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value = null;
            }
          else
          {
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value = Utils.convertDtToString(this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value_dt);
            // this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value = this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value_dt.toString();
          }
        }
      }
    }


  }

  setValidityDate(idx: number) {

    const dt = this.sys.CurrentDate;
    dt.setMonth(dt.getMonth() + 2);
    dt.setDate(0);

    // var dt= new Date( this.sys.CurrentDate.getFullYear() , this.sys.CurrentDate.getMonth() + 2 , 0);

    this.masterModel.tmlaonsanctiondtls[idx].due_dt = dt;
  }

  checkAndSetOverdueInterest() {
    // if (this.tm_loan_all.ovd_intt_rate === undefined ||
    //   this.tm_loan_all.ovd_intt_rate === null ||
    //   this.tm_loan_all.ovd_intt_rate === 0) {
    //   this.tm_loan_all.ovd_intt_rate = this.tm_loan_all.curr_intt_rate + 2;
    // }
    this.tm_loan_all.ovd_intt_rate = this.tm_loan_all.curr_intt_rate + 2;

  }

  // public showAlertMsg(msgTyp: string, msg: string) {
  //   this.alertMsgType = msgTyp;
  //   this.alertMsg = msg;
  //   this.showAlert = true;
  //   this.disableAll = 'Y';

  //   // this.disablePersonal = 'Y';
  // }

  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;

    this.disableAll = 'Y';
  }


  public closeAlertMsg() {

    this.HandleMessage(false);
    this.disableAll = 'N';
  }


  backScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }


}

