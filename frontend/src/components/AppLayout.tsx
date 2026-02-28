import { Outlet } from "react-router-dom";

const AppLayout: React.FC = () => {
  return (
    <div className="relative z-10 flex h-screen w-full">
      <Outlet />
    </div>
  );
};

export default AppLayout;
