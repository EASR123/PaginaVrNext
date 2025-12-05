import {
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  users: UserGroupIcon,
  sessions: ClockIcon,
  errors: ChartBarIcon,
  feedback: AcademicCapIcon,
};

export default async function CardWrapper() {
  const {
    usersCount,
    totalSessions,
    avgSessionDuration,
    avgSessionErrors,
    totalFeedbacks,
    avgFeedbackScore,
  } = await fetchCardData();

  return (
    <>
      <Card title="Usuarios Registrados" value={usersCount} type="users" />
      <Card title="Sesiones VR" value={totalSessions} type="sessions" />
      <Card title="Duración Promedio (s)" value={avgSessionDuration} type="sessions" />
      <Card title="Errores Promedio" value={avgSessionErrors} type="errors" />
      <Card title="Retroalimentaciones" value={totalFeedbacks} type="feedback" />
      <Card title="Puntuación Promedio" value={avgFeedbackScore} type="feedback" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'users' | 'sessions' | 'errors' | 'feedback';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
