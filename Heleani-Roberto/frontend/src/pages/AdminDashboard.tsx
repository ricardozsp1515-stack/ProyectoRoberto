import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import RequestCard from "../components/cards/RequestCard";
import { getProfile } from "../services/userServices";
import {
  getPendingVetRequests,
  approveVetRequest,
  rejectVetRequest,
} from "../services/vetService";
import {
  getPendingCenterRequests,
  approveCenterRequest,
  rejectCenterRequest,
} from "../services/centerService";

interface VetRequest {
  id: string;
  user_name: string;
  user_email: string;
  license: string;
  specialty: string;
}

interface CenterRequest {
  id: string;
  user_name: string;
  user_email: string;
  name: string;
  address: string;
  contact: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  // null = todavia no sabemos el rol, true/false = ya lo confirmamos
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [vetRequests, setVetRequests] = useState<VetRequest[]>([]);
  const [centerRequests, setCenterRequests] = useState<CenterRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargamos las solicitudes pendientes de vet/clinica
  const loadRequests = () => {
    getPendingVetRequests().then((data) => setVetRequests(data));
    getPendingCenterRequests().then((data) => setCenterRequests(data));
  };

  // Verificamos el rol del usuario logueado antes de mostrar nada. Esto es
  // solo proteccion de UX: la seguridad real la da authorize_role(["admin"])
  // en el backend, asi que aunque alguien se salte esto no logra nada.
  useEffect(() => {
    getProfile()
      .then((profile) => {
        if (profile.role_name !== "admin") {
          navigate("/profile");
          return;
        }

        setIsAdmin(true);
        loadRequests();
        setLoading(false);
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  if (isAdmin === null || loading) {
    return (
      <AuthLayout>
        <main className="p-8">
          <p className="text-center text-gray-600">Cargando...</p>
        </main>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <main className="p-8 pb-24 flex flex-col gap-10">
        <h1 className="text-center text-3xl font-bold text-gray-700">
          Panel de administración
        </h1>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-700">
            Solicitudes de veterinario
          </h2>

          {vetRequests.length === 0 && (
            <p className="text-gray-500">No hay solicitudes pendientes.</p>
          )}

          {vetRequests.map((req) => (
            <RequestCard
              key={req.id}
              title={req.user_name}
              subtitle={req.user_email}
              details={[
                { label: "Colegiado", value: req.license },
                { label: "Especialidad", value: req.specialty },
              ]}
              onApprove={async (message) => {
                await approveVetRequest(req.id, message);
                loadRequests();
              }}
              onReject={async (message) => {
                await rejectVetRequest(req.id, message);
                loadRequests();
              }}
            />
          ))}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-700">
            Solicitudes de clínica
          </h2>

          {centerRequests.length === 0 && (
            <p className="text-gray-500">No hay solicitudes pendientes.</p>
          )}

          {centerRequests.map((req) => (
            <RequestCard
              key={req.id}
              title={req.name}
              subtitle={`Solicitado por ${req.user_name} (${req.user_email})`}
              details={[
                { label: "Dirección", value: req.address },
                { label: "Contacto", value: req.contact },
              ]}
              onApprove={async (message) => {
                await approveCenterRequest(req.id, message);
                loadRequests();
              }}
              onReject={async (message) => {
                await rejectCenterRequest(req.id, message);
                loadRequests();
              }}
            />
          ))}
        </section>
      </main>
    </AuthLayout>
  );
}