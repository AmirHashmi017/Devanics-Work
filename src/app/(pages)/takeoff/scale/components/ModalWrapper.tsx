import React from 'react';
import Length from './LengthModal';
import Volume from './VolumeModal';
import Count from './CountModal';
import Area from './AreaModal';
import Dynamic from './DynamicModal';
import { Measurements, ScaleInterface } from '../../types';

interface Props {
  tool: ScaleInterface;
  setTool: (payload: ScaleInterface) => void;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  measurements: Measurements;
}

const ModalsWrapper: React.FC<Props> = ({
  tool,
  setTool,
  setModalOpen,
  measurements,
}) => {
  const { selected } = tool;
  return (
    <div>
      <div>
        {selected === 'length' && (
          <Length measurements={measurements} setModalOpen={setModalOpen} />
        )}
      </div>
      <div>
        {selected === 'volume' && (
          <Volume measurements={measurements} setModalOpen={setModalOpen} />
        )}
      </div>
      <div>
        {selected === 'count' && (
          <Count measurements={measurements} setModalOpen={setModalOpen} />
        )}
      </div>
      <div>
        {selected === 'area' && (
          <Area measurements={measurements} setModalOpen={setModalOpen} />
        )}
      </div>
      <div>
        {selected === 'dynamic' && (
          <Dynamic setModalOpen={setModalOpen} setTool={setTool} />
        )}
      </div>
    </div>
  );
};

export default ModalsWrapper;
