import {
  Link,
  createMemoryRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom';
import { useContext, useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
import 'tailwindcss/tailwind.css';
import BooleanLattice from './BooleanLattice';
import RootedGraph from './RootedGraph';

import ontology from './Ontology';

function Hello() {
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button" className="btn">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
        <Link to="boolean-lattice">boolean</Link>
      </div>
    </div>
  );
}

function Navagation() {
  const [active, setActive] = useState('home');
  const items = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'Boolean Lattice',
      path: '/boolean-lattice',
    },
    {
      name: 'Rooted Graph',
      path: '/rooted-graph',
    },
  ];

  const links = items.map((item) => (
    <Link
      key={item.name}
      className={`btn btn-ghost text-xl ${
        active === item.name && 'btn-active'
      }`}
      to={item.path}
      onClick={() => setActive(item.name)}
    >
      {item.name}
    </Link>
  ));

  return (
    <div className="w-dvw h-dvh flex flex-col">
      <div className="navbar border-y">{links}</div>
      <div className="content flex-grow">
        <Outlet />
      </div>
    </div>
  );
}

const router = createMemoryRouter([
  {
    path: '/',
    element: <Navagation />,
    children: [
      {
        path: '/',
        element: <Hello />,
      },
      {
        path: 'boolean-lattice',
        element: <BooleanLattice />,
      },
      {
        path: 'rooted-graph',
        element: <RootedGraph />,
      },
    ],
  },
]);

export default function App() {
  const onto = useContext(ontology);

  if (!onto.isInitialized()) {
    return (
      <div className="w-dvw h-dvh flex items-center justify-center text-center text-3xl sm:text-5xl text-gray-500">
        Please create or load an ontology first!
      </div>
    );
  }

  return <RouterProvider router={router} />;
}
