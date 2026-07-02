import AuthenticatedLayout from "../components/layout/AuthLayout";
import UserCard from "../components/cards/UserCard";
import PetGallery from "../components/cards/PetGallery";
import AddPetButton from "../components/buttons/AddPetButton";

export default function Profile() {
  return (
    <AuthenticatedLayout>
      <main className="p-8 flex flex-col gap-10 pb-20">
        <UserCard />

        <PetGallery />

        <AddPetButton />
      </main>
    </AuthenticatedLayout>
  );
}