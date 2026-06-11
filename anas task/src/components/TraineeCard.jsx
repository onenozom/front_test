import { memo, useEffect, useMemo, useRef } from 'react';

function TraineeCard({ camera }) {
  const repRef = useRef(null);
  const videoRef = useRef(null);

  const statusStyles = useMemo(() => {
    if (camera.status === 'perfect') {
      return {
        border: 'border-emerald-400/80',
        badge: 'bg-emerald-500/15 text-emerald-300',
        statusLabel: 'Perfect form'
      };
    }

    return {
      border: 'border-rose-500/80',
      badge: 'bg-rose-500/15 text-rose-300',
      statusLabel: 'Form issue'
    };
  }, [camera.status]);

  useEffect(() => {
    if (repRef.current) {
      repRef.current.textContent = camera.repCount;
    }
  }, [camera.repCount]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.poster = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80';
  }, []);

  return (
    <article className={`rounded-[28px] border-4 ${statusStyles.border} bg-slate-950/95 p-4 shadow-panel transition-all duration-300`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Camera</p>
          <h2 className="mt-2 text-lg font-semibold text-white">{camera.label}</h2>
          <p className="text-sm text-slate-500">ID {camera.id}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles.badge}`}>{statusStyles.statusLabel}</span>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-inner">
        <video
          ref={videoRef}
          className="h-48 w-full bg-slate-950 object-cover"
          muted
          playsInline
          autoPlay
          loop
          aria-label={`Live stream for ${camera.label}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
        <div className="absolute bottom-3 left-3 rounded-2xl bg-slate-950/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
          Live feed
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/90 px-5 py-6 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Rep count</p>
        <p ref={repRef} className="mt-3 text-5xl font-semibold text-white">{camera.repCount}</p>
      </div>
    </article>
  );
}

function areEqual(prevProps, nextProps) {
  return (
    prevProps.camera.id === nextProps.camera.id &&
    prevProps.camera.label === nextProps.camera.label &&
    prevProps.camera.repCount === nextProps.camera.repCount &&
    prevProps.camera.status === nextProps.camera.status
  );
}

export default memo(TraineeCard, areEqual);
