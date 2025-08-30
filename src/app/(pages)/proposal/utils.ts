import { IEstimateProposalForm } from '@/app/interfaces/estimate-proposal.interface';

export function getEstimateProposalTotal(
  sumSubtotal: number = 0,
  materialTaxPercentage: number = 0,
  overheadTaxPercentage: number = 0
) {
  const materialTax = sumSubtotal * (materialTaxPercentage / 100);
  const overheadTax = sumSubtotal * (overheadTaxPercentage / 100);
  return sumSubtotal + materialTax + overheadTax;
}

export function getEstimateProposalSumOfSubtotal(
  items: IEstimateProposalForm['items']
) {
  return items.reduce((total, item) => {
    return total + item.quantity * item.unitPrice;
  }, 0);
}
