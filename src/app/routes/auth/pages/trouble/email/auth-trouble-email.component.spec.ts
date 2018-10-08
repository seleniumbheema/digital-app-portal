// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { TestModule } from '../../../../../../test-helpers';
// import { AuthService } from '../../../../../components/auth/auth.service';
// import { AuthTroubleEmailComponent } from './auth-trouble-email.component';
// import { PostcodeComponent } from '../../../../../components/view/forms/postcode/postcode.component';

// let getUsernameCalled: boolean = false;
// let validUserDetails: boolean;

// const username: string = 'testuser@email.com';

// class MockAuthService {
//   public getUsernameFromCustomerDetails() {
//     return new Promise((resolve, reject) => {
//       getUsernameCalled = true;
//       if (validUserDetails) {
//         resolve(username);
//       } else {
//         reject();
//       }
//     });
//   }

//   public setUserEmail() {
//     return true;
//   }
// }

// describe('AuthTroubleEmailComponent', () => {
//   let component: AuthTroubleEmailComponent;
//   let fixture: ComponentFixture<AuthTroubleEmailComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         AuthTroubleEmailComponent,
//         PostcodeComponent,
//       ],
//       providers: [
//         AuthService,
//         { provide: AuthService, useClass: MockAuthService },
//       ],
//       imports: [
//         TestModule,
//       ],
//     });

//     fixture = TestBed.createComponent(AuthTroubleEmailComponent);
//     component = fixture.componentInstance;
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('Get Username screeningForm', () => {
//     beforeEach(() => {
//       fixture.detectChanges();
//     });

//     it('should be valid if screeningForm inputs are valid', () => {
//       component.form.setValue({
//         Fname: 'Bob',
//         Lname: 'Mortimer',
//         Postcode: 'TE5 7ER',
//         DateOfBirth: {
//           Day: '01',
//           Month: '11',
//           Year: '1999',
//         },
//       });

//       expect(component.form.valid).toBeTrue();
//     });

//     it('should be invalid if firstName input is invalid', () => {
//       component.form.setValue({
//         Fname: null,
//         Lname: 'Mortimer',
//         Postcode: 'TE5 7ER',
//         DateOfBirth: {
//           Day: '01',
//           Month: '11',
//           Year: '1999',
//         },
//       });

//       expect(component.form.valid).toBeFalse();
//     });

//     it('should be invalid if lastName input is invalid', () => {
//       component.form.setValue({
//         Fname: 'Bob',
//         Lname: null,
//         Postcode: 'TE5 7ER',
//         DateOfBirth: {
//           Day: '01',
//           Month: '11',
//           Year: '1999',
//         },
//       });

//       expect(component.form.valid).toBeFalse();
//     });

//     it('should be invalid if postcode input is invalid', () => {
//       component.form.setValue({
//         Fname: 'Bob',
//         Lname: 'Mortimer',
//         Postcode: '',
//         DateOfBirth: {
//           Day: '01',
//           Month: '11',
//           Year: '1999',
//         },
//       });

//       expect(component.form.valid).toBeFalse();
//     });

//     it('should be invalid if date input is after the max date', () => {
//       const year = new Date().getFullYear();
//       component.form.setValue({
//         Fname: 'Bob',
//         Lname: 'Mortimer',
//         Postcode: 'SM71EA',
//         DateOfBirth: {
//           Day: '01',
//           Month: '11',
//           Year: year + '',
//         },
//       });

//       expect(component.form.valid).toBeFalse();
//       expect(component.dateOfBirthGroup.errors).toHaveMember('dateAfter');
//     });

//     it('should be invalid if date input is not a valid date like 31st February', () => {
//       const year = new Date().getFullYear();
//       component.form.setValue({
//         Fname: 'Bob',
//         Lname: 'Mortimer',
//         Postcode: 'SM71EA',
//         DateOfBirth: {
//           Day: '31',
//           Month: '02',
//           Year: year - 30 + '',
//         },
//       });

//       expect(component.form.valid).toBeFalse();
//       expect(component.dateOfBirthGroup.errors).toHaveMember('invalidDate');
//     });
//   });

//   describe('onPassSubmit() method', () => {

//     beforeEach(() => {
//       fixture.detectChanges();
//       component.disableSubmit = false;
//     });

//     afterEach(() => {
//       getUsernameCalled = false;
//       component.disableSubmit = false;
//     });

//     describe('valid screeningForm', () => {

//       beforeEach(() => {
//         component.form.patchValue({
//           Fname: 'Bruce',
//           Lname: 'Waybe',
//           Postcode: 'B7 4MN',
//           DateOfBirth: {
//             Day: '02',
//             Month: '12',
//             Year: '1971',
//           },
//         });
//       });

//       describe('valid user', () => {
//         beforeEach(() => {
//           validUserDetails = true;
//           component.onSubmit();
//         });

//         it('should submit the screeningForm', () => {
//           expect(getUsernameCalled).toBeTrue();
//         });

//         it('should disable the submit button', () => {
//           expect(component.disableSubmit).toBeTrue(); // expect disableSubmit not to change
//         });
//       });

//       describe('invalid user', () => {
//         beforeEach(async(() => {
//           validUserDetails = false;
//           component.onSubmit();
//         }));

//         it('should submit the screeningForm', () => {
//           expect(getUsernameCalled).toBeTrue();
//         });

//         it('should disable the submit button', () => {
//           expect(component.disableSubmit).toBeFalse(); // expect disableSubmit not to change
//         });

//         it('should show the error message', () => {
//           expect(component.messages).toBeNonEmptyArray(); // expect disableSubmit not to change
//         });
//       });

//     });

//     describe('invalid screeningForm', () => {

//       beforeEach(() => {
//         component.form.patchValue({
//           Fname: '',
//           Lname: '',
//           Postcode: '',
//           DateOfBirth: {
//             Day: '',
//             Month: '',
//             Year: '',
//           },
//         });

//         component.onSubmit();
//       });

//       it('should not submit the screeningForm', () => {
//         expect(getUsernameCalled).toBeFalse();  // expect authservice no to be called
//       });

//       it('should not disable the submit button', () => {
//         expect(component.disableSubmit).toBeFalse();  // expect disableSubmit to change to false
//       });

//       it('should set submitted to true', () => {
//         expect(component.submitted).toBeTrue(); // expect disableSubmit not to change
//       });
//     });
//   });
// });
