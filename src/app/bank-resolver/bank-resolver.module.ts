import { LoginComponent } from './login/login.component';
import { BankResolverComponent } from './bank-resolver.component';
import { NgModule } from '@angular/core';
import { BankResolverRouting } from './bank-resolver.routing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { UTCustomerProfileComponent } from './UCIC/utcustomer-profile/utcustomer-profile.component';
import { UTSelfHelpComponent } from './UCIC/utself-help/utself-help.component';
import { DailybookComponent } from './finance/report/dailybook/dailybook.component';
import { CashaccountComponent } from './finance/report/cashaccount/cashaccount.component';
import { WebDataRocksPivot } from '../webdatarocks/webdatarocks.angular4';
import { TrialbalanceComponent } from './finance/report/trialbalance/trialbalance.component';
import { CashcumtrialComponent } from './finance/report/cashcumtrial/cashcumtrial.component';
import { GenLedgerComponent } from './finance/report/gen-ledger/gen-ledger.component';
import { VoucherprintComponent } from './finance/voucherprint/voucherprint.component';
import { LoadingComponent } from './loading';
import { GenLedger2Component } from './finance/report/gen-ledger2/gen-ledger2.component';
import { TransactionapprovalComponent } from './deposit/transactionapproval/transactionapproval.component';
import { AccOpeningComponent } from './deposit/acc-opening/acc-opening.component';
import { CustomerInfoComponent } from './common/customer-info/customer-info.component';
import { TestComponent } from './test/test.component';
import { VoucherComponent } from './finance/voucher/voucher.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AccountDetailsComponent } from './Common/account-details/account-details.component';
import { TransactionDetailsComponent } from './Common/transaction-details/transaction-details.component';
import { ScrollbookComponent } from './finance/report/scrollbook/scrollbook.component';
import { DwRdInstlViewComponent } from './Common/dw-rd-instl-view/dw-rd-instl-view.component';
import { DwTdInttDtlsViewComponent } from './Common/dw-td-intt-dtls-view/dw-td-intt-dtls-view.component';
import { DwRenewalViewComponent } from './Common/dw-renewal-view/dw-renewal-view.component';
import { AccounTransactionsComponent } from './deposit/accoun-transactions/accoun-transactions.component';
import { AccountDetailsForAcctTransComponent } from './Common/account-details-for-acct-trans/account-details-for-acct-trans.component';
import { VoucherapprovalComponent } from './finance/voucherapproval/voucherapproval.component';
import { DayinitializationComponent } from './system/dayinitialization/dayinitialization.component';
import { DaycomplitionComponent } from './system/daycomplition/daycomplition.component';
import { AdduserComponent } from './system/adduser/adduser.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { KycComponent } from './Common/kyc/kyc.component';
import { MemberListComponent } from './UCIC/Report/member-list/member-list.component';
import { OpenLoanAccountComponent } from './loan/transaction/open-loan-account/open-loan-account.component';
import { LoanaccountTransactionComponent } from './loan/transaction/loanaccount-transaction/loanaccount-transaction.component';
import { LoanTransactionApprovalComponent } from './loan/transaction/loan-transaction-approval/loan-transaction-approval.component';
import { LoanTransactionDetailsComponent } from './Common/loan-transaction-details/loan-transaction-details.component';
import { LoanAccwiseinttcalcComponent } from './loan/transaction/loan-accwiseinttcalc/loan-accwiseinttcalc.component';
import { INRCurrencyPipe } from '../_utility/filter';
import { LienAccLockUnlockComponent } from './deposit/acc-lock-unlock/lien-acc-lock-unlock/lien-acc-lock-unlock.component';
import { NetworthStatementComponent } from './UCIC/Report/networth-statement/networth-statement.component';
import { SubCashBookComponent } from './deposit/report/sub-cash-book/sub-cash-book.component';
import { DetailListSBCAComponent } from './deposit/report/detail-list-sbca/detail-list-sbca.component';
import { DetailListRDComponent } from './deposit/report/detail-list-rd/detail-list-rd.component';
import { DetailListFDMISComponent } from './deposit/report/detail-list-fdmis/detail-list-fdmis.component';
import { AccStmtSBCAComponent } from './deposit/report/acc-stmt-sbca/acc-stmt-sbca.component';
import { AccStmtRDComponent } from './deposit/report/acc-stmt-rd/acc-stmt-rd.component';
import { AccStmtTDComponent } from './deposit/report/acc-stmt-td/acc-stmt-td.component';
import { NearMaturityReportComponent } from './deposit/report/near-maturity-report/near-maturity-report.component';
import { OpenClosingRegisterComponent } from './deposit/report/open-closing-register/open-closing-register.component';
import { LoanStatementComponent } from './loan/report/loan-statement/loan-statement.component';
import { DetailListComponent } from './loan/report/detail-list/detail-list.component';
import { LoanDisbursementRegisterComponent } from './loan/report/loan-disbursement-register/loan-disbursement-register.component';
import { RecoveryRegisterComponent } from './loan/report/recovery-register/recovery-register.component';
import { LoanSubCashBookComponent } from './loan/report/loan-sub-cash-book/loan-sub-cash-book.component';
import { AccOpeningViewComponent } from './deposit/acc-opening-view/acc-opening-view.component';
import { NeftOutwardComponent } from './deposit/neft-outward/neft-outward.component';
import { NeftInwardReportComponent } from './deposit/report/neft-inward-report/neft-inward-report.component';
import { NeftOutwardReportComponent } from './deposit/report/neft-outward-report/neft-outward-report.component';
import { PassBookPrintingComponent } from './deposit/report/pass-book-printing/pass-book-printing.component';
import { TransTransactionComponent } from './transfer/trans-transaction/trans-transaction.component';
import { TransApproveComponent } from './transfer/trans-approve/trans-approve.component';
import { SystemParameterUpdateComponent } from './system/systemparameter/system-parameter-update/system-parameter-update.component';
import { BakdatevoucherComponent } from './finance/bakdatevoucher/bakdatevoucher.component';
import { KccmemberdtlsComponent } from './loan/masters/kccmemberdtls/kccmemberdtls.component';
import { YearcloseComponent } from './system/yearclose/yearclose.component';
import { YearopenComponent } from './system/yearopen/yearopen.component';
import { BalanaceSheetComponent } from './finance/report/balanace-sheet/balanace-sheet.component';
import { ProfitLossAccComponent } from './finance/report/profit-loss-acc/profit-loss-acc.component';
import { TradingAccComponent } from './finance/report/trading-acc/trading-acc.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';

@NgModule({
  declarations: [
    BankResolverComponent, LoginComponent, HeaderComponent, LandingComponent, LoadingComponent,
    UTCustomerProfileComponent, UTSelfHelpComponent, DailybookComponent, CashaccountComponent,
    WebDataRocksPivot, TrialbalanceComponent, CashcumtrialComponent, GenLedgerComponent,
    VoucherprintComponent, AccountDetailsComponent, TransactionDetailsComponent,
    GenLedger2Component, TransactionapprovalComponent, AccOpeningComponent,
    CustomerInfoComponent, VoucherComponent, TestComponent,
    ScrollbookComponent, DwRdInstlViewComponent, DwTdInttDtlsViewComponent,
    DwRenewalViewComponent, AccounTransactionsComponent, AccountDetailsForAcctTransComponent,
    VoucherapprovalComponent, DayinitializationComponent, DaycomplitionComponent,
    AdduserComponent, KycComponent, MemberListComponent, OpenLoanAccountComponent,
    LoanaccountTransactionComponent, LoanTransactionApprovalComponent, INRCurrencyPipe,
    LoanTransactionDetailsComponent, LoanAccwiseinttcalcComponent, LienAccLockUnlockComponent,
    NetworthStatementComponent, SubCashBookComponent, DetailListSBCAComponent, DetailListRDComponent,
    DetailListFDMISComponent, AccStmtSBCAComponent, AccStmtRDComponent, AccStmtTDComponent,
    NearMaturityReportComponent, OpenClosingRegisterComponent,
    LoanStatementComponent, DetailListComponent,
    LoanDisbursementRegisterComponent, RecoveryRegisterComponent,
    LoanSubCashBookComponent, AccOpeningViewComponent, NeftOutwardComponent,
    NeftInwardReportComponent, NeftOutwardReportComponent, PassBookPrintingComponent,
    TransTransactionComponent, TransApproveComponent, SystemParameterUpdateComponent,
    BakdatevoucherComponent, KccmemberdtlsComponent, YearcloseComponent,
    YearopenComponent, BalanaceSheetComponent, ProfitLossAccComponent, TradingAccComponent
  ],
  imports: [
    CommonModule,
    BankResolverRouting,
    ReactiveFormsModule, FormsModule, AutocompleteLibModule,
    BsDatepickerModule.forRoot(), AccordionModule.forRoot()
  ],
  providers: [
    // { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true  }
  ],
})

export class BankResolverModule { }
