import DashboardLayout from "@/app/dashboard/layout";
import SesionesVRList from "./components/SesionesVRList";
import SesionesVRForm from "./components/SesionesVRForm";

export default function SesionesVRPage() {
  return (
    
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-700">Sesiones VR</h1>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Formulario para crear sesión */}
          <div className="md:w-1/3">
            <SesionesVRForm />
          </div>

          {/* Tabla/listado de sesiones */}
          <div className="md:w-2/3">
            <SesionesVRList />
          </div>
        </div>
      </div>
    
  );
}
