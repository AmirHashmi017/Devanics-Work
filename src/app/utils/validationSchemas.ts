import { isValidPhoneNumber } from 'react-phone-number-input';
import * as Yup from 'yup';
import { ShouldHaveAtLeastCharacterRegex } from './regex.util';

Yup.addMethod(Yup.string, 'phone', function (message: string) {
  return this.test('phone', message, function (value) {
    const { path, createError } = this;
    if (value) {
      if (isValidPhoneNumber(value)) {
        return true;
      } else {
        return createError({
          path,
          message: message || 'Invalid phone number',
        });
      }
    }
  });
});

export const ContractorSchema: any = Yup.object({
  companyName: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'At least one letter is required.',
    })
    .required('Company Name is required'),
  industry: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'At least one letter is required.',
    })
    .required('Industry is required'),
  employee: Yup.number()
    .positive('Must have 1 Employee')
    .required('No Of Employees are required'),
  // phoneNumber: Yup.string().optional(),
  address: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'At least one letter is required.',
    })
    .optional(),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  organizationName: Yup.string().optional(),
  phone: Yup.string()
    // @ts-ignore
    .phone('Invalid Phone Number')
    .required('Phone Number is required'),
});

export const VendorAndArchitectSchema: any = Yup.object({
  companyName: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'At least one letter is required.',
    })
    .required('Company Name is required'),
  employee: Yup.number()
    .positive('Must have 1 Employee')
    .required('No Of Employees are required'),
  // phoneNumber: Yup.string().optional(),
  address: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'At least one letter is required.',
    })
    .required('Address is required'),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  organizationName: Yup.string().optional(),
  phone: Yup.string()
    // @ts-ignore
    .phone('Invalid Phone Number')
    .required('Phone Number is required'),
});

export const SubContractorSchema: any = Yup.object({
  companyName: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'At least one letter is required.',
    })
    .required('Company Name is required'),
  employee: Yup.number()
    .positive('Must have 1 Employee')
    .required('No Of Employees are required'),
  // phoneNumber: Yup.string().optional(),
  industry: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'At least one letter is required.',
    })
    .optional(),
  address: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'At least one letter is required.',
    })
    .optional(),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  organizationName: Yup.string().optional(),
  phone: Yup.string()
    // @ts-ignore
    .phone('Invalid Phone Number')
    .required('Phone Number is required'),
});

export const OwnerSchema: any = Yup.object({
  // phoneNumber: Yup.string().optional(),
  address: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'At least one letter is required.',
    })
    .required('Address is required'),
  organizationName: Yup.string()
    .matches(ShouldHaveAtLeastCharacterRegex, {
      message: 'At least one letter is required.',
    })
    .required('Organization Name is required'),
  phone: Yup.string()
    // @ts-ignore
    .phone('Invalid Phone Number')
    .required('Phone Number is required'),
  companyName: Yup.string().optional(),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  industry: Yup.string().optional(),
  employee: Yup.number().positive('Must have 1 Employee').optional(),
});

export const EducationalSchema = Yup.object({
  address: Yup.string().required('Address is required'),
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  phone: Yup.string()
    // @ts-ignore
    .phone('Invalid Phone Number')
    .required('Phone Number is required'),
  university: Yup.string().required('University is required'),
  educationalDocuments: Yup.array(Yup.mixed())
    .min(1, 'Education Documents is required')
    .required('Education Documents is required'),
});
