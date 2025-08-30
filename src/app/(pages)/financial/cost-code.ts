// add id to each object
import data from './data.json';

const costCodeDataWithId = data.map((item, index) => ({
  ...item,
  id: index + 1,
}));

export default costCodeDataWithId;
