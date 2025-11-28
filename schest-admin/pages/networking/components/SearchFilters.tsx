import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Country, State } from 'country-state-city';
import { useDispatch, useSelector } from 'react-redux';
import { SelectComponent } from 'src/components/customSelect/Select.component';
import {
  setSelectedStates,
  setSelectedTrades,
} from 'src/redux/network/network.slice';
import { useTrades } from 'src/hooks/useTrades';

type FilterInitTypes = { country: string; state: string; trade: string };

const countries = Country.getAllCountries().map((country) => ({
  label: country.name,
  value: country.isoCode,
}));

export interface Trade {
  _id: string;
  user: string;
  tradeCategoryId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const SearchFilters = () => {
  const {
    user: { user },
  } = useSelector((state: any) => state.auth);
  const [country, setCountry] = useState(user.country || '');
  const [state, setState] = useState(user?.state || '');
  const [isTradeExist, setIsTradeExist] = useState(false);
  const [isStateExist, setIsStateExist] = useState(false);
  const {
    selectedStates,
    selectedTrades,
  }: {
    selectedStates: string[];
    selectedTrades: string[];
  } = useSelector((state: any) => state.network);
  const dispatch = useDispatch();
  const { tradeCategoryFilters, trades } = useTrades();

  useEffect(() => {
    setTimeout(() => {
      setIsStateExist(false);
      setIsTradeExist(false);
    }, 3000);
  }, [isStateExist, isTradeExist]);

  const states = State.getAllStates()
    .filter((state) => state.countryCode === country)
    .map((state) => ({ label: state.name, value: state.isoCode }));

  const initialValues: FilterInitTypes = {
    country,
    state,
    trade: '',
  };

  const allTrades = trades.map((state) => ({
    label: state.name,
    value: state._id,
  }));

  const validationSchema = Yup.object({});

  // submit handler
  const submitHandler = async () => {};

  const tradesOptions = tradeCategoryFilters.map((parent) => {
    return {
      label: <span>{parent.label}</span>,
      title: parent.label,
      options: trades
        .filter((trade) => trade.tradeCategoryId._id === parent.value)
        .map((child) => {
          return {
            label: <span>{child.name}</span>,
            value: child._id,
          };
        }),
    };
  });

  return (
    <section className="w-full mt-3.5 shadow rounded-xl p-6 bg-white">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {({ values, errors, handleBlur, setFieldValue, touched }) => (
          <>
            <h6 className="text-ebonyClay font-bold text-lg">Search Filter</h6>
            <div className="mt-4">
              <div className="flex flex-col gap-2">
                <SelectComponent
                  label="Country"
                  placeholder="Country"
                  name="country"
                  field={{
                    options: countries,
                    showSearch: true,
                    value: values.country,
                    onChange: (value) => {
                      setCountry(value);
                      setFieldValue('country', value);
                      setFieldValue('state', '');
                      setState('');
                    },
                    onClear() {
                      setFieldValue('country', '');
                      setFieldValue('state', '');
                      setCountry('');
                      setState('');
                    },
                  }}
                  hasError={touched.country && Boolean(errors.country)}
                  errorMessage={
                    touched.country && errors.country ? errors.country : ''
                  }
                />
                <SelectComponent
                  label="State"
                  name="state"
                  placeholder="State"
                  field={{
                    options: states,
                    value: values.state,
                    showSearch: true,
                    onChange(value) {
                      if (selectedTrades.includes(value)) {
                        setIsStateExist(true);
                      } else {
                        setState(value);
                        setFieldValue('state', value);
                        const allSelectedStates = [value, ...selectedStates];
                        dispatch(setSelectedStates(allSelectedStates));
                      }
                    },
                    onBlur: handleBlur,
                    onClear() {
                      setFieldValue('state', '');
                      setState('');
                    },
                  }}
                  errorMessage={
                    touched.state && errors.state ? errors.state : ''
                  }
                  hasError={touched.state && Boolean(errors.state)}
                />
                {isStateExist && (
                  <div className="flex justify-end">
                    <p className="text-red-600 py-1">State already exist</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-1 border-b border-lightSteelGray pb-6">
                  {selectedStates.map((state, i) => (
                    <div
                      key={i}
                      className="flex gap-0.5 rounded-[163px] bg-schestiLightPrimary items-center px-2 py-1.5"
                    >
                      <p className="text-xs text-graphiteGray">{state}</p>
                      <img
                        onClick={() => {
                          dispatch(
                            setSelectedStates(
                              selectedStates.filter(
                                (currentState) => currentState !== state
                              )
                            )
                          );
                        }}
                        src="/assets/icons/crossblack.svg"
                        className="cursor-pointer size-2.5"
                        alt="close"
                        width={10}
                        height={10}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <SelectComponent
                  label="Trades"
                  name="bidTrades"
                  placeholder="Select Trade"
                  field={{
                    options: tradesOptions,
                    mode: 'tags',
                    value: selectedTrades,
                    onChange(trades) {
                      dispatch(setSelectedTrades(trades));
                    },
                    onBlur: handleBlur,
                  }}
                  errorMessage={
                    touched.state && errors.state ? errors.state : ''
                  }
                  hasError={touched.state && Boolean(errors.state)}
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedTrades.map((trade, i) => (
                    <div
                      key={i}
                      className="flex gap-0.5 rounded-[163px] bg-schestiLightPrimary items-center px-2 py-1.5"
                    >
                      <p className="text-xs text-graphiteGray">
                        {trades.find(({ _id }) => _id === trade)?.name}
                      </p>
                      <img
                        onClick={() =>
                          dispatch(
                            setSelectedTrades(
                              selectedTrades.filter(
                                (currentTrade) => currentTrade !== trade
                              )
                            )
                          )
                        }
                        src="/assets/icons/crossblack.svg"
                        className="cursor-pointer size-2.5"
                        alt="close"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </Formik>
    </section>
  );
};

export default SearchFilters;
