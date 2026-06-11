import { useCallback, useEffect, useMemo, useState } from 'react';
import TraineeGrid from './components/TraineeGrid';

const TEST_TYPES = ['Push-ups', 'Sit-ups', 'Pull-ups'];

function createMockCamera(id) {
  return {
    id: String(id),
    label: `Trainee ${id}`,
    repCount: 0,
    status: id % 4 === 0 ? 'error' : 'perfect'
  };
}

function generateMockCameras(count) {
  const cameraMap = new Map();
  for (let i = 1; i <= count; i += 1) {
    cameraMap.set(String(i), createMockCamera(i));
  }
  return cameraMap;
}

function App() {
  const [selectedTest, setSelectedTest] = useState('');
  const [timer, setTimer] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [cameraMap, setCameraMap] = useState(new Map());

  const cameraList = useMemo(() => Array.from(cameraMap.values()), [cameraMap]);

  const handleSelectTest = useCallback((testType) => {
    setSelectedTest(testType);
  }, []);

  const startTest = useCallback(() => {
    if (!selectedTest) return;
    setIsRunning(true);
    setTimer(120);
    const activeCount = Math.min(10, 3 + Math.floor(Math.random() * 7));
    setCameraMap(generateMockCameras(activeCount));
  }, [selectedTest]);

  const resetTest = useCallback(() => {
    setIsRunning(false);
    setSelectedTest('');
    setCameraMap(new Map());
    setTimer(120);
  }, []);

  useEffect(() => {
    if (!isRunning) return undefined;
    const countdown = setInterval(() => {
      setTimer((value) => {
        if (value <= 1) {
          clearInterval(countdown);
          setIsRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || cameraMap.size === 0) return undefined;

    const updateInterval = setInterval(() => {
      setCameraMap((previousMap) => {
        const cameraIds = Array.from(previousMap.keys());
        if (cameraIds.length === 0) return previousMap;

        const randomId = cameraIds[Math.floor(Math.random() * cameraIds.length)];
        const previousCamera = previousMap.get(randomId);

        if (!previousCamera) return previousMap;

        const nextStatus = Math.random() > 0.82 ? 'error' : 'perfect';
        const nextCount = previousCamera.repCount + Math.floor(Math.random() * 2);

        if (nextCount === previousCamera.repCount && nextStatus === previousCamera.status) {
          return previousMap;
        }

        const nextMap = new Map(previousMap);
        nextMap.set(randomId, {
          ...previousCamera,
          repCount: nextCount,
          status: nextStatus
        });
        return nextMap;
      });
    }, 850);

    return () => clearInterval(updateInterval);
  }, [isRunning, cameraMap.size]);

  useEffect(() => {
    const socketMock = setInterval(() => {
      console.debug('Mock WebSocket heartbeat: watching active cameras');
    }, 15000);

    return () => clearInterval(socketMock);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-slate-800 bg-slate-900/95 p-6 shadow-panel backdrop-blur-lg">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Remote Proctor Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Live Fitness Exam Monitoring</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Select a test type, start the 2-minute live session, and monitor all active camera feeds with isolated performance updates.</p>
          </div>

          <div className="grid gap-3 sm:place-items-end">
            <div className="flex flex-wrap gap-2">
              {TEST_TYPES.map((testType) => (
                <button
                  key={testType}
                  type="button"
                  onClick={() => handleSelectTest(testType)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedTest === testType ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300' : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'}`}
                >
                  {testType}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-3xl bg-slate-800/90 px-4 py-2 text-sm font-semibold text-slate-100">
                {isRunning ? `Live • ${timer}s remaining` : 'Idle'}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={startTest}
                  disabled={!selectedTest || isRunning}
                  className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={resetTest}
                  disabled={!isRunning && !selectedTest}
                  className="rounded-full border border-slate-700 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </header>

        <main>
          {isRunning ? (
            <TraineeGrid cameras={cameraList} />
          ) : (
            <div className="rounded-[28px] border border-slate-800 bg-slate-950/70 p-12 text-center text-slate-400 shadow-xl">
              <p className="text-lg font-medium text-slate-100">Choose a test and press Start to launch the live camera grid.</p>
              <p className="mt-3 text-sm leading-6">The dashboard will render an adaptive layout for up to 10 camera streams and update rep counters in real time without forcing full-app rerenders.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
