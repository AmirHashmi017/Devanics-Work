'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Button from '@/app/component/customButton/button';
import Image from 'next/image';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import QuinaryHeading from '@/app/component/headings/quinary';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanySubcontractors } from '@/redux/company/company.thunk';
import { selectSubcontractLoading } from '@/redux/company/companySelector';
import {
  ISubcontract,
  ISubcontractor,
} from '@/app/interfaces/companyInterfaces/subcontractor.interface';
import { NoDataComponent } from '@/app/component/noData/NoDataComponent';

interface Props {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectSubcontract: (_data: ISubcontract) => void;
}

const ExistingSubContractor = ({
  setModalOpen,
  onSelectSubcontract,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const subcontractLoading = useSelector(selectSubcontractLoading);
  const subcontractData = useSelector(
    (state: RootState) => state.companySubContractor?.data
  );
  const [search, setSearch] = useState('');

  const [selectedSubcontractId, setSelectedSubcontractId] = useState(
    subcontractData && subcontractData.length > 0 ? subcontractData[0]._id : ''
  );

  const memoizedSetPerson = useCallback(async () => {
    await dispatch(fetchCompanySubcontractors({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    memoizedSetPerson();
  }, [memoizedSetPerson]);

  return (
    <div className="py-2.5 px-6 bg-white border border-solid border-elboneyGray rounded-[4px] z-50">
      <section className="w-full">
        <div className="flex justify-between items-center border-b-Gainsboro ">
          <div>
            <QuaternaryHeading
              title="Existing Subcontractors"
              className="text-graphiteGray font-bold"
            />
            <QuinaryHeading
              title="Select any existing subcontractor from here."
              className="text-coolGray"
            />
          </div>
          <Image
            src={'/crossblack.svg'}
            alt="close icon"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() => setModalOpen(false)}
          />
        </div>
        <div className="rounded-lg border border-Gainsboro bg-silverGray w-[335px] h-[40px] my-5 flex items-center px-3">
          <input
            type="search"
            name=""
            id=""
            placeholder="Search..."
            className="w-full h-full bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Image
            src={'/search.svg'}
            alt="search icon "
            width={16}
            height={16}
            className="cursor-pointer"
          />
        </div>
        {/* Table */}
        <div className="rounded-md border-2 border-lightGrayishBlue h-[50vh] overflow-x-auto">
          <div className="px-4 py-2 border-t-lightGrayishBlue bg-paleGrayishWhite border border-l-lightGrayishBlue">
            <QuinaryHeading
              title="Name"
              className="font-medium text-graphiteGray"
            />
          </div>

          {subcontractLoading ? (
            <h6 className="text-center">Loading...</h6>
          ) : !subcontractData || subcontractData.length === 0 ? (
            <NoDataComponent
              title="Existing Subcontractors"
              description="No Subcontractors Found"
            />
          ) : (
            subcontractData
              .filter((contractor) => {
                if (!search) {
                  return contractor;
                }
                return contractor.name
                  .toLowerCase()
                  .includes(search.toLowerCase());
              })
              .map(({ _id, name }, i: number) => {
                return (
                  <Fragment key={i}>
                    <div className="border-b-lightGrayishBlue p-4 flex gap-4 items-center bg-snowWhite border">
                      <input
                        type="radio"
                        name="client name"
                        id={_id}
                        onChange={() => setSelectedSubcontractId(_id)}
                      />
                      {/* <Image src={img} alt="client icon" width={30} height={30} /> */}
                      <label htmlFor={_id} className="cursor-pointer">
                        <SenaryHeading
                          title={name}
                          className="text-darkSteelBlue"
                        />
                      </label>
                    </div>
                  </Fragment>
                );
              })
          )}
        </div>
      </section>
      <div className="h-px bg-elboneyGray w-full mt-6"></div>
      <div className="flex justify-end gap-4 mt-5 mb-2">
        <div>
          <Button
            text="Cancel"
            className="!bg-snowWhite !text-abyssalBlack"
            onClick={() => setModalOpen(false)}
          />
        </div>
        <div>
          <Button
            text="Add Subcontractor"
            disabled={!selectedSubcontractId}
            onClick={() => {
              onSelectSubcontract(
                subcontractData!.find(
                  ({ _id }) => _id === selectedSubcontractId
                ) as unknown as ISubcontractor
              );
              setModalOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExistingSubContractor;
