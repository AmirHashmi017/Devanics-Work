'use client';
import Button from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import Image from 'next/image';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { Select, Radio, Input, Checkbox } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { fetchTakeoffPreset } from '@/redux/takeoff/takeoff.thunk';
import { AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { selectTakeoffPreset } from '@/redux/takeoff/takeoff.Selector';
import { takeoffPresetService } from '@/app/services/takeoff.service';
import { addNewTakeoffPresetData } from '@/redux/takeoff/takeoff.slice';
import { ScaleContext } from '../../context';
import { ScaleDataContextProps } from '../../context/ScaleContext';
import useDraw, { measurementUnits } from '@/app/hooks/useDraw';

const precisions = ['1', '0.1', '0.01', ' 0.001', '0.0001', '0.00001'];
const byPrecision = ['1', '1/2', '1/4', '1/8', '1/16', '1/32'];
const meters = ['in', 'cm', 'mm'];

const byDefaultPrest = [
  { label: `1"=1"`, value: `1"=1"` },
  { label: `1/32"=1'-0"`, value: `1/32"=1'-0"` },
  { label: `1/16"=1'-0"`, value: `1/16"=1'-0"` },
  { label: `3/32"=1'0"`, value: `3/32"=1'0"` },
  { label: `1/8"=1'-0"`, value: `1/8"=1'-0"` },
  { label: `3/16"=1'-0"`, value: `3/16"=1'-0"` },
  { label: `1/4"=1'-0"`, value: `1/4"=1'-0"` },
  { label: `1/2"=1'-0"`, value: `1/2"=1'-0"` },
  { label: `3/4"=1'-0"`, value: `3/4"=1'-0"` },
  { label: `1"=1'-0"`, value: `1"=1'-0"` },
  { label: `11/2"=1'-0"`, value: `11/2"=1'-0"` },
  { label: `1"=80'`, value: `1"=80'` },
  { label: `1"=90'`, value: `1"=90'` },
  { label: `1"=100'`, value: `1"=100'` },
  { label: `1"=200'`, value: `1"=200'` },
  { label: `1"=300'`, value: `1"=300'` },
  { label: `1"=400'`, value: `1"=400'` },
  { label: `1:1`, value: `1:1` },
  { label: `1:10`, value: `1:10` },
  { label: `1:20`, value: `1:20` },
  { label: `1:50`, value: `1:50` },
  { label: `1:100`, value: `1:100` },
  { label: `1:200`, value: `1:200` },
  { label: `1:500`, value: `1:500` },
  { label: `1:1000`, value: `1:1000` },
];

interface Props {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  numOfPages: number;
  page?: number;
  drawScale?: boolean;
  setdrawScale?: any;
  scaleLine?: any;
}

const ScaleModal = ({
  setModalOpen,
  numOfPages,
  page,
  setdrawScale,
  scaleLine,
}: Props) => {
  const { calcLineDistance } = useDraw();
  const dispatch = useDispatch<AppDispatch>();
  const allPresets = useSelector(selectTakeoffPreset);

  const [mergedPresets, setMergedPresets] = useState<any[]>([]);

  const [valueX, setValueX] = useState('preset');
  const [valueY, setValueY] = useState('preset');

  const [secMeterX, setSecMeterX] = useState('in');
  const [secMeterY, setSecMeterY] = useState('in');

  const [meterX, setMeterX] = useState('in');
  const [meterY, setMeterY] = useState('in');

  const [presetX, setPresetX] = useState('');
  const [presetY, setPresetY] = useState('');

  const [firstValueX, setFirstValueX] = useState('1');
  const [firstValueY, setFirstValueY] = useState('1');

  const [secondValueX, setSecondValueX] = useState('1');
  const [secondValueY, setSecondValueY] = useState('1');

  const [firstValErrorX, setFirstValErrorX] = useState(false);
  const [firstValErrorY, setFirstValErrorY] = useState(false);

  const [secValErrorX, setSecValErrorX] = useState(false);
  const [secValErrorY, setSecValErrorY] = useState(false);

  const [optionsValue, setOptionsValue] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [precision, setPrecision] = useState('');
  const [optionError, setOptionError] = useState(false);

  const [separateScale, setSeparateScale] = useState(false);

  const { handleScaleData, scaleData } = useContext(
    ScaleContext
  ) as ScaleDataContextProps;
  console.log(scaleLine, ' ===> scale line');

  const onChangeX = (e: RadioChangeEvent) => {
    if (e.target.value === 'custom') {
      setFirstValueX('1');
      setMeterX('in');
      setSecondValueX('1');
      setSecMeterX('in');
    } else {
      setPresetX(`1"=1"`);
    }

    setValueX(e.target.value);
  };
  const onChangeY = (e: RadioChangeEvent) => {
    if (e.target.value === 'custom') {
      setFirstValueY('1');
      setMeterY('in');
      setSecondValueY('1');
      setSecMeterY('in');
    } else {
      setPresetY(`1"=1"`);
    }

    setValueY(e.target.value);
  };

  const onChangeDrawX = (value: any) => {
    // if (e.target.value === 'custom') {
    setFirstValueX(`${value}`);
    setMeterX('in');
    setSecondValueX('1');
    setSecMeterX('in');
    // } else {
    //   setPresetX(`1"=1"`);
    // }

    setValueX('custom');
  };
  const onChangeDrawY = (value: any) => {
    // if (e.target.value === 'custom') {
    setFirstValueY(`${value}`);
    setMeterY('in');
    setSecondValueY('1');
    setSecMeterY('in');
    // } else {
    //   setPresetY(`1"=1"`);
    // }

    setValueY('custom');
  };
  useEffect(() => {
    if (scaleLine && scaleLine?.points) {
      console.log(' Cusotm useEffect run');
      const stringOfDistance = calcLineDistance(
        scaleLine?.points,
        {
          xScale: `1in=1in`,
          yScale: `1in=1in`,
          precision: '1',
        },
        true
      );
      const second = calcLineDistance(
        scaleLine?.points,
        {
          xScale: `1in=1in`,
          yScale: `1in=1in`,
          precision: '1',
        },
        false
      );
      const [feet, inch] = stringOfDistance.toString().split('-');
      console.log(
        stringOfDistance,
        Number(feet?.trim()?.replace(`'`, '')),
        Number(inch?.trim()?.replace(`"`, '')),
        ' ===> String of data'
      );
      const numfeet = Number(feet?.trim()?.replace(`'`, ''));
      const numInch = Number(inch?.trim()?.replace(`"`, ''));
      const valueToUse = numfeet * 12 + numInch;
      console.log(
        second,
        valueToUse,
        stringOfDistance,
        ' ====> Second draw distance '
      );
      onChangeDrawX(second ?? 1);
      onChangeDrawY(second ?? 1);
    }
  }, [scaleLine]);

  const handleAddPreset = async (
    firstValue: string,
    meter: string,
    secondValue: string,
    secMeter: string
  ) => {
    takeoffPresetService
      .httpAddNewPreset({
        label: `${firstValue}${meter}=${secondValue}${secMeter}`,
        value: `${firstValue}${meter}=${secondValue}${secMeter}`,
      })
      .then((res: any) => {
        if (res.statusCode == 201) {
          dispatch(addNewTakeoffPresetData(res.data));
        }
      });
  };

  useEffect(() => {
    dispatch(fetchTakeoffPreset({}));
    setPresetX(`1"=1"`);
    setPresetY(`1"=1"`);
    setPrecision('1');
    setOptionsValue(`1-${numOfPages}`);
  }, []);

  useEffect(() => {
    if (allPresets) {
      setMergedPresets([...allPresets, ...byDefaultPrest]);
    }
  }, [allPresets]);

  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const numbers = inputValue.split(/[,-]/);
    if (
      numbers.every(
        (number) =>
          number === '' ||
          (parseInt(number) >= 1 && parseInt(number) <= numOfPages)
      )
    ) {
      setOptionsValue(inputValue);
      setOptionError(false);
    } else {
      setOptionError(true);
    }
  };

  const handleCalibrate = () => {
    const newData: any = {};

    if (!separateScale) {
      let scale = '';
      if (valueX === 'preset') {
        scale = presetX;
      } else if (valueX === 'custom') {
        scale = `${firstValueX}${meterX}=${secondValueX}${secMeterX}`;
      }

      if (optionsValue?.includes('-')) {
        const range = optionsValue?.split('-').map(Number);
        const [start, end] = range;
        for (let i = start; i <= end; i++) {
          newData[i] = { xScale: scale, yScale: scale, precision: precision };
        }
      } else if (optionsValue?.includes(',')) {
        const numbers = optionsValue?.split(',').map(Number);
        numbers.forEach((num) => {
          newData[num] = { xScale: scale, yScale: scale, precision: precision };
        });
      } else if (!optionsValue?.includes(',') && !optionsValue?.includes('-')) {
        newData[optionsValue] = {
          xScale: scale,
          yScale: scale,
          precision: precision,
        };
      }
    } else {
      let scaleX = '';
      let scaleY = '';
      if (valueX === 'preset') {
        scaleX = presetX;
      } else if (valueX === 'custom') {
        scaleX = `${firstValueX}${meterX}=${secondValueX}${secMeterX}`;
      }
      if (valueY === 'preset') {
        scaleY = presetY;
      } else if (valueY === 'custom') {
        scaleY = `${firstValueY}${meterY}=${secondValueY}${secMeterY}`;
      }

      if (optionsValue?.includes('-')) {
        const range = optionsValue?.split('-').map(Number);
        const [start, end] = range;
        for (let i = start; i <= end; i++) {
          newData[i] = { xScale: scaleX, yScale: scaleY, precision: precision };
        }
      } else if (optionsValue?.includes(',')) {
        const numbers = optionsValue?.split(',').map(Number);
        numbers.forEach((num) => {
          newData[num] = {
            xScale: scaleX,
            yScale: scaleY,
            precision: precision,
          };
        });
      } else if (!optionsValue?.includes(',') && !optionsValue?.includes('-')) {
        newData[optionsValue] = {
          xScale: scaleX,
          yScale: scaleY,
          precision: precision,
        };
      }
    }

    handleScaleData({ ...scaleData, ...newData });
    setModalOpen(false);
  };

  return (
    <div className="py-2.5 px-6 bg-white border border-solid border-elboneyGray rounded-[4px] z-50">
      <section className="w-full">
        <div className="flex justify-between items-center border-b-Gainsboro ">
          <div>
            <QuaternaryHeading
              title="Scale"
              className="text-graphiteGray font-bold"
            />
            {/* <QuinaryHeading
              title="Select any existing client from here."
              className="text-coolGray"
            /> */}
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
        <div className="flex flex-col p-6 gap-6">
          <div className="flex gap-6 items-center w-full ">
            <label>Options:</label>
            <div className="flex items-center gap-1 w-full">
              <Input
                value={optionsValue}
                className={`w-full ${
                  optionError && '!border-1 !border-rose-500'
                }`}
                onChange={(e) => handleOptionChange(e)}
              />
              <div className="">
                {showOptions ? (
                  <Image
                    src={'/chevron-down.svg'}
                    alt={'alt'}
                    width={14}
                    height={14}
                    onClick={() => setShowOptions(!showOptions)}
                  />
                ) : (
                  <Image
                    src={'/chevron-up.svg'}
                    alt={'alt'}
                    width={14}
                    height={14}
                    onClick={() => setShowOptions(!showOptions)}
                  />
                )}
              </div>
            </div>
            {/* <Select className="w-full" /> */}
          </div>
          {showOptions && (
            <div className="w-[360px] absolute left-[148px] top-[124px] z-30 bg-white cursor-pointer shadow-sm border-2 flex flex-col p-2 gap-2">
              <div
                className="hover:bg-slate-200 hover:rounded-sm p-1"
                onClick={() => {
                  setShowOptions(!showOptions);
                  setOptionsValue(`${page ? page : '1'}`);
                }}
              >{`Current Page (${page ? page : 1}) `}</div>
              <div
                onClick={() => {
                  setShowOptions(!showOptions);
                  setOptionsValue(`1-${numOfPages}`);
                }}
                className="hover:bg-slate-200 hover:rounded-sm p-1"
              >
                {`All pages ( 1 - ${numOfPages} )`}
              </div>
            </div>
          )}

          <div className="flex gap-6 items-center justify-between ">
            <div className="flex flex-row gap-6">
              <label> {`${separateScale ? 'X Scale' : 'Scale'} `}</label>
              <Radio.Group onChange={onChangeX} value={valueX}>
                <Radio value={'preset'}>Present</Radio>
                <Radio value={'custom'}>Custom</Radio>
              </Radio.Group>
            </div>
            {valueX === 'custom' && (
              <div>
                <WhiteButton
                  className="!py-1.5"
                  text="Add to Preset"
                  onClick={() =>
                    handleAddPreset(
                      firstValueX,
                      meterX,
                      secondValueX,
                      secMeterX
                    )
                  }
                />
              </div>
            )}
          </div>
          <div className="flex gap-4 items-center justify-end">
            {valueX === 'preset' && (
              <Select
                className="w-full"
                value={presetX}
                onChange={(value) => {
                  setPresetX(value);
                }}
                options={mergedPresets}
              />
            )}
            {valueX === 'custom' && (
              <>
                <Input
                  value={firstValueX}
                  className={`!w-[115px] ${
                    firstValErrorX && '!border-1 !border-rose-500'
                  }`}
                  onChange={(e) => {
                    const inputValue = e.target.value;

                    const isValidInput = /^\d{0,8}(\.\d{0,2})?$/.test(
                      inputValue
                    );

                    if (!isValidInput) {
                      setFirstValErrorX(true);
                      return;
                    }

                    setFirstValErrorX(false);
                    setFirstValueX(inputValue);
                  }}
                />
                <Select
                  value={meterX}
                  className="w-[115px]"
                  onChange={(value) => setMeterX(value)}
                >
                  {meters.map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
                <Input
                  value={secondValueX}
                  className={`!w-[115px] ${
                    secValErrorX && '!border-1 !border-rose-500'
                  } `}
                  onChange={(e) => {
                    const inputValue = e.target.value;

                    if (inputValue.includes(' ')) {
                      setSecValErrorX(true);
                      return;
                    }

                    if (secMeterX !== `ft'in"` && inputValue.includes('-')) {
                      setSecValErrorX(true);
                      return;
                    }

                    if (inputValue.length > 8) {
                      setSecValErrorX(true);
                      return;
                    }

                    if (inputValue.length > 0 && !/^[1-9]/.test(inputValue)) {
                      setSecValErrorX(true);
                      return;
                    }

                    if (inputValue.includes('-') || inputValue.includes('/')) {
                      let parts;
                      if (inputValue.includes('-')) {
                        parts = inputValue.split('-');
                      } else if (inputValue.includes('/')) {
                        parts = inputValue.split('/');
                      }
                      if (
                        !parts ||
                        parts.length !== 2 ||
                        isNaN(Number(parts[0])) ||
                        isNaN(Number(parts[1])) ||
                        parts[1].length > 2
                      ) {
                        setSecValErrorX(true);
                        return;
                      }
                    }
                    setSecValErrorX(false);
                    setSecondValueX(inputValue);
                  }}
                />
                <Select
                  value={secMeterX}
                  className="w-[115px]"
                  onChange={(value) => {
                    setSecondValueX('');
                    setSecMeterX(value);
                  }}
                >
                  {measurementUnits.map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </>
            )}
          </div>

          {separateScale && (
            <>
              <div className="flex gap-6 items-center justify-between ">
                <div className="flex flex-row gap-6">
                  <label>Y Scale:</label>
                  <Radio.Group onChange={onChangeY} value={valueY}>
                    <Radio value={'preset'}>Present</Radio>
                    <Radio value={'custom'}>Custom</Radio>
                  </Radio.Group>
                </div>
                {valueY === 'custom' && (
                  <div>
                    <WhiteButton
                      className="!py-1.5"
                      text="Add to Preset"
                      onClick={() =>
                        handleAddPreset(
                          firstValueY,
                          meterY,
                          secondValueY,
                          secMeterY
                        )
                      }
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-4 items-center justify-end">
                {valueY === 'preset' && (
                  <Select
                    className="w-full"
                    value={presetY}
                    onChange={(value) => {
                      setPresetY(value);
                    }}
                    options={mergedPresets}
                  />
                )}
                {valueY === 'custom' && (
                  <>
                    <Input
                      value={firstValueY}
                      className={`!w-[115px] ${
                        firstValErrorY && '!border-1 !border-rose-500'
                      } `}
                      // className="!w-[115px]"
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        const isValidInput = /^\d{0,8}(\.\d{0,2})?$/.test(
                          inputValue
                        );

                        if (!isValidInput) {
                          setFirstValErrorY(true);
                          return;
                        }

                        setFirstValErrorY(false);
                        setFirstValueY(inputValue);
                      }}
                    />
                    <Select
                      value={meterY}
                      className="w-[115px]"
                      onChange={(value) => setMeterY(value)}
                    >
                      {meters.map((item) => (
                        <Select.Option key={item} value={item}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                    <Input
                      value={secondValueY}
                      className={`!w-[115px] ${
                        secValErrorY && '!border-1 !border-rose-500'
                      } `}
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        if (inputValue.includes(' ')) {
                          setSecValErrorY(true);
                          return;
                        }

                        if (
                          secMeterY !== `ft'in"` &&
                          inputValue.includes('-')
                        ) {
                          setSecValErrorY(true);
                          return;
                        }

                        if (inputValue.length > 8) {
                          setSecValErrorY(true);
                          return;
                        }

                        if (
                          inputValue.length > 0 &&
                          !/^[1-9]/.test(inputValue)
                        ) {
                          setSecValErrorY(true);
                          return;
                        }

                        if (
                          inputValue.includes('-') ||
                          inputValue.includes('/')
                        ) {
                          let parts;
                          if (inputValue.includes('-')) {
                            parts = inputValue.split('-');
                          } else if (inputValue.includes('/')) {
                            parts = inputValue.split('/');
                          }
                          if (
                            !parts ||
                            parts.length !== 2 ||
                            isNaN(Number(parts[0])) ||
                            isNaN(Number(parts[1])) ||
                            parts[1].length > 2
                          ) {
                            setSecValErrorY(true);
                            return;
                          }
                        }
                        setSecValErrorY(false);
                        setSecondValueY(inputValue);
                      }}
                    />
                    <Select
                      value={secMeterY}
                      className="w-[115px]"
                      onChange={(value) => {
                        setSecondValueY('');
                        setSecMeterY(value);
                      }}
                    >
                      {measurementUnits.map((item) => (
                        <Select.Option key={item} value={item}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </>
                )}
              </div>
            </>
          )}

          <div className="flex space-x-2">
            <div
              className="cursor-pointer"
              onClick={() => setSeparateScale((prev) => !prev)}
            >
              Separate Y Scale
            </div>
            <Checkbox onChange={(e) => setSeparateScale(e.target.checked)} />
          </div>

          <div className="flex gap-6 items-center">
            <label>Precision:</label>
            <Select
              value={precision}
              className="w-full"
              onChange={(value) => setPrecision(value)}
            >
              {secMeterX === `in'` || secMeterX === `ft'in"`
                ? byPrecision.map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))
                : precisions.map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
            </Select>
          </div>
        </div>
        <Button
          text="Scale from draw"
          onClick={() => {
            setModalOpen(false);
            setdrawScale(true);
          }}
          className="!py-1.5"
        />
      </section>
      <div className="flex justify-end gap-4 mt-5 mb-2">
        <div>
          <Button
            text="Cancel"
            className="!bg-snowWhite !text-abyssalBlack !py-1.5 "
            onClick={() => setModalOpen(false)}
          />
        </div>
        <div>
          <Button
            text="Calibrate"
            onClick={handleCalibrate}
            className="!py-1.5"
          />
        </div>
      </div>
    </div>
  );
};

export default ScaleModal;
