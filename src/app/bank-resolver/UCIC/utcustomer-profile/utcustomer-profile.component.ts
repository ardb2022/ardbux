import {
  mm_title, mm_category, mm_state, mm_dist, mm_vill,
  mm_kyc, mm_service_area, mm_block, mm_customer, ShowMessage, MessageType, SystemValues, kyc_sig
} from './../../Models';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InAppMessageService, RestService } from 'src/app/_service';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import Utils from 'src/app/_utility/utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { p_gen_param } from '../../Models/p_gen_param';

@Component({
  selector: 'app-utcustomer-profile',
  templateUrl: './utcustomer-profile.component.html',
  styleUrls: ['./utcustomer-profile.component.css']
})
export class UTCustomerProfileComponent implements OnInit {
  constructor(private frmBldr: FormBuilder,
    private svc: RestService, private router: Router,
    private modalService: BsModalService, private msg: InAppMessageService) { }
  get f() { return this.custMstrFrm.controls; }
  static existingCustomers: mm_customer[] = [];
  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;
  modalRef: BsModalRef;
  sys = new SystemValues();
  retrieveClicked = false;
  selectedCustomer: mm_customer;
  enableModifyAndDel = false;
  showMsgs: ShowMessage[] = [];
  // showMsg: ShowMessage;
  isLoading = false;
  suggestedCustomer: mm_customer[];
  titles: mm_title[] = [];
  KYCTypes: mm_kyc[] = [];
  blocks: mm_block[] = [];
  serviceAreas: mm_service_area[] = [];
  villages: mm_vill[] = [];
  states: mm_state[] = [];
  districts: mm_dist[] = [];
  categories: mm_category[] = [];
  custMstrFrm: FormGroup;
  fileToUpload: File = null;
  sucessMsgs: string[] = [];
  // image = new kyc_sig();
  // base64Image: string;
  /* possible values of operation
    New, Retrieve, Modify, delete
    We will use to globally set operation of the page
  */
  operation: string;
  selectedBlock: mm_block;
  selectedServiceArea: mm_service_area;
  isOpenDOBdp = false;
  isOpenDODdp = false;
  SIGNATURE: kyc_sig;
  PHOTO: kyc_sig;
  KYC: kyc_sig;
  ADDRESS: kyc_sig;
  config = {
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  };

  // public onModifyClick(): void {
  //   this.validateControls();
  //   this.showMsg = null;
  //   this.isLoading = true;
  //   const cust = this.mapFormGrpToCustMaster();
  //   this.svc.addUpdDel<any>('UCIC/UpdateCustomerDtls', cust).subscribe(
  //     res => {
  //       if (null !== res && res > 0) {
  //         if (this.retrieveClicked) {
  //           // update this cust details in the list of existing cutomer
  //           // this will ensure, retrieve wont be needed every time
  //           UTCustomerProfileComponent.existingCustomers.push(cust);
  //           UTCustomerProfileComponent.existingCustomers.forEach(element => {
  //             if (element.cust_cd === cust.cust_cd) {
  //               element = cust;
  //             }
  //           });
  //         }
  //         this.HandleMessage(true, MessageType.Sucess,
  //           cust.cust_cd + ', Customer updated sucessfully');
  //       } else {
  //         this.HandleMessage(true, MessageType.Warning,
  //           cust.cust_cd + ', Could not update Customer');
  //       }
  //       this.isLoading = false;
  //     },
  //     err => { this.isLoading = false; }
  //   );
  // }
  disableImageSave = true;
  fileTypes = ['jpg', 'jpeg', 'png'];
  errMessage = '';

  ngOnInit(): void {
    this.operation = 'New';
    // form defination
    this.custMstrFrm = this.frmBldr.group({
      brn_cd: [''],
      cust_cd: [{ value: '', disabled: true }],
      cust_type: ['', Validators.required],
      title: [''],
      first_name: [null, Validators.required],
      middle_name: [null],
      last_name: [null, Validators.required],
      cust_name: [null, { disabled: true }],
      guardian_name: [null, Validators.required],
      cust_dt: [null],
      old_cust_cd: [null],
      dt_of_birth: [null, Validators.required],
      age: [{ value: null, disabled: true }],
      sex: [null, Validators.required],
      marital_status: [null],
      catg_cd: [null, Validators.required],
      community: [null, Validators.required],
      caste: [null, Validators.required],
      permanent_address: [null],
      ward_no: [null],
      state: [null],
      dist: [null],
      pin: [null, [Validators.maxLength(6)]],
      vill_cd: [null, Validators.required],
      block_cd: [null, { disabled: true }, Validators.required],
      block_cd_desc: [null, { disabled: true }],
      service_area_cd: [null, { disabled: true }, Validators.required],
      service_area_cd_desc: [null, { disabled: true }],
      occupation: [null],
      phone: [null, [Validators.pattern('[0-9 ]{12}'), Validators.maxLength(12), Validators.required]],
      present_address: [null, Validators.required],
      farmer_type: [null],
      email: [''],
      monthly_income: [''],
      date_of_death: [''],
      sms_flag: [''],
      status: [{ value: 'A' }],
      pan: [''],
      nominee: [''],
      nom_relation: [''],
      kyc_photo_type: [''],
      kyc_photo_no: [''],
      kyc_address_type: [''],
      kyc_address_no: [''],
      org_status: [''],
      org_reg_no: ['']
    });

    setTimeout(() => {
      this.getTitleMaster();
      this.getCategoryMaster();
      this.getStateMaster();
      this.getDistMaster();
      this.getVillageMaster();
      this.getKYCTypMaster();
      this.getBlockMster();
      this.getServiceAreaMaster();
      // this.onRetrieveClick();
      this.f.status.setValue('A');
    }, 150);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }
  openUploadModal(template: TemplateRef<any>) {
    this.sucessMsgs = [];
    this.PHOTO = null;
    this.KYC = null;
    this.ADDRESS = null;
    this.SIGNATURE = null;
    this.modalRef = this.modalService.show(template, this.config);
  }

  private getTitleMaster(): void {
    this.svc.addUpdDel<mm_title[]>('Mst/GetTitleMaster', null).subscribe(
      res => {
        this.titles = res;
      },
      err => { }
    );
  }

  private getCategoryMaster(): void {
    this.svc.addUpdDel<mm_category[]>('Mst/GetCategoryMaster', null).subscribe(
      res => {
        this.categories = res;
      },
      err => { }
    );
  }

  private getStateMaster(): void {
    this.svc.addUpdDel<mm_state[]>('Mst/GetStateMaster', null).subscribe(
      res => {
        this.states = res;
      },
      err => { }
    );
  }

  private getDistMaster(): void {
    this.svc.addUpdDel<mm_dist[]>('Mst/GetDistMaster', null).subscribe(
      res => {
        this.districts = res;
      },
      err => { }
    );
  }

  private getVillageMaster(): void {
    this.svc.addUpdDel<mm_vill[]>('Mst/GetVillageMaster', null).subscribe(
      res => {
        this.villages = res;
      },
      err => { }
    );
  }

  onVillageChnage(vill_cd: string): void {
    // add logic to select block and area.
    const selectedVillage = this.villages.filter(e => e.vill_cd === vill_cd)[0];
    this.selectedBlock = this.blocks.filter(e => e.block_cd ===
      selectedVillage.block_cd)[0];
    this.selectedServiceArea = this.serviceAreas.filter(e => e.service_area_cd ===
      selectedVillage.service_area_cd)[0];
    this.custMstrFrm.patchValue({
      service_area_cd: this.selectedServiceArea.service_area_cd,
      service_area_cd_desc: this.selectedServiceArea.service_area_name,
      block_cd: this.selectedBlock.block_cd,
      block_cd_desc: this.selectedBlock.block_name
    });
  }

  private getBlockMster(): void {
    this.svc.addUpdDel<mm_block[]>('Mst/GetBlockMaster', null).subscribe(
      res => {
        this.blocks = res;
      },
      err => { }
    );
  }

  private getServiceAreaMaster(): void {
    this.svc.addUpdDel<mm_service_area[]>('Mst/GetServiceAreaMaster', null).subscribe(
      res => {
        this.serviceAreas = res;
      },
      err => { }
    );
  }

  private getKYCTypMaster(): void {
    this.svc.addUpdDel<mm_kyc[]>('Mst/GetKycMaster', null).subscribe(
      res => {
        this.KYCTypes = res;
      },
      err => { }
    );
  }

  public onNameChange(): void {
    const cust_name = (this.f.first_name.value) + ' '
      + ((this.f.middle_name.value === null) ? '' : (this.f.middle_name.value + ' '))
      + this.f.last_name.value;
    this.custMstrFrm.patchValue({
      cust_name: cust_name
    });
  }

  public onRetrieveClick(): void {
    this.retrieveClicked = true;
    this.onClearClick();
    this.custMstrFrm.disable();
    this.f.cust_name.enable();
    // if (loadingReq) {

    // }
    // if (undefined !== UTCustomerProfileComponent.existingCustomers &&
    //   null !== UTCustomerProfileComponent.existingCustomers &&
    //   UTCustomerProfileComponent.existingCustomers.length > 0) {
    // } else {
    //   // this.cust_name.nativeElement.focus();
    //   if (loadingReq) { this.isLoading = true; }
    //   const cust = new mm_customer(); cust.cust_cd = 0;
    //   this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
    //     res => {
    //       UTCustomerProfileComponent.existingCustomers = res;
    //       if (loadingReq) { this.isLoading = false; }
    //     },
    //     err => { this.isLoading = false; }
    //   );
    // }
  }

  // public suggestCustomer(): void {
  //   this.suggestedCustomer = UTCustomerProfileComponent.existingCustomers
  //     .filter(c => c.cust_name.toLowerCase().startsWith(this.f.cust_name.value.toLowerCase())
  //       || c.cust_cd.toString().startsWith(this.f.cust_name.value)
  //       || (c.phone !== null && c.phone.startsWith(this.f.cust_name.value)))
  //     .slice(0, 20);
  // }
  public suggestCustomer(): void {
    if (this.f.cust_name.value.length > 0) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.f.cust_name.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          debugger;
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

  public onDobChange(value: Date): number {
    // ;
    if (null !== value) {
      const timeDiff = Math.abs(Date.now() - value.getTime());
      const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25)
      this.f.age.setValue(age);
      return age;
    }
  }

  public onPininput(event: any): void {
    if (isNaN(event.target.value)) {
      this.f.pin.setValue('');
    }
  }

  public SelectCustomer(cust: mm_customer): void {
    // ;
    const dob = (null !== cust.dt_of_birth && '01/01/0001 00:00' === cust.dt_of_birth.toString()) ? null
      : cust.dt_of_birth;
    this.selectedCustomer = cust;
    this.msg.sendcustomerCodeForKyc(this.selectedCustomer.cust_cd);
    this.onClearClick();
    this.enableModifyAndDel = true;
    this.suggestedCustomer = null;
    this.selectedBlock = this.blocks.filter(e => e.block_cd === cust.block_cd)[0];
    this.selectedServiceArea = this.serviceAreas.filter(e => e.service_area_cd === cust.service_area_cd)[0];
    this.custMstrFrm.patchValue({
      brn_cd: cust.brn_cd,
      cust_cd: cust.cust_cd,
      cust_type: cust.cust_type,
      title: cust.title,
      first_name: cust.first_name,
      middle_name: cust.middle_name,
      last_name: cust.last_name,
      cust_name: cust.cust_name,
      guardian_name: cust.guardian_name,
      cust_dt: cust.cust_dt,
      old_cust_cd: cust.old_cust_cd,
      dt_of_birth: dob, // formatDate(new Date(cust.dt_of_birth), 'yyyy-MM-dd', 'en'),
      age: cust.age,
      sex: cust.sex,
      marital_status: cust.marital_status,
      catg_cd: cust.catg_cd,
      community: cust.community,
      caste: cust.caste,
      permanent_address: cust.permanent_address,
      ward_no: cust.ward_no,
      state: cust.state,
      dist: cust.dist,
      pin: cust.pin,
      vill_cd: cust.vill_cd,
      block_cd: cust.block_cd,
      block_cd_desc: this.selectedBlock.block_name,
      service_area_cd: cust.service_area_cd,
      service_area_cd_desc: this.selectedServiceArea.service_area_name,
      occupation: cust.occupation,
      phone: cust.phone,
      present_address: cust.present_address,
      farmer_type: cust.farmer_type,
      email: cust.email,
      monthly_income: cust.monthly_income,
      date_of_death: cust.date_of_death,
      sms_flag: cust.sms_flag,
      status: cust.status == null ? 'A' : cust.status,
      pan: cust.pan,
      nominee: cust.nominee,
      nom_relation: cust.nom_relation,
      kyc_photo_type: cust.kyc_photo_type,
      kyc_photo_no: cust.kyc_photo_no,
      kyc_address_type: cust.kyc_address_type,
      kyc_address_no: cust.kyc_address_no,
      org_status: cust.org_status,
      org_reg_no: cust.org_reg_no
    });
    this.retrieveClicked = false;
  }

  public onSaveClick(): void {
    // ;
    if (!this.validateControls()) { return; }
    this.isLoading = true;
    const cust = this.mapFormGrpToCustMaster();
    let newCustomer = false;

    if (cust.cust_cd === 0) {
      newCustomer = true;
    }

    if (newCustomer) {
      cust.created_by = this.sys.UserId;
      cust.modified_by = this.sys.UserId;
      this.svc.addUpdDel<any>('UCIC/InsertCustomerDtls', cust).subscribe(
        res => {
          this.isLoading = false;
          if ((+res) > 0) {
            this.custMstrFrm.patchValue({
              cust_cd: res
            });
            cust.cust_cd = res;
            this.selectedCustomer = cust;
            UTCustomerProfileComponent.existingCustomers.push(cust);
            this.HandleMessage(true, MessageType.Sucess,
              cust.cust_cd + ', Customer created sucessfully');
            this.msg.sendcustomerCodeForKyc(cust.cust_cd);
          } else {
            this.HandleMessage(true, MessageType.Error,
              'Got ' + cust.cust_cd + 'customer code, Customer creation failed');
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      cust.modified_by = this.sys.UserId;
      this.svc.addUpdDel<any>('UCIC/UpdateCustomerDtls', cust).subscribe(
        res => {
          if (null !== res && res > 0) {
            if (undefined !== UTCustomerProfileComponent.existingCustomers ||
              null !== UTCustomerProfileComponent.existingCustomers ||
              UTCustomerProfileComponent.existingCustomers.length > 0) {
              const pos = UTCustomerProfileComponent.existingCustomers
                .findIndex(e => e.cust_cd === cust.cust_cd);
              if (pos >= 0) {
                UTCustomerProfileComponent.existingCustomers.splice(pos, 1);
                UTCustomerProfileComponent.existingCustomers.push(cust);
              }

            } else {
              UTCustomerProfileComponent.existingCustomers.push(cust);
            }
            this.HandleMessage(true, MessageType.Sucess,
              cust.cust_cd + ', Customer updated sucessfully');
            this.msg.sendcustomerCodeForKyc(cust.cust_cd);
          } else {
            this.HandleMessage(true, MessageType.Warning,
              cust.cust_cd + ', Could not update Customer, response recieved ' + res);
          }
          this.isLoading = false;
        },
        err => { this.isLoading = false; }
      );
    }
  }

  validateControls(): boolean {
    this.showMsgs = [];
    let trReturn = true;
    if (null !== this.f.pan.value && this.f.pan.value.length > 0) {
      if (!Utils.ValidatePAN(this.f.pan.value)) {
        this.HandleMessage(true, MessageType.Error, 'PAN is not valid');
        trReturn = false;
      }
    }
    // // ;
    if (null !== this.f.phone.value && this.f.phone.value.length > 0) {
      if (!Utils.ValidatePhone(this.f.phone.value)) {
        this.HandleMessage(true, MessageType.Error, 'Phone number is not valid');
        trReturn = false;
      }
    } else {
      this.HandleMessage(true, MessageType.Error, 'Phone number is mandatory');
      trReturn = false;
    }

    for (const name in this.custMstrFrm.controls) {
      if (this.custMstrFrm.controls[name].invalid) {
        switch (name) {
          case 'dt_of_birth':
            this.HandleMessage(true, MessageType.Error, 'Date of Birth is Mandatory');
            break;
          case 'cust_type':
            this.HandleMessage(true, MessageType.Error, 'Customer Type is Mandatory');
            break;
          case 'first_name':
            this.HandleMessage(true, MessageType.Error, 'First Name is Mandatory');
            break;
          case 'last_name':
            this.HandleMessage(true, MessageType.Error, 'Last Name is Mandatory');
            break;
          case 'guardian_name':
            this.HandleMessage(true, MessageType.Error, 'Guardian\'s Name is Mandatory');
            break;
          case 'sex':
            this.HandleMessage(true, MessageType.Error, 'Sex of customer is Mandatory');
            break;
          case ' catg_cd':
            this.HandleMessage(true, MessageType.Error, 'Category of customer is Mandatory');
            break;
          case 'community':
            this.HandleMessage(true, MessageType.Error, 'Community of customer is Mandatory');
            break;
          case 'caste':
            this.HandleMessage(true, MessageType.Error, 'Caste of customer is Mandatory');
            break;
          case 'block_cd':
            this.HandleMessage(true, MessageType.Error, 'Block of customer Mandatory');
            break;
          case 'service_area_cd':
            this.HandleMessage(true, MessageType.Error, 'Srvice are of customer is Mandatory');
            break;
          // case 'phone':
          //   this.HandleMessage(true, MessageType.Error, 'Phone number is mandatory in correct format');
          //   break;
          case 'present_address':
            this.HandleMessage(true, MessageType.Error, 'present address is Mandatory');
            break;
        }
      }
    }
    if (this.showMsgs.length > 0) {
      trReturn = false;
    }

    return trReturn;
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    const showMsg = new ShowMessage();
    showMsg.Show = show;
    showMsg.Type = type;
    showMsg.Message = message;
    this.showMsgs.push(showMsg);
  }
  public RemoveMessage(rmMsg: ShowMessage) {
    rmMsg.Show = false;
    this.showMsgs.splice(this.showMsgs.indexOf(rmMsg), 1);
  }

  public onDelClick(): void {
    // delete the selected customer
    this.isLoading = true;
    // const cust = this.mapFormGrpToCustMaster();
    this.svc.addUpdDel<any>('UCIC/DeleteCustomerDtls', this.selectedCustomer).subscribe(
      res => {
        this.isLoading = false;
        if (this.retrieveClicked) {
          // delete this cust details from the list of existing cutomer
          // this will ensure, retrieve wont be needed every time
          UTCustomerProfileComponent.existingCustomers =
            UTCustomerProfileComponent.existingCustomers.filter(o => o.cust_cd !== this.selectedCustomer.cust_cd);
        }
        this.HandleMessage(true, MessageType.Sucess,
          this.selectedCustomer.cust_cd + ', Customer Deleted sucessfully')
      },
      err => { this.isLoading = false; }
    );
  }

  public onClearClick(): void {
    this.custMstrFrm.reset();
    this.showMsgs = [];
    this.enableModifyAndDel = false;
    this.custMstrFrm.enable();
    this.f.cust_cd.disable();
    this.f.cust_name.disable();
    this.f.service_area_cd.disable();
    this.f.service_area_cd_desc.disable();
    this.f.block_cd.disable();
    this.f.block_cd_desc.disable();
    // this.f.dt_of_birth.disable();
    this.f.age.disable();
    // this.f.date_of_death.disable();
    this.suggestedCustomer = null;
    this.f.status.setValue('A');
  }

  mapFormGrpToCustMaster(): mm_customer {
    const cust = new mm_customer();
    try {
      cust.brn_cd = this.sys.BranchCode; // '101';
      cust.cust_cd = (null === this.f.cust_cd.value || '' === this.f.cust_cd.value)
        ? 0 : +this.f.cust_cd.value;
      cust.cust_type = this.f.cust_type.value;
      cust.title = this.f.title.value;
      cust.first_name = this.f.first_name.value.toUpperCase();
      cust.middle_name = this.f.middle_name.value === null ? '' : this.f.middle_name.value.toUpperCase();
      cust.last_name = this.f.last_name.value.toUpperCase();
      cust.cust_name = this.f.cust_name.value.toUpperCase();
      cust.guardian_name = this.f.guardian_name.value.toUpperCase();
      cust.cust_dt = ('' === this.f.cust_dt.value
        || '0001-01-01T00:00:00' === this.f.cust_dt.value) ? null : this.f.cust_dt.value;
      cust.old_cust_cd = this.f.old_cust_cd.value;
      cust.dt_of_birth = this.f.dt_of_birth.value;
      cust.age = +this.f.age.value;
      cust.sex = this.f.sex.value;
      cust.marital_status = this.f.marital_status.value;
      cust.catg_cd = +this.f.catg_cd.value;
      cust.community = +this.f.community.value;
      cust.caste = +this.f.caste.value;
      cust.permanent_address = this.f.permanent_address.value;
      cust.ward_no = +this.f.ward_no.value;
      cust.state = this.f.state.value;
      cust.dist = this.f.dist.value;
      cust.pin = +this.f.pin.value;
      cust.vill_cd = this.f.vill_cd.value;
      // during modification if village is not changed then block code & service area code
      // needs to be taken from selected customer
      cust.block_cd = (undefined === this.selectedBlock) ?
        this.selectedCustomer.block_cd : this.selectedBlock.block_cd;
      cust.service_area_cd = (undefined === this.selectedServiceArea) ?
        this.selectedCustomer.service_area_cd : this.selectedServiceArea.service_area_cd;
      cust.occupation = this.f.occupation.value;
      cust.phone = this.f.phone.value;
      cust.present_address = this.f.present_address.value;
      cust.farmer_type = this.f.farmer_type.value;
      cust.email = this.f.email.value;
      cust.monthly_income = +this.f.monthly_income.value;
      cust.date_of_death = ('' === this.f.date_of_death.value
        || '0001-01-01T00:00:00' === this.f.date_of_death.value)
        ? null : this.f.date_of_death.value;
      cust.sms_flag = this.f.sms_flag.value ? 'Y' : 'N';
      cust.status = this.f.status.value ? 'A' : this.f.status.value;
      cust.pan = this.f.pan.value;
      cust.nominee = this.f.nominee.value;
      cust.nom_relation = this.f.nom_relation.value;
      cust.kyc_photo_type = this.f.kyc_photo_type.value;
      cust.kyc_photo_no = this.f.kyc_photo_no.value;
      cust.kyc_address_type = this.f.kyc_address_type.value; // as per defect fix
      cust.kyc_address_no = this.f.kyc_address_no.value;
      cust.org_status = this.f.org_status.value;
      cust.org_reg_no = +this.f.org_reg_no.value;
    } catch (error) {
      console.error(error);
      this.HandleMessage(true, MessageType.Warning, error);
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }

    return cust;
  }
  handleFileInput(files: FileList, imgType: string) {
    this.errMessage = ''; this.sucessMsgs = [];
    this.fileToUpload = files.item(0);
    const name = this.fileToUpload.name; const size = this.fileToUpload.size;
    const extension = name.split('.').pop().toLowerCase();

    if (extension.toUpperCase() !== 'JPG') {
      this.errMessage = 'Images with JPG file types allowed.';
      return;
    }

    if (size / (1024 * 1024) > 1) {
      this.errMessage = 'File size should be less than 1mb.';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = rs => {
        // const imgHeight = rs.currentTarget['height'];
        // const imgWidth = rs.currentTarget['width'];

        // console.log(imgHeight, imgWidth);
        // ;
        // this.base64Image = e.target.result;
        let img = new kyc_sig();
        // console.log(this.base64Image);
        img.cust_cd = this.selectedCustomer.cust_cd;
        img.img_cont = e.target.result; // this.b64toBlob(this.base64Image,"image/jpeg",0)
        img.img_cont = img.img_cont;
        img.img_typ = imgType;
        img.created_by = this.sys.UserId;
        // img.img_cont_byte = null;
        // ;
        switch (imgType) {
          case 'PHOTO':
            this.PHOTO = img;
            this.disableImageSave = false;
            break;
          case 'SIGNATURE':
            this.SIGNATURE = img;
            this.disableImageSave = false;
            break;
          case 'ADDRESS':
            this.ADDRESS = img;
            this.disableImageSave = false;
            break;
          case 'KYC':
            this.KYC = img;
            this.disableImageSave = false;
            break;
        }
        // this.svc.addUpdDel('UCIC/WriteKycSig', this.image).subscribe(
        //   res => {
        //     //this.sucessMsg = name + ' uploaded sucessfully!!';
        //   },
        //   err => { }
        // );
      };
    };
    reader.readAsDataURL(this.fileToUpload);
  }
  onSaveImgClick(): void {
    // ;
    if (this.PHOTO !== undefined && this.PHOTO !== null && this.PHOTO.img_cont.length > 1) {
      this.svc.addUpdDel('UCIC/WriteKycSig', this.PHOTO).subscribe(
        res => {
          this.sucessMsgs.push('Picture uploaded sucessfully!!');
          this.PHOTO = null;
        },
        err => { }
      );
    }
    if (this.SIGNATURE !== undefined && this.SIGNATURE !== null && this.SIGNATURE.img_cont.length > 1) {
      this.svc.addUpdDel('UCIC/WriteKycSig', this.SIGNATURE).subscribe(
        res => {
          this.sucessMsgs.push('Signature uploaded sucessfully!!');
          this.SIGNATURE = null;
        },
        err => { }
      );
    }
    if (this.KYC !== undefined && this.KYC !== null && this.KYC.img_cont.length > 1) {
      this.svc.addUpdDel('UCIC/WriteKycSig', this.KYC).subscribe(
        res => {
          this.sucessMsgs.push('Customer Kyc uploaded sucessfully!!');
          this.KYC = null;
        },
        err => { }
      );
    }
    if (this.ADDRESS !== undefined && this.ADDRESS !== null && this.ADDRESS.img_cont.length > 1) {
      this.svc.addUpdDel('UCIC/WriteKycSig', this.ADDRESS).subscribe(
        res => {
          this.sucessMsgs.push('Address uploaded sucessfully!!');
          this.ADDRESS = null;
        },
        err => { }
      );
    }
  }

  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
}
