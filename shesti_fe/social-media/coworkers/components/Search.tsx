import Image from 'next/image';
import React from 'react';
import { NetworkSearchTypes } from '../page';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import {
  setSelectedStates,
  setSelectedTrades,
} from '@/redux/network/network.slice';

const initialValues = {
  searchText: '',
  locationText: '',
};

const validationSchema = Yup.object({
  searchText: Yup.string().optional(),
  locationText: Yup.string().optional(),
});

const Search = ({
  searchValuesHandler,
}: {
  searchValuesHandler: (values: NetworkSearchTypes) => void;
}) => {
  const dispatch = useDispatch();

  // submit handler
  const submitHandler = async (values: NetworkSearchTypes) => {
    if (values.locationText) {
      dispatch(setSelectedTrades([]));
      dispatch(setSelectedStates([]));
    }
    searchValuesHandler(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitHandler}
    >
      {({ handleBlur, handleChange, values, handleSubmit }) => {
        const { searchText, locationText } = values;
        return (
          <Form onSubmit={handleSubmit}>
            <div className="w-full grid justify-between grid-cols-8 gap-3 items-center mb-4 shadow rounded-xl p-4 bg-white">
              <div className="flex items-center col-span-2 gap-1 border-r border-lightSteelGray h-full">
                <Image src="/search.svg" alt="search" width={16} height={16} />
                <input
                  name="searchText"
                  type="text"
                  value={searchText}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Search"
                  className="focus:border-none px-3 w-full placeholder:text-osloGrey text-osloGrey outline-none"
                />
              </div>
              <div className="flex items-center gap-4 col-span-6 justify-end w-full">
                <div className="flex items-center gap-1 border-r border-lightSteelGray h-full">
                  <Image
                    src="/navigation-black.svg"
                    alt="search"
                    width={16}
                    height={16}
                  />
                  <input
                    type="text"
                    name="locationText"
                    value={locationText}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Yogyakarta, ID"
                    className="focus:border-none w-full placeholder:text-osloGrey px-3 text-osloGrey outline-none"
                  />
                </div>
                <button className="cursor-pointer p-3 max-w-[92px] rounded-lg border border-schestiPrimary hover:bg-slate-500 hover:text-white text-schestiPrimary bg-transparent font-semibold w-full">
                  Search{' '}
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Search;
