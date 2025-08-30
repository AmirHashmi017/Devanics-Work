import SenaryHeading from '@/app/component/headings/senaryHeading';
import {
  ContractPartyType,
  ICrmContract,
} from '@/app/interfaces/crm/crm-contract.interface';

import moment from 'moment';
import Image from 'next/image';

type Props = {
  contract: ICrmContract;
  receiver?: ContractPartyType;
};

export function ContractInfo({ contract }: Props) {
  return (
    <div>
      <SenaryHeading
        title={contract.title}
        className="text-schestiPrimaryBlack font-bold text-xl leading-7"
      />

      <div className="mt-5 grid grid-cols-1 w-full max-w-[500px] lg:max-w-full lg:grid-cols-4 gap-2 lg:gap-4">
        <div className="space-y-2">
          <SenaryHeading
            title="Project Name"
            className="text-schestiLightBlack text-base"
          />

          <SenaryHeading
            title={contract.projectName}
            className="text-schestiPrimaryBlack font-normal text-base"
          />
        </div>

        <div className="space-y-2">
          <SenaryHeading
            title="Project Number"
            className="text-schestiLightBlack text-base"
          />

          <SenaryHeading
            title={contract.projectNo}
            className="text-schestiPrimaryBlack font-normal text-base"
          />
        </div>

        <div className="space-y-2">
          <SenaryHeading
            title="Start Date"
            className="text-schestiLightBlack text-base"
          />

          <SenaryHeading
            title={moment(contract.startDate).format('DD/MM/YYYY')}
            className="text-schestiPrimaryBlack font-normal text-base"
          />
        </div>

        <div className="space-y-2">
          <SenaryHeading
            title="End Date"
            className="text-schestiLightBlack text-base"
          />

          <SenaryHeading
            title={moment(contract.endDate).format('DD/MM/YYYY')}
            className="text-schestiPrimaryBlack font-normal text-base"
          />
        </div>
      </div>

      <div className="gap-2 mt-5">
        <SenaryHeading
          title="Description"
          className="text-schestiLightBlack text-base"
        />

        <SenaryHeading
          title={contract.description}
          className="text-schestiPrimaryBlack font-normal text-base"
        />
      </div>

      <div className="mt-5 p-3 lg:p-6 rounded-md">
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-2 lg:gap-4">
          <div className="space-y-3 bg-gray-50 p-3 rounded-md">
            <SenaryHeading
              title="Sender Information"
              className="text-base text-schestiPrimary font-medium"
            />

            {contract.receipts
              .filter((receipt) => receipt.type === 'sender')
              .map((receipt) => (
                <div
                  key={receipt._id}
                  className="flex border-b border-gray-300 py-1 items-center justify-between"
                >
                  <div>
                    <SenaryHeading
                      title={receipt.name}
                      className="text-schestiPrimaryBlack font-normal text-base"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Image
                      alt="building"
                      src={'/building.svg'}
                      width={20}
                      height={20}
                    />
                    <SenaryHeading
                      title={receipt.companyName}
                      className="text-schestiPrimaryBlack font-normal text-base"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Image
                      alt="mail"
                      src={'/mail-black.svg'}
                      width={20}
                      height={20}
                    />
                    <SenaryHeading
                      title={receipt.email}
                      className="text-schestiPrimaryBlack font-normal text-base"
                    />
                  </div>
                </div>
              ))}
          </div>

          <div className="space-y-3  bg-gray-50 p-3 rounded-md">
            <SenaryHeading
              title="Receiver Information"
              className="text-base text-schestiPrimary font-medium"
            />

            {contract.receipts
              .filter((receipt) => receipt.type === 'receiver')
              .map((receipt) => (
                <div
                  key={receipt._id}
                  className="flex border-b border-gray-300 py-1 items-center justify-between"
                >
                  <div>
                    <SenaryHeading
                      title={receipt.name}
                      className="text-schestiPrimaryBlack font-normal text-base"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Image
                      alt="building"
                      src={'/building.svg'}
                      width={20}
                      height={20}
                    />
                    <SenaryHeading
                      title={receipt.companyName}
                      className="text-schestiPrimaryBlack font-normal text-base"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Image
                      alt="mail"
                      src={'/mail-black.svg'}
                      width={20}
                      height={20}
                    />
                    <SenaryHeading
                      title={receipt.email}
                      className="text-schestiPrimaryBlack font-normal text-base"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
