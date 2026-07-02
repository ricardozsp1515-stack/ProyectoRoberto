//import Navbar from "./Navbar"

export default function Daisy_test() {
  return (
    <div
      data-theme="light"
      className="min-h-screen bg-base-100 flex items-center justify-center"
    >
      <div className="p-6 flex flex-col gap-10">
        {/* Navbar */}
        <div className="navbar bg-base-200">
          <div className="flex-1">
            <a href="#" className="btn btn-ghost normal-case text-xl">
              Navbar
            </a>
          </div>
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Botones */}
        <div className="flex gap-2">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-accent">Accent</button>
          <button className="btn btn-info">Info</button>
          <button className="btn btn-success">Success</button>
          <button className="btn btn-warning">Warning</button>
          <button className="btn btn-error">Error</button>
        </div>
        {/* Card */}
        <div className="card w-96 bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Card</h2>
            <p>Este es un ejemplo de card.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Acción</button>
            </div>
          </div>
        </div>
        {/* Alertas */}
        <div className="flex flex-col gap-2">
          <div className="alert alert-info">
            <span>Info alert</span>
          </div>
          <div className="alert alert-success">
            <span>Success alert</span>
          </div>
          <div className="alert alert-warning">
            <span>Warning alert</span>
          </div>
          <div className="alert alert-error">
            <span>Error alert</span>
          </div>
        </div>
        {/* Badge */}
        <div className="flex gap-2">
          <span className="badge badge-primary">Primary</span>
          <span className="badge badge-secondary">Secondary</span>
          <span className="badge badge-accent">Accent</span>
        </div>
        {/* Input + Form */}
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Correo electrónico</span>
          </label>
          <input
            type="text"
            placeholder="ejemplo@correo.com"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        {/* Checkbox y Radio */}
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer label">
            <span className="label-text">Aceptar términos</span>
            <input type="checkbox" className="checkbox checkbox-primary" />
          </label>
          <div className="flex gap-4">
            <label className="label cursor-pointer">
              <span className="label-text">Opción A</span>
              <input
                type="radio"
                name="radio-1"
                className="radio checked:bg-blue-500"
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">Opción B</span>
              <input
                type="radio"
                name="radio-1"
                className="radio checked:bg-red-500"
              />
            </label>
          </div>
        </div>
        {/* Modal (ejemplo básico) */}
        <button
          className="btn"
          onClick={() =>
            (
              document.getElementById("my_modal") as HTMLDialogElement
            )?.showModal()
          }
        >
          Abrir Modal
        </button>
        <dialog id="my_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">¡Hola!</h3>
            <p className="py-4">Este es un modal de DaisyUI.</p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Cerrar</button>
              </form>
            </div>
          </div>
        </dialog>
        {/* Tabs */}
        <div className="tabs">
          <a className="tab tab-bordered">Tab 1</a>
          <a className="tab tab-bordered tab-active">Tab 2</a>
          <a className="tab tab-bordered">Tab 3</a>
        </div>
        {/* Menu */}
        <ul className="menu bg-base-200 w-56 rounded-box">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
        {/* Drawer */}
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer" className="btn btn-primary">
              Abrir Drawer
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 bg-base-200">
              <li>
                <a>Sidebar Item 1</a>
              </li>
              <li>
                <a>Sidebar Item 2</a>
              </li>
            </ul>
          </div>
        </div>
        {/* Collapse */}
        <div className="collapse bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            Click para expandir
          </div>
          <div className="collapse-content">
            <p>Contenido oculto</p>
          </div>
        </div>
        {/* Toast */}
        <div className="toast toast-top toast-end">
          <div className="alert alert-info">
            <span>Toast info</span>
          </div>
        </div>
        {/* Hero */} {/* min-h-[200px] */}
        <div className="hero min-h-50 bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hero</h1>
              <p className="py-6">Ejemplo de hero section.</p>
              <button className="btn btn-primary">Empezar</button>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="footer p-10 bg-base-200 text-base-content">
          <div>
            <span className="footer-title">Servicios</span>
            <a className="link link-hover">Branding</a>
            <a className="link link-hover">Diseño</a>
          </div>
          <div>
            <span className="footer-title">Empresa</span>
            <a className="link link-hover">Acerca de</a>
            <a className="link link-hover">Contacto</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
