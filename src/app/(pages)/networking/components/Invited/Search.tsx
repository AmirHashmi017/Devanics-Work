import Image from 'next/image';
import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

export type InvitedSearchTypes = {
  searchText: string;
};

const initialValues = {
  searchText: '',
};

const validationSchema = Yup.object({
  searchText: Yup.string().optional(),
});

const Search = ({
  searchValuesHandler,
}: {
  searchValuesHandler: (values: InvitedSearchTypes) => void;
}) => {
  // submit handler
  const submitHandler = async (values: InvitedSearchTypes) => {
    searchValuesHandler(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitHandler}
    >
      {({ handleBlur, handleChange, values, handleSubmit }) => {
        const { searchText } = values;
        return (
          <Form onSubmit={handleSubmit}>
            <div className="w-full grid justify-between grid-cols-8 gap-3 items-center mt-3.5 shadow rounded-xl p-4 bg-white">
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
