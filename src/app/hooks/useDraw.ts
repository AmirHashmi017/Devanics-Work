import { ScaleData } from '../(pages)/takeoff/scale/page';
import { DrawInterface } from '../(pages)/takeoff/types';

export const measurementUnits = [
  `ft'in"`,
  // "in'",
  'in',
  'km',
  'cm',
  'mm',
  'ft',
  'yd',
  'mi',
  'm',
];

export const unitConversion: { [conversion: string]: number } = {
  'in-in': 1,
  'in-cm': 2.54,
  'in-mm': 25.4,
  'ft-in': 12,
  [`ft'in"-in`]: 12,
  "in'-in": 1,
  'yd-in': 36,
  'mi-in': 63360,
  'mm-in': 0.0393701,
  'cm-in': 0.393701,
  'm-in': 39.3701,
  'km-in': 39370.1,
  '---': 0,
};

export const improperPrecisionConverter: { [key: string]: number } = {
  '1': 1,
  '1/2': 0.1,
  '1/4': 0.01,
  '1/8': 0.001,
  '1/16': 0.0001,
  '1/32': 0.000001,
  '0.1': 0.1,
  '0.01': 0.01,
  '0.001': 0.001,
  '0.0001': 0.0001,
  '0.00001': 0.00001,
};

const useDraw = () => {
  const pixelToInchScale = 144;

  const convertPxIntoInches = (value: number): number => {
    if (value > 0) {
      return value / pixelToInchScale;
    } else return value;
  };

  // const calculatePolygonArea1 = (
  //   coordinates: number[],
  //   { xScale, yScale }: ScaleData
  // ): number => {
  //   if (coordinates.length % 2 !== 0 || coordinates.length < 6) {
  //     throw new Error(
  //       'Invalid coordinates array length. It should contain at least 3 pairs of coordinates (x, y).'
  //     );
  //   }
  //   const convertedCoordinates = coordinates.map(
  //     (coordinate) => coordinate / pixelToInchScale
  //   );
  //   const xScaleMultiplier = getScaleMultiplier(xScale);
  //   const yScaleMultiplier = getScaleMultiplier(yScale);

  //   // Calculate the area using the shoelace formula
  //   let area = 0;
  //   const n = convertedCoordinates.length / 2;
  //   let j = n - 1;
  //   for (let i = 0; i < n; i++) {
  //     const xi = convertedCoordinates[i * 2] * xScaleMultiplier;
  //     const yi = convertedCoordinates[i * 2 + 1] * yScaleMultiplier;
  //     const xj = convertedCoordinates[j * 2] * xScaleMultiplier;
  //     const yj = convertedCoordinates[j * 2 + 1] * yScaleMultiplier;
  //     area += (xi + xj) * (yj - yi);
  //     j = i;
  //   }

  //   console.log(xScale, yScale, xScaleMultiplier, yScaleMultiplier, +Math.abs(area / 2).toFixed(2), " ===> Area Calculation values to log")
  //   return +Math.abs(area / 2).toFixed(2);
  // };

  const calculatePolygonArea = (
    coordinates: number[],
    { xScale, yScale }: ScaleData
  ): number => {
    if (coordinates.length % 2 !== 0 || coordinates.length < 6) {
      throw new Error(
        'Invalid coordinates array length. It should contain at least 3 pairs of coordinates (x, y).'
      );
    }
    const convertedCoordinates = coordinates.map(
      (coordinate) => coordinate / pixelToInchScale
    );
    const xScaleMultiplier = getScaleMultiplier(xScale);
    const yScaleMultiplier = getScaleMultiplier(yScale);

    // Calculate the area using the shoelace formula
    let area = 0;
    const n = convertedCoordinates.length / 2;
    let j = n - 1;
    for (let i = 0; i < n; i++) {
      const xi = convertedCoordinates[i * 2] * 1;
      const yi = convertedCoordinates[i * 2 + 1] * 1;
      const xj = convertedCoordinates[j * 2] * 1;
      const yj = convertedCoordinates[j * 2 + 1] * 1;
      area += (xi + xj) * (yj - yi);
      j = i;
    }

    area = +Math.abs(area / 2); //.toFixed(2);
    area = area / 144;
    console.log(
      xScale,
      yScale,
      xScaleMultiplier,
      yScaleMultiplier,
      +Math.abs(area / 2).toFixed(2),
      ' ===> Area Calculation values to log'
    );
    return area * (xScaleMultiplier * xScaleMultiplier);
  };

  // const calculatePolygonArea = (
  //   coordinates: number[],
  //   { xScale, yScale }: ScaleData
  // ): number => {
  //   if (coordinates.length % 2 !== 0 || coordinates.length < 6) {
  //     throw new Error(
  //       'Invalid coordinates array length. It should contain at least 3 pairs of coordinates (x, y).'
  //     );
  //   }
  //   const convertedCoordinates = coordinates.map(
  //     (coordinate) => coordinate / pixelToInchScale
  //   );
  //   const xScaleMultiplier = getScaleMultiplier(xScale);
  //   const yScaleMultiplier = getScaleMultiplier(yScale);

  //   // Function to calculate the area of a polygon using the Shoelace formula
  //   const calculatePolygonAreaInPixels = (points: number[]) => {
  //     let area = 0;
  //     const numPoints = points.length / 2;

  //     for (let i = 0; i < numPoints; i++) {
  //       const x1 = points[2 * i];
  //       const y1 = points[2 * i + 1];
  //       const x2 = points[2 * ((i + 1) % numPoints)];
  //       const y2 = points[2 * ((i + 1) % numPoints) + 1];
  //       area += x1 * y2 - y1 * x2;
  //     }

  //     return Math.abs(area) / 2;
  //   };

  //   // Calculate area in square pixels
  //   const areaInPixels = calculatePolygonAreaInPixels(coordinates);

  //   // Convert area from square pixels to square inches
  //   const areaInInches = areaInPixels / (pixelToInchScale * pixelToInchScale);

  //   // Convert area from square inches to square feet
  //   const areaInFeet = areaInInches / (xScaleMultiplier * xScaleMultiplier);
  //   console.log(areaInPixels, areaInInches, areaInFeet, xScaleMultiplier, pixelToInchScale," ===> Area Calculation values to log")

  //   return areaInInches;
  // };

  // const calculatePolygonArea = (
  //   coordinates: number[],
  //   { scale }: ScaleData
  // ): number => {
  //   if (coordinates.length < 6 || coordinates.length % 2 !== 0) {
  //     throw new Error('Invalid number of coordinates for a polygon');
  //   }

  //   const n = coordinates.length / 2;
  //   let area = 0;

  //   for (let i = 0; i < n - 1; i++) {
  //     area +=
  //       coordinates[2 * i] * coordinates[2 * i + 3] -
  //       coordinates[2 * i + 1] * coordinates[2 * i + 2];
  //   }

  //   area +=
  //     coordinates[2 * n - 2] * coordinates[1] -
  //     coordinates[0] * coordinates[2 * n - 1];

  //   area = Math.abs(area) / 2;

  //   const scaleMultiplier = getScaleMultiplier(scale);

  //   return +(
  //     (area / (pixelToInchScale * pixelToInchScale)) *
  //     scaleMultiplier
  //   ).toFixed(4);
  // };

  const calculatePolygonVolume = (
    coordinates: number[],
    depth: number,
    scale: ScaleData
  ): number => {
    const polygonArea = calculatePolygonArea(coordinates, scale);
    return +(polygonArea * depth).toFixed(4);
  };

  const calculatePolygonCenter = (
    coordinates: number[]
  ): { x: number; y: number } => {
    if (coordinates.length < 6 || coordinates.length % 2 !== 0) {
      throw new Error('Invalid number of coordinates for a polygon');
    }

    const n = coordinates.length / 2;

    const avgX =
      coordinates.reduce(
        (sum, val, index) => (index % 2 === 0 ? sum + val : sum),
        0
      ) / n;
    const avgY =
      coordinates.reduce(
        (sum, val, index) => (index % 2 === 1 ? sum + val : sum),
        0
      ) / n;

    const center = { x: avgX, y: avgY };
    return center;
  };

  // const calculatePolygonPerimeter = (
  //   coordinates: number[],
  //   precision: string
  // ): string => {
  //   if (coordinates.length < 6 || coordinates.length % 2 !== 0) {
  //     throw new Error('Invalid number of coordinates for a polygon');
  //   }
  //   const n = coordinates.length / 2;
  //   let perimeter = 0;

  //   // const [x1, y1, x2, y2, x3, y3] = coordinates;
  //   //  0 -> x2 - x1, -> 1 x3 - x2,
  //   for (let i = 0; i < n - 1; i++) {
  //     const deltaX = coordinates[2 * (i + 1)] - coordinates[2 * i];
  //     const deltaY = coordinates[2 * (i + 1) + 1] - coordinates[2 * i + 1];
  //     perimeter += Math.sqrt(deltaX ** 2 + deltaY ** 2);
  //   }

  //   // Add the distance from the last vertex to the first to close the loop
  //   const lastVertexX = coordinates[0];
  //   const lastVertexY = coordinates[1];
  //   const firstVertexX = coordinates[coordinates.length - 2];
  //   const firstVertexY = coordinates[coordinates.length - 1];

  //   perimeter += Math.sqrt(
  //     (lastVertexX - firstVertexX) ** 2 + (lastVertexY - firstVertexY) ** 2
  //   );

  //   const inches = convertPxIntoInches(perimeter);
  //   return convertToFeetAndInches(inches, precision);
  // };

  const calculatePolygonPerimeter = (
    coordinates: number[],
    scale: ScaleData
  ): string => {
    if (coordinates.length < 6 || coordinates.length % 2 !== 0) {
      throw new Error('Invalid number of coordinates for a polygon');
    }

    const uniqueCoordinates = coordinates.slice(0, coordinates.length - 2);

    let perimeter = 0;
    for (
      let index = 0;
      index < uniqueCoordinates.length - 1;
      index = index + 2
    ) {
      let lineCoordinates = [];
      if (uniqueCoordinates?.[index + 3]) {
        lineCoordinates = uniqueCoordinates.slice(index, index + 3 + 1);
      } else {
        lineCoordinates = [
          ...uniqueCoordinates.slice(0, 2),
          ...uniqueCoordinates.slice(index, index + 2),
        ];
      }

      const calculateLineDistance = calcLineDistance(
        lineCoordinates,
        scale
      ) as number;

      perimeter += calculateLineDistance;
    }
    return convertToFeetAndInches(perimeter, scale.precision);
  };

  const calcLineDistance = (
    coordinates: number[],
    { precision, xScale, yScale }: ScaleData,
    format = false
  ) => {
    const [x1, y1, x2, y2] = coordinates;
    const xScaleMultiplier = getScaleMultiplier(xScale);
    // const yScaleMultiplier = getScaleMultiplier(yScale);

    // const distance = Math.sqrt(
    //   Math.pow(convertPxIntoInches(x2 - x1) * xScaleMultiplier, 2) +
    //   Math.pow(convertPxIntoInches(y2 - y1) * yScaleMultiplier, 2)
    // );
    let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    distance = convertPxIntoInches(distance) * xScaleMultiplier;
    console.log(
      precision,
      coordinates,
      xScale,
      yScale,
      xScaleMultiplier,
      ' ===> Data of scale inside caluculate'
    );

    if (format) {
      return convertToFeetAndInches(distance, precision);
    }

    return distance;
  };
  const calcPerimeterDistance = (
    coordinates: number[],
    { precision, xScale, yScale }: ScaleData,
    format = false
  ) => {
    console.log(
      precision,
      coordinates,
      xScale,
      yScale,
      ' ===> Data of scale perimeter'
    );
    const [x1, y1, x2, y2] = coordinates;
    const xScaleMultiplier = getScaleMultiplier(xScale);
    const yScaleMultiplier = getScaleMultiplier(yScale);

    const distance = Math.sqrt(
      Math.pow(convertPxIntoInches(x2 - x1) * xScaleMultiplier, 2) +
        Math.pow(convertPxIntoInches(y2 - y1) * yScaleMultiplier, 2)
    );

    if (format) {
      return convertToFeetAndInches(distance, precision);
    }

    return distance;
  };

  const pointInCircle = (
    circleCenter: number[],
    radius: number,
    point: number[]
  ) => {
    const [x1, y1] = circleCenter;
    const [x2, y2] = point;

    const distanceSquared = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
    const radiusSquared = Math.pow(radius, 2);

    return distanceSquared <= radiusSquared;
  };

  // const calcLineDistance = (
  //   coordinates: number[],
  //   { scale, precision }: ScaleData,
  //   format = false
  // ) => {
  //   const [x1, y1, x2, y2] = coordinates;

  //   const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  //   if (format) {
  //     const inches = convertPxIntoInches(distance);
  //     const scaledInches = getScaleMultiplier(scale) * inches;
  //     return convertToFeetAndInches(scaledInches, precision);
  //   }

  //   return convertPxIntoInches(distance);
  // };

  const convertArrayIntoChunks = (data: number[]): number[][] => {
    return data.reduce((resultArray: any, item, index) => {
      const chunkIndex = Math.floor(index / 2);

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, []);
  };

  const calculateMidpoint = (coordinates: number[]) => {
    const [x1, y1, x2, y2] = coordinates;

    const midpoint = {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
    };

    return midpoint;
  };

  const calculateAngle = (coordinates: number[]) => {
    const [x1, y1, x2, y2] = coordinates;
    // Calculate the angle using arctangent (atan2)
    const angleRadians = Math.atan2(y2 - y1, x2 - x1);

    // Convert radians to degrees and ensure the angle is positive
    let angleDegrees = (angleRadians * 180) / Math.PI;

    if (angleDegrees >= -90 && angleDegrees <= 270) angleDegrees += 90;
    else angleDegrees = 270 + (180 + angleDegrees);

    return +angleDegrees.toFixed(2);
  };

  const getProjectAndCommentNameForTable = (
    key: keyof DrawInterface,
    points: number[],
    depth = 0,
    scale: ScaleData
  ): { projectName: string; comment: string | number } => {
    if (key === 'line')
      return {
        projectName: 'Length Measurement',
        comment: points?.length ? calcLineDistance(points, scale, true) : 0,
      };
    else if (key === 'area')
      return {
        projectName: 'Area Measurement',
        comment: points?.length ? calculatePolygonArea(points, scale) : 0,
      };
    else if (key === 'volume')
      return {
        projectName: 'Volume Measurement',
        comment: points?.length
          ? calculatePolygonVolume(points, depth, scale)
          : 0,
      };
    else if (key === 'count')
      return { projectName: 'Count Measurement', comment: '' };
    else if (key === 'perimeter')
      return {
        projectName: 'Perimeter Measurement',
        comment: points?.length ? calcLineDistance(points, scale, true) : 0,
      };
    else return { projectName: 'Dynamic Measurement', comment: '' };
  };

  const convertToFeetAndInches = (inches: number, precision: string) => {
    const convertedPrecision = improperPrecisionConverter[precision];
    const feet = Math.floor(inches / 12);
    const wholeInches = Math.floor(inches % 12);
    const chunksArray: number[] = [];

    const remainingInchesDecimal = +(inches - feet * 12 - wholeInches).toFixed(
      2
    );

    // Special use case when precision === 1
    // if (convertedPrecision === 1) {
    if (convertedPrecision) {
      if (remainingInchesDecimal > 0.5)
        return getFeetAndInchesFormat(feet, wholeInches + 1);
      else return getFeetAndInchesFormat(feet, wholeInches);
    }

    const decimalCount = convertedPrecision.toString().split('.')[1].length;

    const chunks = Math.pow(2, decimalCount);
    for (let index = 1; index < chunks + 1; index++) {
      chunksArray.push(index / chunks);
    }
    const closest = findClosestValue(chunksArray, remainingInchesDecimal);

    if (closest === 1) return getFeetAndInchesFormat(feet, wholeInches + 1);
    else {
      const len = closest.toString().length - 2;
      let denominator = Math.pow(10, len);
      let numerator = closest * denominator;

      const divisor = gcd(numerator, denominator);

      numerator /= divisor;
      denominator /= divisor;

      return getFeetAndInchesFormat(
        feet,
        wholeInches,
        `${numerator}/${denominator}`
      );
    }
  };

  const findClosestValue = (array: number[], target: number) => {
    // If the array is empty, return undefined
    if (array.length === 0) return target;

    // Initialize variables to keep track of the closest value and its difference
    let closest = array[0];
    let minDifference = Math.abs(target - closest);

    // Iterate through the array to find the closest value
    for (let i = 1; i < array.length; i++) {
      const difference = Math.abs(target - array[i]);
      // If the current value is closer than the previous closest, update the closest value and the difference
      if (difference < minDifference) {
        closest = array[i];
        minDifference = difference;
      }
    }

    return closest;
  };

  const gcd = (a: number, b: number): number => {
    if (b < 0.0000001) return a; // Since there is a limited precision we need to limit the value.
    return gcd(b, Math.floor(a % b)); // Discard any fractions due to limitations in precision.
  };

  const getFeetAndInchesFormat = (
    feet: number,
    inches: number,
    fractionalString?: string
  ) => {
    let inchesString = inches > 0 ? `${inches}` : '0';
    if (+inchesString === 12) {
      inchesString = '0';
      feet = feet + 1;
    }
    if (fractionalString) {
      if (inchesString === '0') return `${feet}'- ${fractionalString}"`;
      else return `${feet}'- ${inchesString} ${fractionalString}"`;
    } else return `${feet}'- ${inchesString}"`;
  };
  const getScaleMultiplier = (scale: string): number => {
    // HANDLING PRESET SCALE BELOW
    if (scale.includes(':')) {
      const multiplier = +scale.split(':')[1];
      return multiplier;
    } else if (
      scale.includes('=') &&
      !measurementUnits.some((unit) => scale.includes(unit))
    ) {
      const splittedScale = scale.split('=');

      if (scale.includes(`1'-0"`)) {
        const [numerator, denominator] = getInchesInFractionFromMixedFraction(
          splittedScale[0].substring(0, splittedScale[0].length - 1)
        ).split('/');

        return (12 * +denominator) / +numerator;
      } else {
        if (splittedScale[1].includes(`"`)) return 1;
        const multiplier = +splittedScale[1].substring(
          0,
          splittedScale[1].length - 1
        );
        return multiplier * 12;
      }
    } else {
      // HANDLING CUSTOM SCALE BELOW
      console.log('CUSTOM HANDLING');

      // Left Hand Side, Right Hand Side
      const [LHS, RHS] = scale.split('=');

      const LUnit =
        measurementUnits.find((unit) => LHS.indexOf(unit) >= 0) || '-';

      const LHSValues = LHS.substring(0, LHS.indexOf(LUnit));

      // Left Numerator(LN), Left Denominator (LD)
      const [LN, LD] = LHSValues.includes('/')
        ? LHSValues.split('/')
        : [+LHSValues, 1];

      const RUnit =
        measurementUnits.find((unit) => RHS.indexOf(unit) >= 0) || '-';

      const RHSValues = RHS.substring(0, RHS.indexOf(RUnit));

      //Right Numerator (RN), Right Denominator (RD)
      const [RN, RD] = RHSValues.includes('/')
        ? RHSValues.split('/')
        : [+RHSValues, 1];

      if (RUnit == `ft'in"`) {
        const multiplier =
          ((+ftinmul(RHSValues).total / 12) *
            +LD *
            unitConversion[`in-${LUnit}`] *
            unitConversion[`${RUnit}-in`]) /
          (+LN * +RD);
        console.log(
          LN,
          LD,
          scale,
          RD,
          RN,
          `in-${LUnit}`,
          `${RUnit}-in`,
          unitConversion[`in-${LUnit}`],
          unitConversion[`${RUnit}-in`],
          RHS,
          RUnit,
          LUnit,
          RHSValues,
          ftinmul(RHSValues),
          multiplier,
          RN,
          ' ===> inside my logic spllited scale'
        );

        return multiplier;
      }

      const multiplier =
        (+RN *
          +LD *
          unitConversion[`in-${LUnit}`] *
          unitConversion[`${RUnit}-in`]) /
        (+LN * +RD);
      console.log(
        LN,
        LD,
        scale,
        RD,
        RN,
        `in-${LUnit}`,
        `${RUnit}-in`,
        unitConversion[`in-${LUnit}`],
        unitConversion[`${RUnit}-in`],
        RHS,
        RUnit,
        LUnit,
        RHSValues,
        multiplier,
        RN,
        ' ===> inside my logic spllited scale'
      );

      return multiplier;
    }
  };
  const ftinmul = (value: string) => {
    const [feet, inch] = value.split(`'`);
    let newinc = inch.split(`"`)[0];
    let ft = feet ? Number(feet) * 12 : 0;
    let total = Number(ft) + (Number(newinc) ? Number(newinc) : 0);
    return { feet, inch, ft, total };
  };

  const getInchesInFractionFromMixedFraction = (value = `1 1/2"`) => {
    const isFraction = value.split('/').length > 1;
    if (!isFraction) return `${value}/1`;

    const isMixedFraction = value.split(' ');
    if (isMixedFraction.length > 1) {
      const [coefficient, fraction] = isMixedFraction;
      const [numerator, denominator] = fraction.includes(`"`)
        ? fraction.substring(0, fraction.length - 1).split('/')
        : fraction.split('/');

      return `${+numerator + +coefficient * +denominator}/${denominator}`;
    } else
      return value.includes(`"`) ? value.substring(0, value.length - 1) : value;
  };

  const groupDataForTable = (input: any[]) => {
    const groupedData = input.reduce((result: any, currentItem: any) => {
      const {
        projectName,
        pageLabel,
        comment,
        author,
        date,
        status,
        color,
        layer,
        space,
        type,
        category,
      } = currentItem;

      // Check if there's already an entry with the same projectName and pageLabel
      const existingEntry = result.find(
        (entry: any) =>
          // entry.projectName === projectName && entry.pageLabel === pageLabel
          entry.category === category && entry.pageLabel === pageLabel
      );

      if (existingEntry) {
        existingEntry.children.push({
          projectName,
          pageLabel,
          comment,
          author,
          date,
          status,
          color,
          layer,
          space,
          type,
          category,
        });
      } else {
        result.push({
          key: result.length + 1, // Assuming keys start from 1
          projectName,
          category,
          pageLabel,
          children: [
            {
              projectName,
              pageLabel,
              comment,
              author,
              date,
              status,
              color,
              layer,
              space,
              type,
              category,
            },
          ],
        });
      }

      return result;
    }, []);

    return groupedData;
  };

  const roundDecimals = (number: number, precision: string): string => {
    let precisionValue = parseFloat(precision); // Convert string to a number
    if (isNaN(precisionValue) || precisionValue <= 0) {
      precisionValue = 0.001; // Default precision if invalid
    }

    const factor = 1 / precisionValue; // Calculate the scaling factor
    const roundedValue = Math.round(number * factor) / factor; // Scale, round, and scale back

    // Format the result to match the precision string
    const precisionDecimals = precision.split('.')[1]?.length || 0; // Count decimal places in precision
    const formattedValue = roundedValue.toFixed(precisionDecimals); // Ensure proper decimal places

    console.log(
      number,
      precision,
      precisionValue,
      factor,
      roundedValue,
      formattedValue,
      ' ===> roundDecimals function logs here'
    );
    return formattedValue; // Return the formatted value as a string
  };

  return {
    calculatePolygonArea,
    calculatePolygonCenter,
    calculatePolygonPerimeter,
    calcLineDistance,
    calcPerimeterDistance,
    convertArrayIntoChunks,
    calculateMidpoint,
    calculatePolygonVolume,
    calculateAngle,
    getProjectAndCommentNameForTable,
    getInchesInFractionFromMixedFraction,
    groupDataForTable,
    pointInCircle,
    getScaleMultiplier,
    convertToFeetAndInches,
    roundDecimals,
  };
};

export default useDraw;
