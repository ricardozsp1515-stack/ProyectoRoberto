import AuthenticatedLayout from "../components/layout/AuthLayout";
import AddPetForm from "../components/forms/AddPetForm";

export default function AddPet() {
  return (
    <AuthenticatedLayout>
      <AddPetForm />
    </AuthenticatedLayout>
  );
}