import { InputComponent } from '@/app/component/customInput/Input';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { CreateOwnerPostProjectType } from '@/app/services/bid-management.service';
import { Country, State, City } from 'country-state-city';
import type { FormikProps } from 'formik';
import { useState } from 'react';

type Props = {
  children?: React.ReactNode;
  formik: FormikProps<CreateOwnerPostProjectType>;
};

export function PostBasicInformation({ children, formik }: Props) {
  const [country, setCountry] = useState<string>(formik.values.country);
  const [state, setState] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [city, setCity] = useState<string>('');

  const countries = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));
  const states = State.getAllStates()
    .filter(
      (state) =>
        state.countryCode === country ||
        formik.values.country === state.countryCode
    )
    .map((state) => ({ label: state.name, value: state.isoCode }));
  const cities = City.getCitiesOfState(
    country,
    state || formik.values.state
  ).map((city) => ({ label: city.name, value: city.name }));

  return (
    <div className=" bg-white shadow-[0_4px_30px_0px_#2E2D740D] rounded-xl border p-4">
      <TertiaryHeading
        title="Basic Information"
        className="text-[20px] leading-[30px]"
      />

      <div className=" mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <InputComponent
            label="Project Name"
            name="projectName"
            type="text"
            placeholder="Enter Project Name"
            field={{
              value: formik.values.projectName,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
            hasError={
              formik.touched.projectName && Boolean(formik.errors.projectName)
            }
            errorMessage={
              formik.touched.projectName && formik.errors.projectName
                ? formik.errors.projectName
                : ''
            }
          />

          <InputComponent
            label="Address"
            name="address"
            type="text"
            placeholder="Enter Address"
            field={{
              value: formik.values.address,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
            hasError={formik.touched.address && Boolean(formik.errors.address)}
            errorMessage={
              formik.touched.address && formik.errors.address
                ? formik.errors.address
                : ''
            }
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <SelectComponent
              label="Country"
              placeholder="Country"
              name="country"
              field={{
                options: countries,
                showSearch: true,
                value: formik.values.country,
                onChange: (value) => {
                  setCountry(value);
                  formik.setFieldValue('country', value);
                  formik.setFieldValue('state', '');
                  formik.setFieldValue('city', '');
                  setState('');
                  setCity('');
                },
                onClear() {
                  formik.setFieldValue('country', '');
                  formik.setFieldValue('state', '');
                  formik.setFieldValue('city', '');
                  setCountry('');
                  setState('');
                  setCity('');
                },
                optionFilterProp: 'label',
              }}
              hasError={
                formik.touched.country && Boolean(formik.errors.country)
              }
              errorMessage={
                formik.touched.country && formik.errors.country
                  ? formik.errors.country
                  : ''
              }
            />
          </div>
          <div className="flex-1">
            <InputComponent
              label="Zip Code"
              name="zipCode"
              type="text"
              placeholder="Enter Zip Code"
              field={{
                value: formik.values.zipCode,
                onChange: (e) =>
                  formik.setFieldValue('zipCode', `${e.target.value}`),
                onBlur: formik.handleBlur,
              }}
              hasError={
                formik.touched.zipCode && Boolean(formik.errors.zipCode)
              }
              errorMessage={
                formik.touched.zipCode && formik.errors.zipCode
                  ? formik.errors.zipCode
                  : ''
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SelectComponent
            label="State"
            name="state"
            placeholder="State"
            field={{
              options: states,
              value: formik.values.state,
              showSearch: true,
              onChange(value) {
                setState(value);
                formik.setFieldValue('state', value);
                formik.setFieldValue('city', '');
                setCity('');
              },
              onBlur: formik.handleBlur,
              onClear() {
                formik.setFieldValue('state', '');
                formik.setFieldValue('city', '');
                setState('');
                setCity('');
              },
              optionFilterProp: 'label',
            }}
            errorMessage={
              formik.touched.state && formik.errors.state
                ? formik.errors.state
                : ''
            }
            hasError={formik.touched.state && Boolean(formik.errors.state)}
          />
          <SelectComponent
            label="City"
            name="city"
            placeholder="City"
            field={{
              options: cities,
              showSearch: true,
              value: formik.values.city || city,
              onChange: (value) => {
                setCity(value);
                formik.setFieldValue('city', value);
              },
              onBlur: formik.handleBlur,
              allowClear: true,
              onClear() {
                formik.setFieldValue('city', '');
                setCity('');
              },
              optionFilterProp: 'label',
            }}
            errorMessage={
              formik.touched.city && formik.errors.city
                ? formik.errors.city
                : ''
            }
            hasError={formik.touched.city && Boolean(formik.errors.city)}
          />
        </div>

        <SelectComponent
          label="Construction Types"
          name="constructionTypes"
          placeholder="Construction Types"
          field={{
            options: [
              {
                value: 'Civil',
                label: 'Civil',
              },
              {
                value: 'Commercial',
                label: 'Commercial',
              },
              { label: 'Government / Public', value: 'Government / Public' },
              { label: 'Industrial', value: 'Industrial' },
              { label: 'Residential', value: 'Residential' },
            ],
            showSearch: true,
            mode: 'multiple',
            value: formik.values.constructionTypes,
            onChange(value: string[]) {
              formik.setFieldValue('constructionTypes', value);
            },
            onClear() {
              formik.setFieldValue('constructionTypes', '');
            },
            onBlur: formik.handleBlur,
          }}
          hasError={
            formik.touched.constructionTypes &&
            Boolean(formik.errors.constructionTypes)
          }
          errorMessage={
            formik.touched.constructionTypes && formik.errors.constructionTypes
              ? formik.errors.constructionTypes.toString()
              : ''
          }
        />
      </div>
      {children}
    </div>
  );
}
