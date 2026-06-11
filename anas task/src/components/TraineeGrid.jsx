import { useMemo } from 'react';
import TraineeCard from './TraineeCard';

function gridColumnsClass(count) {
  if (count <= 1) return 'grid-cols-1';
  if (count <= 4) return 'grid-cols-1 sm:grid-cols-2';
  if (count <= 6) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  if (count <= 9) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5';
}

function TraineeGrid({ cameras }) {
  const columns = useMemo(() => gridColumnsClass(cameras.length), [cameras.length]);

  return (
    <section className={`grid ${columns} gap-4`}> 
      {cameras.map((camera) => (
        <TraineeCard key={camera.id} camera={camera} />
      ))}
    </section>
  );
}

export default TraineeGrid;
