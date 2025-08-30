import { IAIAInvoice } from '@/app/interfaces/client-invoice.interface';
import { ISettingTarget } from '@/app/interfaces/companyInterfaces/setting.interface';
import moment from 'moment';

export function completedTargets(
  targets: ISettingTarget[],
  invoices: IAIAInvoice[]
) {
  const result = invoices.filter((invoice) => {
    return targets.find(
      (target) =>
        target.month === moment(invoice.applicationDate).format('MMMM')
    );
  });
  console.log('Result', result);
  return result;
}

export function totalReceivable(
  target: ISettingTarget,
  invoices: IAIAInvoice[]
) {
  return invoices
    .filter((invoice) => {
      return (
        target.month === moment(invoice.applicationDate).format('MMMM') &&
        invoice.amountPaid < Number(target.price)
      );
    })
    .reduce((acc, invoice) => {
      return acc + invoice.amountPaid;
    }, 0);
}

export function remainingTargets(
  targets: ISettingTarget[],
  invoices: IAIAInvoice[]
) {
  return targets.filter((target) => {
    return invoices.filter((invoice) => {
      return (
        target.month === moment(invoice.applicationDate).format('MMMM') &&
        target.year === moment(invoice.applicationDate).format('YYYY') &&
        invoice.amountPaid < Number(target.price)
      );
    });
  });
}
export function targetPercentage(
  completedLength: number,
  targetsLength: number
) {
  return (completedLength / targetsLength) * 100;
}

export function totalCompletedAmount(completedTargets: ISettingTarget[]) {
  return completedTargets.reduce((acc, target) => {
    return acc + Number(target.price);
  }, 0);
}

export function totalRemainingAmount(remainingTargets: ISettingTarget[]) {
  return remainingTargets.reduce((acc, target) => {
    return acc + Number(target.price);
  }, 0);
}
