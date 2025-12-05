// app/dashboard/retroalimentacion/RetroalimentacionRow.tsx
'use client';

interface Props {
  feedback: {
    id: string;
    usuario: string;
    modulo: string;
    calificacion: number;
    comentarios: string | null;
    creado_en: string;
  };
}

export default function RetroalimentacionRow({ feedback }: Props) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-2 font-medium text-gray-800">{feedback.usuario}</td>
      <td className="px-4 py-2">{feedback.modulo}</td>
      <td className="px-4 py-2">
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            feedback.calificacion >= 4
              ? 'bg-green-100 text-green-800'
              : feedback.calificacion === 3
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {feedback.calificacion}
        </span>
      </td>
      <td className="px-4 py-2">{feedback.comentarios || '—'}</td>
      <td className="px-4 py-2 text-gray-500">
        {new Date(feedback.creado_en).toLocaleString()}
      </td>
    </tr>
  );
}
