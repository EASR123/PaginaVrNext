import sql from '@/app/lib/db';

// === Usuarios ===
export async function fetchUsersCount() {
  try {
    const result = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM public.usuarios
    `;
    return result[0]?.count ?? 0;
  } catch (err) {
    console.error('Error fetchUsersCount:', err);
    return 0;
  }
}

// === Sesiones VR ===
export async function fetchVRStats() {
  try {
    const result = await sql<{
      total_sessions: number;
      avg_duration: number;
      avg_errors: number;
    }[]>`
      SELECT 
        COUNT(*)::int AS total_sessions,
        COALESCE(AVG(tiempo_total_s),0)::int AS avg_duration,
        COALESCE(AVG(errores_totales),0)::int AS avg_errors
      FROM public.sesiones_vr
    `;
    return result[0];
  } catch (err) {
    console.error('Error fetchVRStats:', err);
    return { total_sessions: 0, avg_duration: 0, avg_errors: 0 };
  }
}

// === Retroalimentación ===
export async function fetchFeedbackStats() {
  try {
    const result = await sql<{
      total_feedbacks: number;
      avg_score: number;
    }[]>`
      SELECT 
        COUNT(*)::int AS total_feedbacks,
        COALESCE(AVG(calificacion),0)::numeric(10,2) AS avg_score
      FROM public.retroalimentacion
    `;
    return result[0];
  } catch (err) {
    console.error('Error fetchFeedbackStats:', err);
    return { total_feedbacks: 0, avg_score: 0 };
  }
}

// === Consolidado para el dashboard ===
export async function fetchCardData() {
  try {
    const [usersCount, vrStats, fbStats] = await Promise.all([
      fetchUsersCount(),
      fetchVRStats(),
      fetchFeedbackStats(),
    ]);

    return {
      usersCount,
      totalSessions: vrStats.total_sessions,
      avgSessionDuration: vrStats.avg_duration,
      avgSessionErrors: vrStats.avg_errors,
      totalFeedbacks: fbStats.total_feedbacks,
      avgFeedbackScore: fbStats.avg_score,
    };
  } catch (error) {
    console.error('Error fetchCardData:', error);
    return {
      usersCount: 0,
      totalSessions: 0,
      avgSessionDuration: 0,
      avgSessionErrors: 0,
      totalFeedbacks: 0,
      avgFeedbackScore: 0,
    };
  }
}
