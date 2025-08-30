import { isValidPhoneNumber } from 'react-phone-number-input';
import * as Yup from 'yup';

export const ProposalValidationSchema = Yup.object().shape({
  proposalId: Yup.string().required('Proposal ID is required!'),
  clientName: Yup.string().required('Client Name is required!'),
  clientEmail: Yup.string()
    .email('Email should be valid')
    .required('Email is required!'),
  projectName: Yup.string().required('Project Name is required!'),
  dateOfProposal: Yup.string().required('Date of Proposal is required!'),

  scope: Yup.string().required('Scope is required!'),

  items: Yup.array()
    .of(
      Yup.object().shape({
        description: Yup.string().required('Description is required!'),
        quantity: Yup.string().required('Quantity is required!'),
        unitPrice: Yup.string().required('Unit Price is required!'),
      })
    )
    .min(1, 'At least one item is required!'),

  paymentTerms: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one payment term is required!'),

  contractDetails: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one contract detail is required!'),

  documents: Yup.array()
    .of(Yup.mixed())
    .min(1, 'At least one document is required!'),

  companySignature: Yup.object().shape({
    date: Yup.string().required('Date is required!'),
    name: Yup.string().required('Name is required!'),
    signature: Yup.object()
      .shape({
        url: Yup.string().required('Signature is required!'),
      })
      .required('Signature is required!'),
    isApproved: Yup.boolean()
      .is([true], 'You must approve')
      .required('You must approve'),
  }),
  materialTax: Yup.number()
    .min(0)
    .max(100, 'Material Tax must be between 0 and 100')
    .required('Material Tax is required!'),
  profit: Yup.number()
    .min(0)
    .max(100, 'Profit must be between 0 and 100')
    .required('Profit is required!'),
  clientPhone: Yup.string()
    .test({
      test: (value) => {
        if (value && !isValidPhoneNumber(value)) {
          return false;
        }
        return true;
      },
      message: 'Please enter a valid phone number',
    })
    .required('Phone number is required!'),
});

export const ClientSignatureValidationSchema = Yup.object().shape({
  date: Yup.string().required('Date is required!'),
  name: Yup.string().required('Name is required!'),
  signature: Yup.object()
    .shape({
      url: Yup.string().required('Signature is required!'),
    })
    .required('Signature is required!'),
  isApproved: Yup.boolean()
    .is([true], 'You must approve')
    .required('You must approve'),
});
