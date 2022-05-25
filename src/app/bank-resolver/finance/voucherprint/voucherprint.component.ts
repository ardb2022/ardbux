import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { p_report_param, SystemValues } from '../../Models';
import { T_VOUCHER_NARRATION } from '../../Models/T_VOUCHER_NARRATION';
import { RestService } from 'src/app/_service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import html2pdf from 'html2pdf.js';
// import jsPDF from 'jspdf';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-voucherprint',
  templateUrl: './voucherprint.component.html',
  styleUrls: ['./voucherprint.component.css']
})
export class VoucherprintComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('reportcontent') reportcontent: ElementRef;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  prp =new p_report_param();
  tvn:  T_VOUCHER_NARRATION[]=[];
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  alertMsg = '';
  fromdate: Date;
  todate:Date;
  isLoading = false;

  constructor(private svc: RestService,private formBuilder: FormBuilder,
     private modalService: BsModalService,
     private router: Router) { }

  ngOnInit(): void {
    ;
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
  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }
  public closeAlert() {
    this.showAlert = false;
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
      this.getmVoucherDetails();
      // this.modalService.dismissAll(this.content);
    }
  }

  private getmVoucherDetails(): void {
    this.prp.brn_cd=localStorage.getItem('__brnCd');
    this.prp.from_dt= this.fromdate;
    this.prp.to_dt=this.todate;
    this.isLoading=true;
    this.svc.addUpdDel<any>('Voucher/GetTVoucherDtlsForPrint', this.prp).subscribe(
      res => {
        ;
        this.tvn = res;
        for (let x = 0; x < this.tvn.length; x++) {
          this.tvn[x].voucher_dt= this.convertDate(this.tvn[x].voucher_dt.toString());
          this.tvn[x].narration= this.tvn[x].narration.replace('/','');
        }
        this.tvn = this.tvn.sort((a , b) => (a.voucher_id < b.voucher_id ? -1 : 1));
        this.isLoading=false;
        this.modalRef.hide();
      },
      err => { this.modalRef.hide();}
    );
  }
  private  convertDate(datestring:string):Date
{
var parts = datestring.match(/(\d+)/g);
// new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
//return new Date(year, month, day);
}

  //   public downloadPDF() {
  //   ;
  //   let content = this.reportcontent.nativeElement;
  //   let doc = new jsPDF();
  //   let _elementHandlers =
  //   {
  //     '#editor': function (element, renderer) {
  //       return true;
  //     }
  //   };
  //   doc.fromHTML(content.innerHTML, 30, 30, {

  //     'width': 250,
  //     'elementHandlers': _elementHandlers
  //   });
  //   doc.save("VoucherPrint.pdf");
  // }

  // public downloadPDF () {
  //   ;
  //   {
  //     // download the file using old school javascript method
  //     this.exportAsService.save(this.exportAsConfig, 'VoucherPrint').subscribe(() => {
  //       // save started
  //     });
  //     // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
  //    // this.exportAsService.get(this.config).subscribe(content => {
  //    //   console.log(content);
  //    // });
  //   }
  // }

  // public downloadPDF() {
  //   const option = {
  //     name: 'VoucherPrint.pdf',
  //     image: { type: 'jpeg' },
  //     html2pdf: {},
  //     jsPDF: { orientation: 'portrait' }
  //   }
  //   const element: Element = document.getElementById('reportcontent');

  //   html2pdf()
  //     .from(element)
  //     .set(option)
  //     .save()
  // }
  public downloadPDF() {
  var element = document.getElementById('reportcontent');
  var option = {
margin:       0,
filename:     'Voucher_'+this.fromdate.toString()+'.pdf',
image:        { type: 'jpeg', quality: 0.98 },
html2canvas:  { scale:1},
jsPDF:        { unit: 'mm', format: 'a4', orientation: 'p' }
};
html2pdf()
       .from(element)
       .set(option)
       .save()
  }
 public FormatNumber(num) {
  try {
      return parseFloat(num).toFixed(2);
  } catch (error) {
      return 0;
  }
}
closeScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}

}
