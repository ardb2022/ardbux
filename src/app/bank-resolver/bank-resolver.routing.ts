import { GenLedgerComponent } from './finance/report/gen-ledger/gen-ledger.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { BankResolverComponent } from './bank-resolver.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceComponent } from './finance/finance.component';
import { VoucherComponent } from './finance/voucher/voucher.component';
import { UTCustomerProfileComponent } from './UCIC/utcustomer-profile/utcustomer-profile.component';
import { UTSelfHelpComponent } from './UCIC/utself-help/utself-help.component';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component';
import { BankConfigComponent } from '../bank-config/bank-config.component';
import { DailybookComponent } from './finance/report/dailybook/dailybook.component';
import { BankWiseConfigComponent } from '../bank-wise-config/bank-wise-config.component';
import { CashaccountComponent } from './finance/report/cashaccount/cashaccount.component';
import { CashcumtrialComponent } from './finance/report/cashcumtrial/cashcumtrial.component';
import { TrialbalanceComponent } from './finance/report/trialbalance/trialbalance.component';
import { VoucherprintComponent } from './finance/voucherprint/voucherprint.component';
import { GenLedger2Component } from './finance/report/gen-ledger2/gen-ledger2.component';
import { TransactionapprovalComponent } from './deposit/transactionapproval/transactionapproval.component';
import { AccOpeningComponent } from './deposit/acc-opening/acc-opening.component';
import { TestComponent } from '../test/test/test.component';
import { ScrollbookComponent } from './finance/report/scrollbook/scrollbook.component';
import { VoucherapprovalComponent } from './finance/voucherapproval/voucherapproval.component';
import { DayinitializationComponent } from './system/dayinitialization/dayinitialization.component';
import { DaycomplitionComponent } from './system/daycomplition/daycomplition.component';
import { AdduserComponent } from './system/adduser/adduser.component';
import { AccounTransactionsComponent } from './deposit/accoun-transactions/accoun-transactions.component';
import { MemberListComponent } from './UCIC/Report/member-list/member-list.component';
import { OpenLoanAccountComponent } from './loan/transaction/open-loan-account/open-loan-account.component';
import { AuthenticationService as AuthGuard } from '../_service/authentication.service';
import { LoanTransactionApprovalComponent } from './loan/transaction/loan-transaction-approval/loan-transaction-approval.component';
import { LoanaccountTransactionComponent } from './loan/transaction/loanaccount-transaction/loanaccount-transaction.component';
import { LoanAccwiseinttcalcComponent } from './loan/transaction/loan-accwiseinttcalc/loan-accwiseinttcalc.component';
import { LienAccLockUnlockComponent } from './deposit/acc-lock-unlock/lien-acc-lock-unlock/lien-acc-lock-unlock.component';
import { NetworthStatementComponent } from './UCIC/Report/networth-statement/networth-statement.component';
import { SubCashBookComponent } from './deposit/report/sub-cash-book/sub-cash-book.component';
import { AccStmtRDComponent } from './deposit/report/acc-stmt-rd/acc-stmt-rd.component';
import { AccStmtSBCAComponent } from './deposit/report/acc-stmt-sbca/acc-stmt-sbca.component';
import { AccStmtTDComponent } from './deposit/report/acc-stmt-td/acc-stmt-td.component';
import { DetailListFDMISComponent } from './deposit/report/detail-list-fdmis/detail-list-fdmis.component';
import { DetailListRDComponent } from './deposit/report/detail-list-rd/detail-list-rd.component';
import { DetailListSBCAComponent } from './deposit/report/detail-list-sbca/detail-list-sbca.component';
import { NearMaturityReportComponent } from './deposit/report/near-maturity-report/near-maturity-report.component';
import { OpenClosingRegisterComponent } from './deposit/report/open-closing-register/open-closing-register.component';
import { LoanStatementComponent } from './loan/report/loan-statement/loan-statement.component';
import { DetailListComponent } from './loan/report/detail-list/detail-list.component';
import { LoanDisbursementRegisterComponent } from './loan/report/loan-disbursement-register/loan-disbursement-register.component';
import { RecoveryRegisterComponent } from './loan/report/recovery-register/recovery-register.component';
import { LoanSubCashBookComponent } from './loan/report/loan-sub-cash-book/loan-sub-cash-book.component';
import { AccOpeningViewComponent } from './deposit/acc-opening-view/acc-opening-view.component';
import { SystemParameterUpdateComponent } from './system/systemparameter/system-parameter-update/system-parameter-update.component';
import { NeftOutwardComponent } from './deposit/neft-outward/neft-outward.component';
import { NeftInwardReportComponent } from './deposit/report/neft-inward-report/neft-inward-report.component';
import { NeftOutwardReportComponent } from './deposit/report/neft-outward-report/neft-outward-report.component';
import { PassBookPrintingComponent } from './deposit/report/pass-book-printing/pass-book-printing.component';
import { TransTransactionComponent } from './transfer/trans-transaction/trans-transaction.component';
import { TransApproveComponent } from './transfer/trans-approve/trans-approve.component';
import { BakdatevoucherComponent } from './finance/bakdatevoucher/bakdatevoucher.component';
import { KccmemberdtlsComponent } from './loan/masters/kccmemberdtls/kccmemberdtls.component';
import { YearopenComponent } from './system/yearopen/yearopen.component';
import { YearcloseComponent } from './system/yearclose/yearclose.component';
import { BalanaceSheetComponent } from './finance/report/balanace-sheet/balanace-sheet.component';
import { ProfitLossAccComponent } from './finance/report/profit-loss-acc/profit-loss-acc.component';
import { TradingAccComponent } from './finance/report/trading-acc/trading-acc.component';
import { MasterMenuConfigComponent } from '../master-menu-config/master-menu-config.component';
import { ConfigNewBankComponent } from '../config-new-bank/config-new-bank.component';
import { AdminLoginComponent } from '../admin-login/admin-login.component';

const routes: Routes = [
  { path: 'Admin', component: AdminPanelComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'AdmLogin', component: AdminLoginComponent },
  { path: 'Loan', component: OpenLoanAccountComponent },
  { path: 'te-st3', component: TransTransactionComponent },
  { path: 'te-st1', component: TransactionapprovalComponent },
  { path: 'te-st2', component: AccounTransactionsComponent },
  { path: 'te-st4', component: LoanTransactionApprovalComponent },
  { path: 'te-st5', component: LoanaccountTransactionComponent },
  { path: 'te-st', component: UTCustomerProfileComponent },
  { path: 't6', component: AccOpeningComponent },
  { path: 't7', component: AccOpeningViewComponent },
  { path: 't8', component: SystemParameterUpdateComponent },
  { path: 'BankConfig', component: BankConfigComponent },
  { path: 'BankWiseConfig', component: BankWiseConfigComponent },
  { path: 'MasterMenuConfig', component: MasterMenuConfigComponent },
  { path: 'ConfigNewBank', component: ConfigNewBankComponent },
  { path: 'test', component: TestComponent },

  {
    path: ':bankName', component: BankResolverComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'la', component: LandingComponent, canActivate: [AuthGuard] },
      { path: 'UT_CustomerProfile', component: UTCustomerProfileComponent, canActivate: [AuthGuard] },
      { path: 'UT_SelfHelp', component: UTSelfHelpComponent, canActivate: [AuthGuard] },
      { path: 'UR_MemberList', component: MemberListComponent, canActivate: [AuthGuard] },
      { path: 'FT_Voucher', component: VoucherComponent, canActivate: [AuthGuard] },
      { path: 'FT_ApproveTrns', component: VoucherapprovalComponent, canActivate: [AuthGuard] },
      { path: 'FT_PrintVoucher', component: VoucherprintComponent, canActivate: [AuthGuard] },
      { path: 'FT_BackdateVoucher', component: BakdatevoucherComponent, canActivate: [AuthGuard] },
      { path: 'FR_DayBook', component: DailybookComponent, canActivate: [AuthGuard] },
      { path: 'FR_CashAccount', component: CashaccountComponent, canActivate: [AuthGuard] },
      { path: 'FR_CashCumTrial', component: CashcumtrialComponent, canActivate: [AuthGuard] },
      { path: 'FR_TrialBalance', component: TrialbalanceComponent, canActivate: [AuthGuard] },
      { path: 'FR_GeneralLadger', component: GenLedgerComponent, canActivate: [AuthGuard] },
      { path: 'FR_DayScrollBook', component: ScrollbookComponent, canActivate: [AuthGuard] },
      { path: 'FR_GLTD', component: GenLedger2Component, canActivate: [AuthGuard] },
      { path: 'DT_ApproveTran', component: TransactionapprovalComponent, canActivate: [AuthGuard] },
      { path: 'DT_AccTrans', component: AccounTransactionsComponent, canActivate: [AuthGuard] },
      { path: 'DT_OpenAcc', component: AccOpeningComponent, canActivate: [AuthGuard] },
      { path: 'DA_DayInit', component: DayinitializationComponent, canActivate: [AuthGuard] },
      { path: 'DA_DayCmpl', component: DaycomplitionComponent, canActivate: [AuthGuard] },
      { path: 'UM_AddUsr', component: AdduserComponent, canActivate: [AuthGuard] },
      { path: 'LT_OpenLoanAcc', component: OpenLoanAccountComponent, canActivate: [AuthGuard] },
      { path: 'LT_LoanTrans', component: LoanaccountTransactionComponent, canActivate: [AuthGuard] },
      { path: 'LT_CalcIntt', component: LoanAccwiseinttcalcComponent, canActivate: [AuthGuard] },
      { path: 'LT_LoanAprv', component: LoanTransactionApprovalComponent, canActivate: [AuthGuard] },
      { path: 'LM_Kccmember', component: KccmemberdtlsComponent, canActivate: [AuthGuard] },
      { path: 'DT_AccLockUnlock', component: LienAccLockUnlockComponent, canActivate: [AuthGuard] },
      { path: 'UR_Networth', component: NetworthStatementComponent, canActivate: [AuthGuard] },
      { path: 'DR_SubCashBook', component: SubCashBookComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLS', component: DetailListSBCAComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLR', component: DetailListRDComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLF', component: DetailListFDMISComponent, canActivate: [AuthGuard] },
      { path: 'DR_ASS', component: AccStmtSBCAComponent, canActivate: [AuthGuard] },
      { path: 'DR_ASR', component: AccStmtRDComponent, canActivate: [AuthGuard] },
      { path: 'DR_ASF', component: AccStmtTDComponent, canActivate: [AuthGuard] },
      { path: 'DR_NearMatReport', component: NearMaturityReportComponent, canActivate: [AuthGuard] },
      { path: 'DR_OpenCloseReg', component: OpenClosingRegisterComponent, canActivate: [AuthGuard] },
      { path: 'LR_LoanStmt', component: LoanStatementComponent, canActivate: [AuthGuard] },
      { path: 'LR_DtlLst', component: DetailListComponent, canActivate: [AuthGuard] },
      { path: 'LR_DisReg', component: LoanDisbursementRegisterComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecReg', component: RecoveryRegisterComponent, canActivate: [AuthGuard] },
      { path: 'LR_SubCashBk', component: LoanSubCashBookComponent, canActivate: [AuthGuard] },
      { path: 'DT_OpenAccView', component: AccOpeningViewComponent, canActivate: [AuthGuard] },
      { path: 'DT_NEFTPayment', component: NeftOutwardComponent, canActivate: [AuthGuard] },
      { path: 'DR_NeftIn', component: NeftInwardReportComponent, canActivate: [AuthGuard] },
      { path: 'DR_NeftOut', component: NeftOutwardReportComponent, canActivate: [AuthGuard] },
      { path: 'DR_PbkPrn', component: PassBookPrintingComponent, canActivate: [AuthGuard] },
      { path: 'SP_Update', component: SystemParameterUpdateComponent, canActivate: [AuthGuard] },
      { path: 'DA_YearOpn', component: YearopenComponent, canActivate: [AuthGuard] },
      { path: 'DA_YearCls', component: YearcloseComponent, canActivate: [AuthGuard] },
      { path: 'TT_TransEntry', component: TransTransactionComponent, canActivate: [AuthGuard] },
      { path: 'TT_TransApprove', component: TransApproveComponent, canActivate: [AuthGuard] },
      { path: 'FR_BalanceSheet', component: BalanaceSheetComponent, canActivate: [AuthGuard] },
      { path: 'FR_ProfitLoss', component: ProfitLossAccComponent, canActivate: [AuthGuard] },
      { path: 'FR_Trading', component: TradingAccComponent, canActivate: [AuthGuard] },

      // { path: '**', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'finance', component: FinanceComponent,
        children: [
          { path: 'voucher', component: VoucherComponent },
          // { path: 'voucherNew', component: VoucherNewComponent },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BankResolverRouting { }
