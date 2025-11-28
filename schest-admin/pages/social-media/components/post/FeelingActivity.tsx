import { Dispatch, useState } from 'react';

type Props = {
  setIsModalOpen: Dispatch<boolean>;
  setFeeling: Dispatch<string>;
};
const FeelingActivityFeature = ({ setIsModalOpen, setFeeling }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState('feeling');
  const [selectedFeeling, setSelectedFeeling] = useState('');
  const [customFeeling, setCustomFeeling] = useState('');

  const handleSubmit = () => {
    const feeling =
      selectedFeeling !== 'custom' ? selectedFeeling : customFeeling;
    setFeeling(feeling);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-semibold mb-4">Select Feeling or Activity</h2>
      <div className="flex justify-between mb-4 gap-3">
        <button
          onClick={() => setSelectedCategory('feeling')}
          className={`px-3 py-2 cursor-pointer rounded-md w-full ${
            selectedCategory === 'feeling'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Feeling
        </button>
        <button
          onClick={() => setSelectedCategory('watching')}
          className={`px-3 py-2 cursor-pointer rounded-md w-full ${
            selectedCategory === 'watching'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Watching
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {selectedCategory === 'feeling' && (
          <>
            <span
              onClick={() => setSelectedFeeling('😊 Happy')}
              className="cursor-pointer text-center p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
            >
              😊 Happy
            </span>
            <span
              onClick={() => setSelectedFeeling('😢 Sad')}
              className="cursor-pointer text-center p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
            >
              😢 Sad
            </span>
            <span
              onClick={() => setSelectedFeeling('😃 Excited')}
              className="cursor-pointer text-center p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
            >
              😃 Excited
            </span>
          </>
        )}
        {selectedCategory === 'watching' && (
          <div
            className="cursor-pointer text-center p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition w-full"
            onClick={() => setSelectedFeeling('🎬 Watching a Movie')}
          >
            🎬 Watching a Movie
          </div>
        )}
      </div>

      {selectedFeeling && (
        <div className="mt-4">
          <p className="text-gray-700">Feeling: {selectedFeeling}</p>
        </div>
      )}

      {selectedFeeling === 'custom' && (
        <input
          type="text"
          placeholder="Enter your feeling/activity"
          value={customFeeling}
          onChange={(e) => setCustomFeeling(e.target.value)}
          className="w-full p-2 mt-4 border border-gray-300 rounded-md"
        />
      )}

      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={() => {
            setIsModalOpen(false);
            setFeeling('');
          }}
          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 w-full text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default FeelingActivityFeature;
