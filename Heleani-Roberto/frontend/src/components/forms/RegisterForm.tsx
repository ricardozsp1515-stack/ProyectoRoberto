import RegisterInput from "./RegisterInput";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { register, login } from "../../services/authService";


export default function RegisterForm() {

  const navigate = useNavigate();


  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [error,setError] = useState("");



  const handleSubmit = async(
    e: React.SubmitEvent<HTMLFormElement>
  )=>{

    e.preventDefault();


    try{

      await register({

        name,
        email,
        password

      });

      // El backend solo devuelve {message, token} al registrar, sin los
  // datos del usuario. Hacemos login automatico justo despues para
  // obtener tambien el objeto "user" y guardarlo en localStorage.
  await login(email, password);


      navigate("/profile");


    }catch(error:any){

      setError(error.message);

    }

  };



  return (
    <main className="px-10 pt-28">

      <h1 className="text-center text-5xl font-bold text-gray-700">
        ¡Bienvenido!
      </h1>


      <p className="text-center text-gray-600 mt-10">

        ¿Ya tiene una cuenta? Inicie sesión{" "}

        <Link
          to="/login"
          className="text-green-800! font-semibold underline"
        >
          aquí.
        </Link>

      </p>



      <form
        onSubmit={handleSubmit}
        className="mt-10 flex flex-col gap-4"
      >


        <RegisterInput

          placeholder="Nombre completo..."

          value={name}

          onChange={(e)=>
            setName(e.target.value)
          }

        />



        <RegisterInput

          type="email"

          placeholder="Correo electrónico..."

          value={email}

          onChange={(e)=>
            setEmail(e.target.value)
          }

        />



        <RegisterInput

          type="password"

          placeholder="Contraseña..."

          value={password}

          onChange={(e)=>
            setPassword(e.target.value)
          }

        />



        {
          error && (

            <p className="text-red-600">
              {error}
            </p>

          )
        }



        <label className="flex items-center gap-3 mt-2">

          <input
            type="checkbox"
            className="checkbox checkbox-success checkbox-sm rounded-none"
          />

          <span className="text-sm text-gray-700">

            Estoy de acuerdo con los{" "}

            <Link
              to="/terms"
              className="text-green-800! font-semibold underline"
            >
              Términos y Condiciones.
            </Link>

          </span>

        </label>



        <button

          type="submit"

          className="
            btn
            bg-green-800
            hover:bg-green-900
            border-none
            text-white
            mt-6
            rounded-xl
          "

        >

          Registrarme

        </button>


      </form>

    </main>
  );
}